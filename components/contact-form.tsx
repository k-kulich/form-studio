'use client';

import { useState } from 'react';
import { contactAction } from '@/app/actions/contact';

export function ContactForm() {
  const [done, setDone]       = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    await contactAction(fd);
    setPending(false);
    setDone(true);
    e.currentTarget.reset();
  }

  if (done) {
    return (
      <div className="card text-sm text-gold">
        Спасибо! Мы свяжемся с вами в течение рабочего дня.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input  name="name"    required placeholder="Имя"     className="input" autoComplete="name" />
      <input  name="phone"   required placeholder="Телефон" className="input" autoComplete="tel" inputMode="tel" />
      <textarea name="message" rows={4} placeholder="Вопрос" className="input" />
      <button disabled={pending} className="btn-primary w-full">
        {pending ? 'Отправка…' : 'Отправить'}
      </button>
    </form>
  );
}