-- Zbiórki i polowania. SQL Editor → wklej całość → Run

create table if not exists public.club_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  event_time text,
  location text not null default '',
  description text not null default '',
  capacity int,
  signup_type text not null default 'members',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  check (capacity is null or capacity > 0),
  check (signup_type in ('public', 'members'))
);

create table if not exists public.event_signups (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.club_events (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade,
  guest_name text not null default '',
  guest_email text not null default '',
  guest_phone text not null default '',
  created_at timestamptz not null default now()
);

create unique index if not exists event_signups_member_unique
  on public.event_signups (event_id, user_id)
  where user_id is not null;

create unique index if not exists event_signups_guest_email_unique
  on public.event_signups (event_id, lower(guest_email))
  where guest_email <> '';

create index if not exists club_events_date_idx on public.club_events (event_date);
create index if not exists event_signups_event_idx on public.event_signups (event_id);

alter table public.club_events enable row level security;
alter table public.event_signups enable row level security;

drop policy if exists "club_events_read" on public.club_events;
create policy "club_events_read"
  on public.club_events for select
  to anon, authenticated
  using (true);

drop policy if exists "club_events_staff_write" on public.club_events;
create policy "club_events_staff_write"
  on public.club_events for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

drop policy if exists "event_signups_read_own_or_staff" on public.event_signups;
create policy "event_signups_read_own_or_staff"
  on public.event_signups for select
  to authenticated
  using (user_id = auth.uid() or public.is_staff());

drop policy if exists "event_signups_insert_member" on public.event_signups;
create policy "event_signups_insert_member"
  on public.event_signups for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "event_signups_insert_public" on public.event_signups;
create policy "event_signups_insert_public"
  on public.event_signups for insert
  to anon, authenticated
  with check (
    user_id is null
    and exists (
      select 1 from public.club_events e
      where e.id = event_id and e.signup_type = 'public'
    )
  );

drop policy if exists "event_signups_delete_own_or_staff" on public.event_signups;
create policy "event_signups_delete_own_or_staff"
  on public.event_signups for delete
  to authenticated
  using (user_id = auth.uid() or public.is_staff());
