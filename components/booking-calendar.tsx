'use client';

import { useMemo, useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBooking } from '@/app/actions/booking';
import { PaymentModal } from './payment-modal';
import type { CalendarMode, Room, SlotWithCounts } from '@/lib/types';

type Props = {
  mode: CalendarMode;
  rooms: Room[];
  slots: SlotWithCounts[];
  today?: string;
};

export function BookingCalendar({ mode, rooms, slots, today }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const safeToday = today || new Date().toISOString().slice(0, 10);

  const [selectedDate, setSelectedDate] = useState(safeToday);
  const [selectedSlot, setSelectedSlot] = useState<SlotWithCounts | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage]   = useState<string | null>(null);
  const [formSnapshot, setFormSnapshot] = useState({ name: '', phone: '', email: '' });

  const [localSlots, setLocalSlots] = useState(slots);

  useEffect(() => {
    setLocalSlots(slots);
  }, [slots]);

  const days = useMemo(() => {
    const arr: { iso: string; label: string }[] = [];
    const [y, m, d] = safeToday.split('-').map(Number);
    const baseDate = new Date(y, m - 1, d);
    const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(baseDate.getTime() + i * 86400000);
      const isoStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
      arr.push({ iso: isoStr, label: `${weekdays[nextDate.getDay()]}, ${nextDate.getDate()}` });
    }
    return arr;
  }, [safeToday]);

  const daySlots = useMemo(
    () => localSlots.filter((s) => s.date === selectedDate),
    [localSlots, selectedDate]
  );

  const timeRows = useMemo(() => {
    const set = new Set<string>();
    daySlots.forEach((s) => set.add(s.start_time.slice(0, 5)));
    return Array.from(set).sort();
  }, [daySlots]);

  const getSlot = (time: string, roomId: string) =>
    daySlots.find((s) => s.start_time.startsWith(time) && s.room_id === roomId);

  function isPast(s: SlotWithCounts) {
    if (s.date !== safeToday) return false;
    const now = new Date();
    const [h, m] = s.start_time.split(':').map(Number);
    const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
    return slotTime < now;
  }

  function remaining(s: SlotWithCounts): number {
    if (s.type === 'rental') return s.status === 'available' ? 1 : 0;
    return Math.max((s.capacity ?? 0) - s.booked_count, 0);
  }

  function isClickable(s: SlotWithCounts) {
    if (s.status !== 'available') return false;
    if (isPast(s)) return false;
    if (mode === 'schedule') return s.type === 'class' && remaining(s) > 0;
    return s.type === 'rental';
  }

  function openSlot(s: SlotWithCounts) {
    if (!isClickable(s)) return;
    setSelectedSlot(s);
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function handleSuccess() {
    if (!selectedSlot) return;
    
    // МГНОВЕННО обновляем интерфейс (оптимистично)
    setLocalSlots(prev => prev.map(s => {
      if (s.id === selectedSlot.id) {
        if (s.type === 'class') {
          const newCount = s.booked_count + 1;
          return { 
            ...s, 
            booked_count: newCount, 
            status: newCount >= (s.capacity ?? 0) ? 'booked' : 'available' 
          };
        }
        return { ...s, status: 'booked' };
      }
      return s;
    }));

    setSelectedSlot(null);
    setPaymentOpen(false);
    
    startTransition(() => {
      router.refresh();
    });
  }

  function submitClassBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot) return;
    const fd = new FormData(e.currentTarget);
    fd.set('slot_id', selectedSlot.id);
    fd.set('payment_amount', '0');

    startTransition(async () => {
      const res = await createBooking(fd);
      if (res.ok) {
        setSuccessMessage(res.message);
        handleSuccess();
      } else setErrorMessage(res.error);
    });
  }

  function proceedToPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSlot) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const choice = String(fd.get('payment_choice') ?? 'full');
    const amount = choice === 'half' ? Math.round(selectedSlot.price / 2) : selectedSlot.price;
    setPaymentAmount(amount);
    setFormSnapshot({
      name:  String(fd.get('name')  ?? ''),
      phone: String(fd.get('phone') ?? ''),
      email: String(fd.get('email') ?? ''),
    });
    setPaymentOpen(true);
  }

  function confirmPayment() {
    if (!selectedSlot) return;
    const fd = new FormData();
    fd.set('slot_id', selectedSlot.id);
    fd.set('name',  formSnapshot.name);
    fd.set('phone', formSnapshot.phone);
    fd.set('email', formSnapshot.email);
    fd.set('payment_amount', String(paymentAmount));

    startTransition(async () => {
      const res = await createBooking(fd);
      if (res.ok) {
        setSuccessMessage(res.message);
        handleSuccess();
      } else {
        setErrorMessage(res.error);
        setPaymentOpen(false);
      }
    });
  }

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2">
        {days.map((d) => {
          const active = selectedDate === d.iso;
          return (
            <button key={d.iso} type="button"
              onClick={() => { setSelectedDate(d.iso); setErrorMessage(null); }}
              className={`rounded-full border px-4 py-2 text-sm capitalize transition ${
                active ? 'border-gold bg-gold/10 text-gold'
                       : 'border-white/10 text-muted hover:border-white/20 hover:text-foreground'
              }`}>
              {d.label}
            </button>
          );
        })}
      </div>

      {successMessage && (
        <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
          {successMessage}
        </div>
      )}
      {errorMessage && !selectedSlot && (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-3xl border border-white/5 bg-surface">
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-muted">
              <th className="p-3 font-medium">Время</th>
              {rooms.map((r) => <th key={r.id} className="p-3 font-medium">Зал {r.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {timeRows.length === 0 && (
              <tr><td colSpan={rooms.length + 1} className="p-8 text-center text-muted">
                На этот день занятий нет — выберите другую дату.
              </td></tr>
            )}
            {timeRows.map((t) => (
              <tr key={t} className="border-b border-white/5 last:border-none align-top">
                <td className="p-3 font-display text-base text-gold whitespace-nowrap">{t}</td>
                {rooms.map((r) => {
                  const s = getSlot(t, r.id);
                  if (!s) return <td key={r.id} className="p-3 text-muted/30">—</td>;

                  const clickable = isClickable(s);
                  const left = remaining(s);
                  const past = isPast(s);

                  // РЕНДЕР АРЕНДЫ
                  if (s.type === 'rental') {
                    if (clickable) {
                      return (
                        <td key={r.id} className="p-3">
                          <button type="button" onClick={() => openSlot(s)}
                            className="w-full rounded-2xl border border-gold/40 px-3 py-2 text-left text-xs text-gold transition hover:bg-gold/10">
                            <div className="font-medium">Свободно</div>
                            <div className="mt-0.5 text-[11px] text-gold/80">
                              {s.price} ₽ · до {s.end_time.slice(0, 5)}
                            </div>
                          </button>
                        </td>
                      );
                    }
                    return (
                      <td key={r.id} className="p-3">
                        <div className="rounded-2xl bg-white/[0.03] px-3 py-2 text-xs text-muted">
                          <div className="font-medium">Занято</div>
                        </div>
                      </td>
                    );
                  }

                  // РЕНДЕР ЗАНЯТИЙ
                  if (clickable) {
                    return (
                      <td key={r.id} className="p-3">
                        <button type="button" onClick={() => openSlot(s)}
                          className="w-full rounded-2xl border border-gold/40 px-3 py-2 text-left text-xs text-gold transition hover:bg-gold/10">
                          <div className="font-medium">{s.title}</div>
                          <div className="mt-0.5 text-[11px] text-gold/80">
                            {s.instructor ?? ''} · {s.price} ₽
                          </div>
                          <div className="mt-0.5 text-[11px] text-gold/70">
                            Осталось {left} из {s.capacity}
                          </div>
                        </button>
                      </td>
                    );
                  }

                  return (
                    <td key={r.id} className="p-3">
                      <div className="rounded-2xl bg-white/[0.03] px-3 py-2 text-xs text-muted">
                        <div className="font-medium">{s.title}</div>
                        <div className="mt-0.5 text-[11px] text-muted/70">
                          {past ? 'Время прошло' : 'Группа набрана'}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlot && !paymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
             onClick={() => setSelectedSlot(null)}>
          <div className="card w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl">
              {mode === 'schedule' ? 'Запись на занятие' : 'Бронирование аренды'}
            </h3>
            <p className="mt-2 text-sm text-muted">
              {selectedSlot.type === 'class' ? selectedSlot.title : 'Аренда зала'} ·{' '}
              {selectedSlot.date}, {selectedSlot.start_time.slice(0, 5)}–{selectedSlot.end_time.slice(0, 5)} ·{' '}
              <span className="text-gold">{selectedSlot.price} ₽</span>
            </p>

            <form onSubmit={mode === 'schedule' ? submitClassBooking : proceedToPayment} className="mt-6 space-y-3">
              <input name="name"  required placeholder="Имя"     className="input" autoComplete="name" />
              <input name="phone" required placeholder="Телефон" className="input" autoComplete="tel" inputMode="tel" />
              <input name="email" required type="email" placeholder="Email" className="input" autoComplete="email" />

              {mode === 'rent' && (
                <div className="rounded-2xl border border-white/10 bg-background/60 p-4 text-xs">
                  <div className="mb-3 font-medium text-foreground/80">Предоплата</div>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center gap-3">
                      <div className="relative flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-surface-2">
                        <input type="radio" name="payment_choice" value="full" defaultChecked className="peer absolute inset-0 cursor-pointer opacity-0" />
                        <div className="h-2.5 w-2.5 rounded-full bg-gold opacity-0 transition-opacity peer-checked:opacity-100" />
                      </div>
                      <span className="text-foreground/90">Полная сумма — {selectedSlot.price} ₽</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                      <div className="relative flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-surface-2">
                        <input type="radio" name="payment_choice" value="half" className="peer absolute inset-0 cursor-pointer opacity-0" />
                        <div className="h-2.5 w-2.5 rounded-full bg-gold opacity-0 transition-opacity peer-checked:opacity-100" />
                      </div>
                      <span className="text-foreground/90">50% — {Math.round(selectedSlot.price / 2)} ₽</span>
                    </label>
                  </div>
                </div>
              )}

              {mode === 'schedule' && (
                <p className="rounded-2xl border border-white/10 bg-background/60 p-3 text-xs text-muted">
                  Оплата — у администратора в студии. Предоплата не требуется.
                </p>
              )}

              {errorMessage && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={pending} className="btn-primary flex-1">
                  {mode === 'schedule'
                    ? (pending ? 'Отправка…' : 'Записаться')
                    : 'Перейти к оплате'}
                </button>
                <button type="button" onClick={() => setSelectedSlot(null)} className="btn-outline">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <PaymentModal
        open={paymentOpen}
        amount={paymentAmount}
        slotLabel={
          selectedSlot
            ? `${selectedSlot.title} · ${selectedSlot.date}, ${selectedSlot.start_time.slice(0, 5)}–${selectedSlot.end_time.slice(0, 5)}`
            : ''
        }
        onCancel={() => setPaymentOpen(false)}
        onPaid={confirmPayment}
      />
    </div>
  );
}