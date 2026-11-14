'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/unisender';

export type BookingResult = { ok: true; message: string } | { ok: false; error: string };

const STUDIO_EMAIL = process.env.STUDIO_EMAIL ?? 'hello@form-studio.ru';

export async function createBooking(formData: FormData): Promise<BookingResult> {
  const slotId        = String(formData.get('slot_id')        ?? '').trim();
  const name          = String(formData.get('name')           ?? '').trim();
  const phone         = String(formData.get('phone')          ?? '').trim();
  const email         = String(formData.get('email')          ?? '').trim().toLowerCase();
  const paymentAmount = Number(formData.get('payment_amount') ?? 0);

  if (!slotId || !name || !phone || !email) {
    return { ok: false, error: 'Заполните все поля' };
  }

  const supabase = createAdminClient();

  const { data: slot, error: slotErr } = await supabase
    .from('time_slots')
    .select('id, room_id, date, start_time, end_time, type, status, title, price, instructor, capacity, booked_count, rooms(name)')
    .eq('id', slotId)
    .single();

  if (slotErr || !slot) return { ok: false, error: 'Слот не найден' };
  if (slot.status !== 'available') {
    return {
      ok: false,
      error: slot.type === 'class'
        ? 'Группа уже набрана. Посмотрите другое время.'
        : 'Этот слот только что заняли. Выберите другое время.',
    };
  }

  const roomName = (slot.rooms as { name?: string } | null)?.name ?? '';
  const dateStr  = slot.date;
  const timeStr  = `${slot.start_time.slice(0, 5)}–${slot.end_time.slice(0, 5)}`;

  // =================================================================
  // ЗАНЯТИЕ (групповое)
  // =================================================================
  if (slot.type === 'class') {
    const capacity = slot.capacity ?? 0;
    if (capacity === 0) return { ok: false, error: 'У занятия не задана вместимость' };
    if (slot.booked_count >= capacity) return { ok: false, error: 'Группа уже набрана.' };

    // 1. Проверка дубля
    const { data: dup } = await supabase
      .from('bookings')
      .select('id')
      .eq('slot_id', slotId)
      .or(`email.eq.${email},phone.eq.${phone}`)
      .maybeSingle();

    if (dup) {
      return {
        ok: false,
        error: 'Вы уже записаны на это занятие. Если потеряли письмо — свяжитесь с нами по телефону.',
      };
    }

    // 2. Вставка брони
    const { error: insErr } = await supabase.from('bookings').insert({
      slot_id: slotId, name, phone, email,
      payment_status: 'unpaid', payment_amount: 0,
    });

    if (insErr) {
      if (insErr.code === '23505') return { ok: false, error: 'Вы уже записаны на это занятие.' };
      return { ok: false, error: 'Не удалось сохранить запись. Попробуйте ещё раз.' };
    }

    // 3. Обновление счетчика и статуса в time_slots
    const newCount = slot.booked_count + 1;
    const newStatus = newCount >= capacity ? 'booked' : 'available';
    
    await supabase
      .from('time_slots')
      .update({ booked_count: newCount, status: newStatus })
      .eq('id', slotId);

    // Письма
    void sendEmail({
      to: email,
      subject: 'Запись на занятие подтверждена — FORM',
      html: `
        <p>Здравствуйте, ${name}!</p>
        <p>Вы записаны на занятие <b>«${slot.title}»</b>.</p>
        <p>${dateStr}, ${timeStr}, зал ${roomName}. Преподаватель: ${slot.instructor ?? '—'}.</p>
        <p>Стоимость: <b>${slot.price} ₽</b>. Оплата — у администратора в студии.</p>
      `,
    }).catch((e) => console.error('[booking] email client', e));

    void sendEmail({
      to: STUDIO_EMAIL,
      subject: 'Новая запись на занятие — FORM',
      html: `
        <p><b>${slot.title}</b> · ${roomName}</p>
        <p>${dateStr}, ${timeStr}. Записался: ${name}, ${phone}, ${email}.</p>
        <p>Мест занято: ${newCount} из ${capacity}.</p>
      `,
    }).catch((e) => console.error('[booking] email studio', e));

    revalidatePath('/schedule');

    return {
      ok: true,
      message: `Готово! Вы записаны на ${dateStr}, ${timeStr}, зал ${roomName}. Оплата — у администратора.`,
    };
  }

  // =================================================================
  // АРЕНДА (одна бронь на слот)
  // =================================================================
  const { data: claimed } = await supabase
    .from('time_slots')
    .update({ status: 'booked' })
    .eq('id', slotId)
    .eq('status', 'available')
    .select('id')
    .maybeSingle();

  if (!claimed) {
    return { ok: false, error: 'Этот слот только что заняли. Выберите другое время.' };
  }

  const paymentStatus = paymentAmount > 0 ? 'paid' : 'unpaid';

  const { error: bookErr } = await supabase.from('bookings').insert({
    slot_id: slotId, name, phone, email,
    payment_status: paymentStatus,
    payment_amount: paymentAmount,
  });

  if (bookErr) {
    await supabase.from('time_slots').update({ status: 'available' }).eq('id', slotId);
    return { ok: false, error: 'Не удалось сохранить бронь. Попробуйте ещё раз.' };
  }

  const remainder = Math.max(slot.price - paymentAmount, 0);

  void sendEmail({
    to: email,
    subject: 'Аренда подтверждена — FORM',
    html: `
      <p>Здравствуйте, ${name}!</p>
      <p>Вы забронировали зал <b>${roomName}</b> на ${dateStr}, ${timeStr}.</p>
      <p>Предоплата: <b>${paymentAmount} ₽</b>. Остаток на месте: ${remainder} ₽.</p>
    `,
  }).catch((e) => console.error('[booking] email client', e));

  void sendEmail({
    to: STUDIO_EMAIL,
    subject: 'Новая бронь аренды — FORM',
    html: `
      <p>Зал <b>${roomName}</b> · ${dateStr}, ${timeStr}.</p>
      <p>Клиент: ${name}, ${phone}, ${email}.</p>
      <p>Оплачено: ${paymentAmount} ₽ (${paymentAmount >= slot.price ? 'полная' : '50%'}), остаток ${remainder} ₽.</p>
    `,
  }).catch((e) => console.error('[booking] email studio', e));

  revalidatePath('/rent');

  return {
    ok: true,
    message: `Готово! Зал ${roomName} забронирован на ${dateStr}, ${timeStr}.`,
  };
}