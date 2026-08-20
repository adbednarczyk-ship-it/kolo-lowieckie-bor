-- Księga polowań. Supabase → SQL Editor → wklej całość → Run

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('admin', 'board')
$$;

create table if not exists public.hunts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  hunt_date date not null,
  meeting_time text,
  location text not null default '',
  notes text not null default '',
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.stands (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid not null references public.hunts (id) on delete cascade,
  name text not null,
  sort_order int not null default 0
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  hunt_id uuid not null references public.hunts (id) on delete cascade,
  stand_id uuid not null references public.stands (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (stand_id),
  unique (hunt_id, user_id)
);

alter table public.hunts enable row level security;
alter table public.stands enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "profiles_select_club" on public.profiles;
create policy "profiles_select_club"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "hunts_select" on public.hunts;
create policy "hunts_select"
  on public.hunts for select
  to authenticated
  using (true);

drop policy if exists "hunts_write_staff" on public.hunts;
create policy "hunts_write_staff"
  on public.hunts for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "stands_select" on public.stands;
create policy "stands_select"
  on public.stands for select
  to authenticated
  using (true);

drop policy if exists "stands_write_staff" on public.stands;
create policy "stands_write_staff"
  on public.stands for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "reservations_select" on public.reservations;
create policy "reservations_select"
  on public.reservations for select
  to authenticated
  using (true);

drop policy if exists "reservations_insert_own" on public.reservations;
create policy "reservations_insert_own"
  on public.reservations for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "reservations_delete_own_or_staff" on public.reservations;
create policy "reservations_delete_own_or_staff"
  on public.reservations for delete
  to authenticated
  using (auth.uid() = user_id or public.is_staff());
