import type { Metadata } from 'next';
import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { BookingCalendar } from '@/components/booking-calendar';
import { PriceTable } from '@/components/price-table';
import { Photo } from '@/components/photo';
import { RENT_BENEFITS, ROOMS } from '@/lib/constants';
import type { Room, SlotWithCounts } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Аренда зала в Санкт-Петербурге — FORM',
  description: 'Почасовая аренда четырёх залов на Петроградской с онлайн-бронированием и предоплатой.',
};

export default async function RentPage() {
  const supabase = createPublicClient();

  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const nextWeek = new Date(new Date(todayStr).getTime() + 7 * 86_400_000).toISOString().slice(0, 10);

  const [{ data: rooms }, { data: slots }] = await Promise.all([
    supabase.from('rooms').select('*').order('sort_order'),
    supabase
      .from('time_slots')
      .select('*')
      .gte('date', todayStr)
      .lte('date', nextWeek)
      .order('start_time'),
  ]);

  return (
    <div className="container-page py-16">
      <h1 className="font-display text-4xl md:text-5xl">
        Свободный зал — в вашем расписании
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Бронируйте онлайн с предоплатой — 100% или 50%. Занятия студии и уже занятые
        слоты видны сразу.
      </p>

      <section className="mt-12 grid gap-4 md:grid-cols-4">
        {RENT_BENEFITS.map((b) => (
          <div key={b.title} className="card">
            <div className="text-sm font-medium text-gold">{b.title}</div>
            <p className="mt-2 text-sm text-muted">{b.text}</p>
          </div>
        ))}
      </section>

      <BookingCalendar
        mode="rent"
        rooms={(rooms ?? []) as Room[]}
        slots={(slots ?? []) as SlotWithCounts[]}
        today={todayStr}
      />

      <section className="mt-16">
        <h2 className="font-display text-3xl md:text-4xl">Четыре зала</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {ROOMS.map((r) => (
            <div key={r.slug} className="card">
              <div className="grid gap-2 md:grid-cols-2">
                {r.photos.map((p, i) => (
                  <Photo
                    key={i}
                    src={p}
                    alt={`Зал ${r.name} — фото ${i + 1}`}
                    label={`Зал ${r.name}`}
                    ratio="aspect-square"
                  />
                ))}
              </div>
              <h3 className="mt-4 font-display text-xl">
                Зал {r.name} · {r.size_m2} м²
              </h3>
              <p className="mt-2 text-sm text-muted">{r.description}</p>
              <p className="mt-2 text-sm text-muted">
                Особенности: {r.features.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl md:text-4xl">Прайс</h2>
        <PriceTable />
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="font-display text-xl">Условия</h3>
          <ul className="mt-4 space-y-2 text-sm text-foreground/90">
            <li>• Минимальная аренда — 1 час</li>
            <li>• Предоплата 100% или 50% (остаток — на месте)</li>
            <li>• Раздевалка и душ включены</li>
            <li>• Отмена за 24 часа бесплатно</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="font-display text-xl">Для кого</h3>
          <ul className="mt-4 space-y-2 text-sm text-foreground/90">
            <li>• Хореографам — репетиции и постановки</li>
            <li>• Тренерам по йоге и стретчингу</li>
            <li>• Фото- и видеосъёмкам</li>
            <li>• Репетициям с проектором (Black)</li>
          </ul>
        </div>
      </section>

      <section className="mt-16">
        <div className="card flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted">
            Ещё не определились с залом? Посмотрите общее расписание.
          </p>
          <Link href="/schedule" className="btn-outline">
            Открыть расписание занятий
          </Link>
        </div>
      </section>
    </div>
  );
}