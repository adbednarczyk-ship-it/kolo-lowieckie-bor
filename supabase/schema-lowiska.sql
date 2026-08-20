-- Łowiska + rezerwacje godzin. SQL Editor → wklej całość → Run

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('admin', 'board')
$$;

create table if not exists public.hunting_grounds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  location text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.ground_reservations (
  id uuid primary key default gen_random_uuid(),
  ground_id uuid not null references public.hunting_grounds (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reserved_on date not null,
  starts_at time not null,
  ends_at time not null,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists ground_reservations_day_idx
  on public.ground_reservations (ground_id, reserved_on);

alter table public.hunting_grounds enable row level security;
alter table public.ground_reservations enable row level security;

drop policy if exists "grounds_select" on public.hunting_grounds;
create policy "grounds_select"
  on public.hunting_grounds for select
  to authenticated
  using (true);

drop policy if exists "grounds_write_admin" on public.hunting_grounds;
create policy "grounds_write_admin"
  on public.hunting_grounds for all
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "ground_reservations_select" on public.ground_reservations;
create policy "ground_reservations_select"
  on public.ground_reservations for select
  to authenticated
  using (true);

drop policy if exists "ground_reservations_insert_own" on public.ground_reservations;
create policy "ground_reservations_insert_own"
  on public.ground_reservations for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "ground_reservations_delete_own_or_staff" on public.ground_reservations;
create policy "ground_reservations_delete_own_or_staff"
  on public.ground_reservations for delete
  to authenticated
  using (auth.uid() = user_id or public.is_staff());
