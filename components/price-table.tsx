import { RENT_PRICES } from '@/lib/constants';

export function PriceTable() {
  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-white/5 bg-surface">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-muted">
            <th className="p-4">Зал</th>
            <th className="p-4">Будни до 15:00</th>
            <th className="p-4">Будни после 15:00</th>
            <th className="p-4">Выходные</th>
          </tr>
        </thead>
        <tbody>
          {RENT_PRICES.map((r) => (
            <tr key={r.room} className="border-b border-white/5 last:border-none">
              <td className="p-4 font-medium">{r.room}</td>
              <td className="p-4 text-foreground/90">{r.weekdayDay}</td>
              <td className="p-4 text-foreground/90">{r.weekdayEvening}</td>
              <td className="p-4 text-foreground/90">{r.weekend}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-white/5 p-4 text-xs text-muted">
        Абонемент 8 часов — скидка ~15%. 16 часов — ~20%. Для регулярных арендаторов — индивидуальные условия на утренние часы.
      </div>
    </div>
  );
}