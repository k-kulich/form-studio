'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CLASSES, HERO_PHOTO, INSTRUCTORS, REVIEWS, ROOMS, STUDIO_PHOTOS } from '@/lib/constants';
import { Photo } from '@/components/photo';
import { DetailModal } from '@/components/detail-modal';

export default function HomePage() {
  const [roomModal, setRoomModal] = useState<null | typeof ROOMS[number]>(null);
  const [instructorModal, setInstructorModal] = useState<null | typeof INSTRUCTORS[number]>(null);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Photo src={HERO_PHOTO} alt="Студия FORM" ratio="aspect-auto" className="h-full w-full rounded-none border-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="container-page relative flex min-h-[80vh] flex-col items-start justify-center py-24">
          <span className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-gold">
            Петроградская сторона
          </span>
          <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">
            Танцы на Петроградской —<br />с нуля и для продолжающих
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            High Heels, Strip Plastic и стретчинг в студии FORM. Пробное занятие — 600 ₽,
            запись онлайн. Аренда залов — тоже есть, но сначала о занятиях.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/schedule" className="btn-primary">Записаться на занятие</Link>
            <Link href="/rent" className="btn-outline">Аренда зала</Link>
          </div>
        </div>
      </section>

      {/* ДВА СЦЕНАРИЯ */}
      <section className="container-page py-20">
        <h2 className="font-display text-3xl md:text-4xl">Два сценария — одно пространство</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="card">
            <div className="text-xs uppercase tracking-widest text-gold">Занятия</div>
            <h3 className="mt-3 font-display text-2xl">Учиться — с нуля или продолжая</h3>
            <p className="mt-3 text-muted">
              В расписании видно, какие группы подходят вашему уровню, сколько осталось
              мест и кто ведёт. Запись — меньше минуты, без звонков.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/90">
              <li>• Пробное занятие — 600 ₽</li>
              <li>• Группы до 12 человек</li>
              <li>• Онлайн-запись, оплата у администратора</li>
            </ul>
            <Link href="/schedule" className="btn-primary mt-8">К расписанию</Link>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-widest text-gold">Аренда</div>
            <h3 className="mt-3 font-display text-2xl">Снять зал почасово</h3>
            <p className="mt-3 text-muted">
              Для хореографов, тренеров и фотографов. Свободные окна видны сразу,
              бронь за 30 секунд с предоплатой онлайн.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-foreground/90">
              <li>• Бронь с предоплатой (100% или 50%)</li>
              <li>• Все занятые слоты видны сразу</li>
              <li>• Отмена бесплатно за 24 часа</li>
            </ul>
            <Link href="/rent" className="btn-outline mt-8">К аренде</Link>
          </div>
        </div>
      </section>

      {/* НАПРАВЛЕНИЯ с фото */}
      <section className="container-page py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl md:text-4xl">Направления</h2>
          <Link href="/classes" className="btn-outline">Все направления</Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CLASSES.map((c) => (
            <div key={c.slug} className="card flex flex-col">
              <Photo src={c.photo} alt={c.name} label={c.name} />
              <h3 className="mt-4 font-display text-2xl">{c.name}</h3>
              <p className="mt-3 text-sm text-muted">{c.gives}</p>
              <p className="mt-2 text-sm text-muted">Ведёт: {c.instructor}</p>
              <div className="mt-auto pt-6">
                <Link href="/schedule" className="btn-primary w-full">Записаться</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ПРОСТРАНСТВО: галерея */}
      <section className="container-page py-20">
        <h2 className="font-display text-3xl md:text-4xl">Пространство</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Четыре зала, раздевалка, душ, ресепшен и зона ожидания. Можно прийти
          за 15 минут до занятия — никто не торопит.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {ROOMS.map((r) => (
            <button
              key={r.slug}
              type="button"
              onClick={() => setRoomModal(r)}
              className="group relative text-left"
            >
              <Photo src={r.photos[0]} alt={`Зал ${r.name}`} label={`Зал ${r.name}`} />
              <div className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-xs text-gold">
                Зал {r.name} · {r.size_m2} м²
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STUDIO_PHOTOS.map((p) => (
            <Photo key={p.label} src={p.src} alt={p.label} label={p.label} ratio="aspect-square" />
          ))}
        </div>
      </section>

      {/* ПРЕПОДАВАТЕЛИ с фото-модалкой */}
      <section className="container-page py-20">
        <h2 className="font-display text-3xl md:text-4xl">Преподаватели</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {INSTRUCTORS.map((i) => (
            <button
              key={i.name}
              type="button"
              onClick={() => setInstructorModal(i)}
              className="card text-left"
            >
              <Photo src={i.photo} alt={i.name} label={i.name} ratio="aspect-[3/4]" />
              <div className="mt-4 text-xs uppercase tracking-widest text-gold">{i.direction}</div>
              <h3 className="mt-2 font-display text-xl">{i.name}</h3>
              <p className="mt-2 text-sm text-muted">{i.bio}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section className="container-page py-20">
        <h2 className="font-display text-3xl md:text-4xl">Отзывы</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.author} className="card">
              <p className="text-foreground/90">«{r.text}»</p>
              <div className="mt-6 text-sm text-muted">— {r.author}</div>
            </div>
          ))}
        </div>
      </section>

      {/* АРЕНДА (второстепенный блок) */}
      <section className="container-page pb-20">
        <div className="card">
          <div className="text-xs uppercase tracking-widest text-gold">Аренда</div>
          <h2 className="mt-3 font-display text-2xl md:text-3xl">Нужен зал под репетицию или съёмку?</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Сдаём залы почасово: репетиции, съёмки, йога, небольшие группы. Бронирование
            онлайн с предоплатой — слот закрепляется за вами сразу.
          </p>
          <Link href="/rent" className="btn-outline mt-6">Перейти к аренде</Link>
        </div>
      </section>

      {/* Модалки */}
      {roomModal && (
        <DetailModal
          open
          onClose={() => setRoomModal(null)}
          title={`Зал ${roomModal.name}`}
          subtitle={`${roomModal.size_m2} м² · до ${roomModal.capacity} человек`}
          photos={[...roomModal.photos]}
          description={roomModal.description}
          meta={[
            { label: 'Особенности', value: roomModal.features.join(', ') },
          ]}
          cta={{ label: 'Забронировать зал', href: '/rent' }}
        />
      )}

      {instructorModal && (
        <DetailModal
          open
          onClose={() => setInstructorModal(null)}
          title={instructorModal.name}
          subtitle={instructorModal.direction}
          photos={[instructorModal.photo]} //{[instructorModal.photo, instructorModal.actionPhoto]}
          photoRatio="aspect-[3/4]"
          description={instructorModal.longBio}
          cta={{ label: 'Записаться на занятие', href: '/schedule' }}
        />
      )}
    </>
  );
}