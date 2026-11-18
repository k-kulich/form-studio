import Link from 'next/link';
import type { Metadata } from 'next';
import { CLASSES } from '@/lib/constants';
import { Photo } from '@/components/photo';
import { ScrollReveal } from '@/components/scroll-reveal';

export const metadata: Metadata = {
  title: 'Занятия High Heels, Strip Plastic и стретчинг — FORM',
  description:
    'Группы для начинающих и продолжающих. Пробное занятие 600 ₽. Расписание и запись онлайн.',
};

export default function ClassesPage() {
  return (
    <div className="container-page py-16">
      <h1 className="font-display text-4xl md:text-5xl">
        Занятия: High Heels, Strip Plastic, Стретчинг
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Группы для начинающих и продолжающих. Пробное — 600 ₽, запись онлайн.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {CLASSES.map((c, index) => (
          <ScrollReveal key={c.slug} delay={index * 150}>
            <div className="card flex flex-col h-full group transition-all duration-300 hover:-translate-y-2 hover:border-gold/30 hover:shadow-[0_20px_40px_-20px_rgba(198,169,107,0.15)]">
              <Photo src={c.photo} alt={c.name} label={c.name} className="transition-transform duration-500 group-hover:scale-[1.02]" />
              <h2 className="mt-4 font-display text-2xl transition-colors group-hover:text-gold">{c.name}</h2>
              <p className="mt-3 text-sm text-muted">Уровень: {c.level}</p>
              <p className="mt-3 text-sm text-muted">Что даёт: {c.gives}</p>
              <p className="mt-3 text-sm text-muted">Длительность: {c.duration}</p>
              <p className="mt-3 text-sm text-muted">Как проходит: {c.how}</p>
              <p className="mt-4 text-sm text-gold">{c.price}</p>
              <p className="mt-2 text-sm text-muted">Ведёт: {c.instructor}</p>
              <Link href="/schedule" className="btn-primary mt-6 w-full">Записаться</Link>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <section className="mt-20 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="font-display text-xl">Как проходит занятие</h3>
          <ol className="mt-4 space-y-3 text-sm text-foreground/90">
            <li><span className="text-gold">1.</span> Разминка — 10–15 минут: суставы, мышцы, дыхание.</li>
            <li><span className="text-gold">2.</span> Техника — 15–20 минут: разбираем элементы и следим за телом.</li>
            <li><span className="text-gold">3.</span> Связка или растяжка — 20 минут: собираем движения или работаем над гибкостью.</li>
          </ol>
        </div>

        <div className="card">
          <h3 className="font-display text-xl">Что взять с собой</h3>
          <ul className="mt-4 space-y-2 text-sm text-foreground/90">
            <li>• Удобная форма. Для High Heels — каблук или устойчивая обувь.</li>
            <li>• Для стретчинга — носочки или чешки.</li>
            <li>• Небольшая бутылка воды.</li>
            <li>• Коврик для стретчинга (можно взять у нас, но лучше свой).</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 card">
        <h3 className="font-display text-2xl">Первое занятие — 600 ₽</h3>
        <p className="mt-3 max-w-2xl text-muted">
          Попробуйте любое направление без обязательств. На пробном вы познакомитесь
          с преподавателем, разберёте базовые движения и поймёте, подходит ли вам группа.
        </p>
        <Link href="/schedule" className="btn-primary mt-6">Записаться на пробное</Link>
      </section>
    </div>
  );
}