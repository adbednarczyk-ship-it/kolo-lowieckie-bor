-- Zgłoszenia szkód łowieckich. SQL Editor → wklej całość → Run

create table if not exists public.damage_reports (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null default '',
  email text not null,
  plot_location text not null,
  description text not null,
  noticed_on date not null,
  status text not null default 'nowe',
  assignee_id uuid references public.profiles (id) on delete set null,
  internal_notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.damage_photos (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.damage_reports (id) on delete cascade,
  image_url text not null
);

alter table public.damage_reports enable row level security;
alter table public.damage_photos enable row level security;

drop policy if exists "damage_reports_insert_public" on public.damage_reports;
create policy "damage_reports_insert_public"
  on public.damage_reports for insert
  to anon, authenticated
  with check (true);

drop policy if exists "damage_reports_staff_read" on public.damage_reports;
create policy "damage_reports_staff_read"
  on public.damage_reports for select
  to authenticated
  using (public.is_staff());

drop policy if exists "damage_reports_staff_update" on public.damage_reports;
create policy "damage_reports_staff_update"
  on public.damage_reports for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "damage_photos_insert_public" on public.damage_photos;
create policy "damage_photos_insert_public"
  on public.damage_photos for insert
  to anon, authenticated
  with check (true);

drop policy if exists "damage_photos_staff_read" on public.damage_photos;
create policy "damage_photos_staff_read"
  on public.damage_photos for select
  to authenticated
  using (public.is_staff());
