'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',          label: 'Главная' },
  { href: '/classes',   label: 'Занятия' },
  { href: '/schedule',  label: 'Расписание' }, 
  { href: '/rent',      label: 'Аренда' },
  { href: '/contacts',  label: 'Контакты' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-[0.25em] text-foreground">
          FORM
        </Link>

        <nav className="hidden gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition ${
                pathname === l.href ? 'text-gold' : 'text-muted hover:text-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/contacts" className="btn-primary hidden md:inline-flex">
          Задать вопрос
        </Link>
        <Link href="/contacts" className="btn-primary md:hidden">
          Связь
        </Link>
      </div>
    </header>
  );
}