import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/server';
import { BookingCalendar } from '@/components/booking-calendar';
import type { Room, SlotWithCounts } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Расписание занятий — FORM',
  description: 'High Heels, Strip Plastic и стретчинг. Все залы и часы на одном экране.',
};

export default async function SchedulePage() {
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
      .eq('type', 'class')
      .gte('date', todayStr)
      .lte('date', nextWeek)
      .order('start_time'),
  ]);

  return (
    <div className="container-page py-16">
      <h1 className="font-display text-4xl md:text-5xl">Расписание занятий</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Выберите занятие в удобное время и запишитесь — оплата у администратора в студии.
      </p>

      <div className="mt-8 flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold" /> Занятие — можно записаться
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white/20" /> Группа набрана
        </span>
      </div>

      <BookingCalendar
        mode="schedule"
        rooms={(rooms ?? []) as Room[]}
        slots={(slots ?? []) as SlotWithCounts[]}
        today={todayStr}
      />
    </div>
  );
}