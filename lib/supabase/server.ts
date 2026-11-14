import { createClient } from '@supabase/supabase-js';

const URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SRV  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Публичное чтение — RLS read-only. Используется в Server Components. */
export function createPublicClient() {
  if (!URL || !ANON) throw new Error('Supabase env (URL / ANON) not set');
  return createClient(URL, ANON, { auth: { persistSession: false } });
}

/** Service-role — только для Server Actions. Обходит RLS. */
export function createAdminClient() {
  if (!URL || !SRV) throw new Error('Supabase env (URL / SERVICE_ROLE) not set');
  return createClient(URL, SRV, { auth: { persistSession: false } });
}