-- ========== ЗАЛЫ ==========
insert into rooms (slug, name, size_m2, capacity, description, features, sort_order,
                   base_day_price, base_evening_price, base_weekend_price)
values
('gold',   'Gold',   60, 20, 'Зеркала в пол, станки, профессиональный звук.',
 '["Зеркала в пол","Станки","Звук","Софиты"]', 1, 1300, 2000, 2200),
('black',  'Black',  45, 15, 'Тёмный зал с софитами и проектором.',
 '["Софиты","Проектор","Звук","Тёмный фон"]', 2, 1100, 1700, 1800),
('light',  'Light',  40, 12, 'Светлый зал с панорамными окнами.',
 '["Панорамные окна","Дневной свет","Тишина"]', 3, 1000, 1500, 1600),
('studio', 'Studio', 35, 10, 'Универсальный зал с мобильными зеркалами.',
 '["Мобильные зеркала","Универсальный свет"]', 4, 900, 1400, 1500);

-- ========== СЛОТЫ: 8:00–22:00 почасово, 14 дней ==========
insert into time_slots (room_id, date, start_time, end_time, type, status, title, price)
select
  r.id,
  d::date,
  (h || ':00')::time,
  ((h + 1) || ':00')::time,
  'rental',
  'available',
  'Аренда',
  case
    when extract(isodow from d) between 1 and 5 then
      case when h < 15 then r.base_day_price else r.base_evening_price end
    else r.base_weekend_price
  end
from rooms r
cross join generate_series(current_date, current_date + 13, interval '1 day') as d
cross join generate_series(8, 21) as h;

-- ========== ЗАНЯТИЯ: накладываем поверх аренды ==========
do $$
declare
  d date;
  gid uuid; bid uuid; lid uuid; sid uuid;
begin
  select id into gid from rooms where slug = 'gold';
  select id into bid from rooms where slug = 'black';
  select id into lid from rooms where slug = 'light';
  select id into sid from rooms where slug = 'studio';

  for d in select generate_series(current_date, current_date + 13, interval '1 day')::date loop

    if extract(isodow from d) between 1 and 5 then
      update time_slots set type='class', title='High Heels с нуля',
             instructor='Анна Верейская', price=1100
        where room_id=gid and date=d and start_time='18:00';
      update time_slots set type='class', title='High Heels продолжающие',
             instructor='Анна Верейская', price=1100
        where room_id=gid and date=d and start_time='19:00';

      update time_slots set type='class', title='Strip Plastic',
             instructor='Мария Соколова', price=1100
        where room_id=bid and date=d and start_time='18:00';
      update time_slots set type='class', title='Strip Plastic продолжающие',
             instructor='Мария Соколова', price=1100
        where room_id=bid and date=d and start_time='19:00';

      update time_slots set type='class', title='Стретчинг утренний',
             instructor='Елена Крылова', price=900
        where room_id=lid and date=d and start_time='10:00';
      update time_slots set type='class', title='Стретчинг вечерний',
             instructor='Елена Крылова', price=900
        where room_id=lid and date=d and start_time='19:00';
    else
      update time_slots set type='class', title='Йога / Стретчинг',
             instructor='Елена Крылова', price=900
        where room_id=lid and date=d and start_time='09:00';
      update time_slots set type='class', title='Стретчинг интенсив',
             instructor='Елена Крылова', price=900
        where room_id=lid and date=d and start_time='11:00';
      update time_slots set type='class', title='High Heels интенсив',
             instructor='Анна Верейская', price=1100
        where room_id=gid and date=d and start_time='11:00';
    end if;

  end loop;
end $$;

-- ========== ВМЕСТИМОСТЬ ГРУПП ==========
update time_slots set capacity = case
  when room_id = (select id from rooms where slug='gold')   then 12
  when room_id = (select id from rooms where slug='black')  then 10
  when room_id = (select id from rooms where slug='light')  then 8
  when room_id = (select id from rooms where slug='studio') then 7
end
where type = 'class' and capacity is null;

-- ========== ДЕМО-ЗАПИСИ (3 человека на ближайший High Heels) ==========
do $$
declare v_slot_id uuid;
begin
  select id into v_slot_id from time_slots
    where type='class' and title='High Heels с нуля'
    order by date, start_time limit 1;

  if v_slot_id is not null then
    insert into bookings (slot_id, name, phone, email, payment_status, payment_amount) values
      (v_slot_id, 'Демо Клиент 1', '+79000000001', 'demo1@example.com', 'unpaid', 0),
      (v_slot_id, 'Демо Клиент 2', '+79000000002', 'demo2@example.com', 'unpaid', 0),
      (v_slot_id, 'Демо Клиент 3', '+79000000003', 'demo3@example.com', 'unpaid', 0);
  end if;
end $$;