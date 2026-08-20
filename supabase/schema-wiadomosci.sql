-- Wiadomości wewnętrzne. SQL Editor → wklej całość → Run

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.message_recipients (
  message_id uuid not null references public.messages (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  read_at timestamptz,
  primary key (message_id, user_id)
);

alter table public.messages enable row level security;
alter table public.message_recipients enable row level security;

drop policy if exists "messages_select_involved" on public.messages;
create policy "messages_select_involved"
  on public.messages for select
  to authenticated
  using (
    sender_id = auth.uid()
    or exists (
      select 1
      from public.message_recipients r
      where r.message_id = messages.id
        and r.user_id = auth.uid()
    )
  );

drop policy if exists "messages_insert_staff" on public.messages;
create policy "messages_insert_staff"
  on public.messages for insert
  to authenticated
  with check (public.is_staff() and sender_id = auth.uid());

drop policy if exists "recipients_select_own" on public.message_recipients;
create policy "recipients_select_own"
  on public.message_recipients for select
  to authenticated
  using (user_id = auth.uid() or public.is_staff());

drop policy if exists "recipients_insert_staff" on public.message_recipients;
create policy "recipients_insert_staff"
  on public.message_recipients for insert
  to authenticated
  with check (public.is_staff());

drop policy if exists "recipients_update_own" on public.message_recipients;
create policy "recipients_update_own"
  on public.message_recipients for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
