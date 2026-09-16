-- DHPlay: execute no SQL Editor do Supabase.
create table if not exists public.dhplay_state (
  id text primary key default 'main',
  user_id uuid references auth.users(id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.dhplay_state enable row level security;
drop policy if exists "dhplay_authenticated_read" on public.dhplay_state;
create policy "dhplay_authenticated_read" on public.dhplay_state for select to authenticated using (true);
drop policy if exists "dhplay_authenticated_insert" on public.dhplay_state;
create policy "dhplay_authenticated_insert" on public.dhplay_state for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "dhplay_authenticated_update" on public.dhplay_state;
create policy "dhplay_authenticated_update" on public.dhplay_state for update to authenticated using (true) with check (auth.uid() = user_id);
create or replace function public.touch_dhplay_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists touch_dhplay_updated_at on public.dhplay_state;
create trigger touch_dhplay_updated_at before update on public.dhplay_state for each row execute function public.touch_dhplay_updated_at();

