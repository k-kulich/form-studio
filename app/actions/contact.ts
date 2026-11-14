'use server';

import { sendEmail } from '@/lib/unisender';

const STUDIO_EMAIL = process.env.STUDIO_EMAIL ?? 'hello@form-studio.ru';

export async function contactAction(formData: FormData): Promise<void> {
  const name    = String(formData.get('name')    ?? '').trim();
  const phone   = String(formData.get('phone')   ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!name || !phone) return;

  await sendEmail({
    to: STUDIO_EMAIL,
    subject: 'Новый вопрос — FORM',
    html: `<p>От: <b>${name}</b>, ${phone}</p><p>${message || '—'}</p>`,
  }).catch((e) => console.error('[contact]', e));
}