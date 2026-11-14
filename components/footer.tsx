import Link from 'next/link';
import { SITE } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-surface/50">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-xl tracking-[0.25em]">FORM</div>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Студия танцев High Heels, Strip Plastic и стретчинга на Петроградской стороне. 
            Четыре зала, запись онлайн без звонков. Аренда залов доступна по запросу.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-gold">Адрес</div>
          <p className="mt-3 text-sm text-muted">{SITE.address}</p>
          <p className="mt-2 text-sm text-muted">{SITE.hours}</p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-gold">Связь</div>
          <p className="mt-3 text-sm">
            <a href={SITE.phoneHref} className="text-foreground hover:text-gold">{SITE.phone}</a>
          </p>
          <p className="mt-1 text-sm">
            <a href={`mailto:${SITE.email}`} className="text-muted hover:text-gold">{SITE.email}</a>
          </p>
          <div className="mt-3 flex gap-4 text-sm">
            {SITE.socials.map((s) => (
              <Link key={s.label} href={s.href} className="text-muted hover:text-gold">
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} FORM Studio · Демо-концепт, вымышленный бренд
      </div>
    </footer>
  );
}