export type Room = {
  id: string;
  slug: string;
  name: string;
  size_m2: number;
  capacity: number;
  description: string;
  features: string[];
  sort_order: number;
  base_day_price: number;
  base_evening_price: number;
  base_weekend_price: number;
};

export type TimeSlot = {
  id: string;
  room_id: string;
  date: string;
  start_time: string;
  end_time: string;
  type: 'class' | 'rental';
  status: 'available' | 'booked' | 'blocked';
  title: string;
  instructor: string | null;
  price: number;
  capacity: number | null;
  booked_count: number;
};

export type SlotWithRoom = TimeSlot & {
  rooms: { name: string; slug: string } | null;
};

export type Booking = {
  id: string;
  slot_id: string;
  name: string;
  phone: string;
  email: string;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_amount: number;
  created_at: string;
};

export type CalendarMode = 'schedule' | 'rent';

export type SlotWithCounts = TimeSlot;