import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Контакты студии FORM — Петроградская сторона',
  description: 'Адрес: ул. Профессора Попова, 12. Телефон, почта, соцсети. Как добраться от метро.',
};

export default function ContactsPage() {
  const mapUrl = `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(SITE.address)}&z=16`;

  return (
    <div className="container-page py-16">
      <h1 className="font-display text-4xl md:text-5xl">Контакты</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Петроградская сторона, четыре зала. Пишите или приходите.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* 1 ряд, слева: Как добраться */}
        <div className="card flex flex-col justify-start">
          <h2 className="font-display text-xl">Как добраться</h2>
          <p className="mt-4 text-sm text-muted">
            5 минут пешком от метро «Петроградская». Парковка во дворе и на соседней улице.
          </p>
        </div>

        {/* 1 ряд, справа: Связаться */}
        <div className="card flex flex-col justify-start">
          <h2 className="font-display text-xl">Связаться</h2>
          <div className="mt-4 space-y-3 text-sm">
            <p>
              Телефон: <a href={SITE.phoneHref} className="text-sm font-medium text-gold hover:underline">{SITE.phone}</a>
            </p>
            <p>
              Почта: <a href={`mailto:${SITE.email}`} className="text-sm font-medium text-gold hover:underline">{SITE.email}</a>
            </p>
            <p className="text-muted">Часы работы: {SITE.hours}</p>
            <div className="pt-2">
              <span className="text-muted">Соцсети: </span>
              <span className="flex gap-3 mt-1">
                {SITE.socials.map((s) => (
                  <a key={s.label} href={s.href} className="text-foreground hover:text-gold transition">
                    {s.label}
                  </a>
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* 2 ряд, слева: Форма */}
        <div className="card">
          <h2 className="font-display text-xl">Задать вопрос</h2>
          <p className="mt-2 text-sm text-muted mb-4">Мы ответим в течение рабочего дня.</p>
          <ContactForm />
        </div>

        {/* 2 ряд, справа: Карта */}
        <div className="relative min-h-[350px] overflow-hidden rounded-3xl border border-white/5 bg-surface-2">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            className="absolute inset-0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}