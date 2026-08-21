-- Albumy galerii. SQL Editor → wklej całość → Run

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  cover_image_url text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums (id) on delete cascade,
  image_url text not null,
  alt text not null default '',
  caption text not null default '',
  sort_order int not null default 0
);

create index if not exists gallery_images_album_idx
  on public.gallery_images (album_id, sort_order);

alter table public.gallery_albums enable row level security;
alter table public.gallery_images enable row level security;

drop policy if exists "gallery_albums_read" on public.gallery_albums;
create policy "gallery_albums_read"
  on public.gallery_albums for select
  to anon, authenticated
  using (true);

drop policy if exists "gallery_albums_admin" on public.gallery_albums;
create policy "gallery_albums_admin"
  on public.gallery_albums for all
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "gallery_images_read" on public.gallery_images;
create policy "gallery_images_read"
  on public.gallery_images for select
  to anon, authenticated
  using (true);

drop policy if exists "gallery_images_admin" on public.gallery_images;
create policy "gallery_images_admin"
  on public.gallery_images for all
  to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');
