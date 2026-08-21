-- Treści strony (CMS). SQL Editor → wklej całość → Run

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  hero_eyebrow text not null default '',
  hero_headline text not null default '',
  hero_text text not null default '',
  hero_image text not null default '',
  about_title text not null default '',
  about_intro text not null default '',
  about_mission text not null default '',
  about_body text not null default '',
  about_caption text not null default '',
  pillar1_title text not null default '',
  pillar1_text text not null default '',
  pillar2_title text not null default '',
  pillar2_text text not null default '',
  pillar3_title text not null default '',
  pillar3_text text not null default '',
  stat_founded text not null default '',
  stat_area text not null default '',
  stat_members text not null default '',
  stat_plot text not null default '',
  email text not null default '',
  phone text not null default '',
  address_line1 text not null default '',
  address_line2 text not null default '',
  postal text not null default '',
  city text not null default '',
  hours text not null default '',
  pzl text not null default '',
  club_name text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  image_url text not null default '',
  sort_order int not null default 0
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text not null default '',
  caption text not null default '',
  span text not null default 'normal',
  sort_order int not null default 0
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  category text not null default 'Aktualności',
  published_on date not null default current_date,
  image_url text not null default '',
  body text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.board_members enable row level security;
alter table public.gallery_items enable row level security;
alter table public.news_posts enable row level security;

drop policy if exists "site_settings_read" on public.site_settings;
create policy "site_settings_read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings_admin" on public.site_settings;
create policy "site_settings_admin" on public.site_settings
  for all to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "board_read" on public.board_members;
create policy "board_read" on public.board_members
  for select to anon, authenticated using (true);

drop policy if exists "board_admin" on public.board_members;
create policy "board_admin" on public.board_members
  for all to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "gallery_read" on public.gallery_items;
create policy "gallery_read" on public.gallery_items
  for select to anon, authenticated using (true);

drop policy if exists "gallery_admin" on public.gallery_items;
create policy "gallery_admin" on public.gallery_items
  for all to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

drop policy if exists "news_read_public" on public.news_posts;
create policy "news_read_public" on public.news_posts
  for select to anon, authenticated
  using (published = true or public.current_user_role() = 'admin');

drop policy if exists "news_admin" on public.news_posts;
create policy "news_admin" on public.news_posts
  for all to authenticated
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "site_media_read" on storage.objects;
create policy "site_media_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'site-media');

drop policy if exists "site_media_admin_write" on storage.objects;
create policy "site_media_admin_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-media' and public.current_user_role() = 'admin');

drop policy if exists "site_media_admin_update" on storage.objects;
create policy "site_media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-media' and public.current_user_role() = 'admin');

drop policy if exists "site_media_admin_delete" on storage.objects;
create policy "site_media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-media' and public.current_user_role() = 'admin');

insert into public.site_settings (
  id, hero_eyebrow, hero_headline, hero_text, hero_image,
  about_title, about_intro, about_mission, about_body, about_caption,
  pillar1_title, pillar1_text, pillar2_title, pillar2_text, pillar3_title, pillar3_text,
  stat_founded, stat_area, stat_members, stat_plot,
  email, phone, address_line1, address_line2, postal, city, hours, pzl, club_name
) values (
  1,
  'Założone w 1978 · Okręg Kielecki PZŁ',
  'Las nas zobowiązuje.',
  'Koło Łowieckie „Bór” — gospodarka łowiecka, ochrona zwierzyny i wspólnota myśliwych w sercu polskich ostępów.',
  'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=2400&q=80',
  'Historia wpisana w las.',
  'Koło Łowieckie „Bór” powstało w 1978 roku. Od początku łączymy tradycję polskiego łowiectwa z troską o zwierzynę, drzewostan i ciszę ostępów. Jesteśmy częścią Okręgu Kieleckiego PZŁ.',
  'Nasza misja jest prosta: zostawić las w lepszym stanie, niż go zastaliśmy.',
  'Prowadzimy gospodarkę zgodnie z ustawą Prawo łowieckie i planem zagospodarowania obwodu. Współpracujemy z Nadleśnictwem, rolnikami i gminą.',
  'Obwód nr 47 · uroczyska Jawor, Smug i Bór',
  'Gospodarka',
  'Prowadzimy zrównoważoną gospodarkę łowiecką na 8 400 ha obwodu — zimą dokarmiamy, przez cały rok chronimy ostoję.',
  'Etyka',
  'Łowiectwo to odpowiedzialność, nie widowisko. Polujemy zgodnie z prawem, kulturą i poszanowaniem zwierzyny.',
  'Wspólnota',
  'Koło to ludzie: myśliwi, rodziny, leśnicy i sąsiedzi. Hubertus, szkolenia i praca w terenie łączą pokolenia.',
  '1978', '8 400 ha', '42', '47',
  'kontakt@klbor.pl', '+48 41 123 45 67',
  'Leśniczówka Bór', 'ul. Leśna 12', '26-001', 'Bór',
  'Wtorek i czwartek, 17:00–19:00', 'Okręg Kielecki PZŁ',
  'Koło Łowieckie „Bór”'
)
on conflict (id) do nothing;
