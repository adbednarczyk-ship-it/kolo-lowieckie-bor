import { club, board, gallery, news } from "@/data/content";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  type BoardMember,
  type GalleryItem,
  type NewsPost,
  type SiteSettings,
} from "@/types/cms";

export const defaultSettings: SiteSettings = {
  hero_eyebrow: `Założone w ${club.founded} · ${club.pzl}`,
  hero_headline: "Las nas zobowiązuje.",
  hero_text: `${club.name} — gospodarka łowiecka, ochrona zwierzyny i wspólnota myśliwych w sercu polskich ostępów.`,
  hero_image:
    "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=2400&q=80",
  about_title: "Historia wpisana w las.",
  about_intro: `${club.name} powstało w ${club.founded} roku. Od początku łączymy tradycję polskiego łowiectwa z troską o zwierzynę, drzewostan i ciszę ostępów. Jesteśmy częścią ${club.pzl}.`,
  about_mission:
    "Nasza misja jest prosta: zostawić las w lepszym stanie, niż go zastaliśmy.",
  about_body:
    "Prowadzimy gospodarkę zgodnie z ustawą Prawo łowieckie i planem zagospodarowania obwodu. Współpracujemy z Nadleśnictwem, rolnikami i gminą. Edukujemy młodzież, dbamy o bezpieczeństwo polowań i kultywujemy zwyczaje, które nie potrzebują krzykliwej oprawy — wystarczy rzetelna praca.",
  about_caption: "Obwód nr 47 · uroczyska Jawor, Smug i Bór",
  pillar1_title: "Gospodarka",
  pillar1_text:
    "Prowadzimy zrównoważoną gospodarkę łowiecką na 8 400 ha obwodu — zimą dokarmiamy, przez cały rok chronimy ostoję.",
  pillar2_title: "Etyka",
  pillar2_text:
    "Łowiectwo to odpowiedzialność, nie widowisko. Polujemy zgodnie z prawem, kulturą i poszanowaniem zwierzyny.",
  pillar3_title: "Wspólnota",
  pillar3_text:
    "Koło to ludzie: myśliwi, rodziny, leśnicy i sąsiedzi. Hubertus, szkolenia i praca w terenie łączą pokolenia.",
  stat_founded: String(club.founded),
  stat_area: "8 400 ha",
  stat_members: String(club.members),
  stat_plot: "47",
  email: club.email,
  phone: club.phone,
  address_line1: club.address.line1,
  address_line2: club.address.line2,
  postal: club.address.postal,
  city: club.address.city,
  hours: club.hours,
  pzl: club.pzl,
  club_name: club.name,
};

const defaultBoard: BoardMember[] = board.map((member, index) => ({
  id: `static-board-${index}`,
  name: member.name,
  role: member.role,
  image_url: member.image,
  sort_order: index + 1,
}));

const defaultGallery: GalleryItem[] = gallery.map((item, index) => ({
  id: `static-gallery-${index}`,
  image_url: item.src,
  alt: item.alt,
  caption: item.caption,
  span: item.span,
  sort_order: index + 1,
}));

const defaultNews: NewsPost[] = news.map((item, index) => ({
  id: `static-news-${index}`,
  slug: item.slug,
  title: item.title,
  excerpt: item.excerpt,
  category: item.category,
  published_on: item.date,
  image_url: item.image,
  body: item.content.join("\n\n"),
  published: true,
}));

export async function getSiteSettings() {
  if (!isSupabaseConfigured()) return defaultSettings;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (!data) return defaultSettings;
    return { ...defaultSettings, ...(data as SiteSettings) };
  } catch {
    return defaultSettings;
  }
}

export async function getBoardMembers() {
  if (!isSupabaseConfigured()) return defaultBoard;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("board_members")
      .select("id, name, role, image_url, sort_order")
      .order("sort_order");
    if (!data?.length) return defaultBoard;
    return data as BoardMember[];
  } catch {
    return defaultBoard;
  }
}

export async function getGalleryItems() {
  if (!isSupabaseConfigured()) return defaultGallery;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("gallery_items")
      .select("id, image_url, alt, caption, span, sort_order")
      .order("sort_order");
    if (!data?.length) return defaultGallery;
    return data as GalleryItem[];
  } catch {
    return defaultGallery;
  }
}

export async function getPublishedNews() {
  if (!isSupabaseConfigured()) return defaultNews;
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("news_posts")
      .select("id, slug, title, excerpt, category, published_on, image_url, body, published")
      .eq("published", true)
      .order("published_on", { ascending: false });
    if (!data?.length) return defaultNews;
    return data as NewsPost[];
  } catch {
    return defaultNews;
  }
}

export async function getNewsBySlug(slug: string) {
  const published = await getPublishedNews();
  return published.find((item) => item.slug === slug) ?? null;
}

export async function getPublicContent() {
  const [settings, boardMembers, galleryItems, newsPosts] = await Promise.all([
    getSiteSettings(),
    getBoardMembers(),
    getGalleryItems(),
    getPublishedNews(),
  ]);
  return { settings, boardMembers, galleryItems, newsPosts };
}
