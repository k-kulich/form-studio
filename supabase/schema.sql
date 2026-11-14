-- ============================================================
-- FORM Studio — схема БД (актуальная версия)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- ЗАЛЫ ----------
create table if not exists rooms (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text unique not null,
  name                 text not null,
  size_m2              int  not null,
  capacity             int  not null,
  description          text not null,
  features             jsonb not null default '[]'::jsonb,
  sort_order           int  not null default 0,
  base_day_price       numeric(10,2) not null default 1000,
  base_evening_price   numeric(10,2) not null default 1500,
  base_weekend_price   numeric(10,2) not null default 1600
);

-- ---------- СЛОТЫ ----------
create table if not exists time_slots (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references rooms(id) on delete cascade,
  date        date not null,
  start_time  time not null,
  end_time    time not null,
  type        text not null check (type in ('class','rental')),
  status      text not null default 'available'
              check (status in ('available','booked','blocked')),
  title       text not null,
  instructor  text,
  price       numeric(10,2) not null,
  capacity    int,                          -- для занятий; для аренды null
  created_at  timestamptz not null default now(),
  constraint uniq_slot_per_hour unique (room_id, date, start_time)
);

create index if not exists idx_time_slots_date    on time_slots(date);
create index if not exists idx_time_slots_room    on time_slots(room_id);
create index if not exists idx_time_slots_status  on time_slots(status);

-- ---------- БРОНИ ----------
create table if not exists bookings (
  id              uuid primary key default gen_random_uuid(),
  slot_id         uuid not null references time_slots(id) on delete cascade,
  name            text not null,
  phone           text not null,
  email           text not null,
  payment_status  text not null default 'unpaid'
                  check (payment_status in ('unpaid','paid','refunded')),
  payment_amount  numeric(10,2) not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists idx_bookings_slot on bookings(slot_id);

-- Защита от дублей: один человек — одна запись на слот
create unique index if not exists uniq_booking_email_per_slot
  on bookings (slot_id, lower(email));
create unique index if not exists uniq_booking_phone_per_slot
  on bookings (slot_id, phone);

-- ---------- RLS ----------
alter table rooms       enable row level security;
alter table time_slots  enable row level security;
alter table bookings    enable row level security;

create policy "rooms_public_read" on rooms
  for select using (true);

create policy "slots_public_read" on time_slots
  for select using (true);

-- bookings: только service_role (обходит RLS), публичных политик нет

-- Добавляем колонку для хранения количества записавшихся
alter table time_slots add column if not exists booked_count int not null default 0;

-- Наполняем её текущими данными из таблицы bookings (чтобы демо-данные не сломались)
update time_slots ts
set booked_count = (
  select count(*) from bookings b where b.slot_id = ts.id
);