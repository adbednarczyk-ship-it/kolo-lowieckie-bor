export type SiteSettings = {
  hero_eyebrow: string;
  hero_headline: string;
  hero_text: string;
  hero_image: string;
  about_title: string;
  about_intro: string;
  about_mission: string;
  about_body: string;
  about_caption: string;
  pillar1_title: string;
  pillar1_text: string;
  pillar2_title: string;
  pillar2_text: string;
  pillar3_title: string;
  pillar3_text: string;
  stat_founded: string;
  stat_area: string;
  stat_members: string;
  stat_plot: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  postal: string;
  city: string;
  hours: string;
  pzl: string;
  club_name: string;
};

export type BoardMember = {
  id: string;
  name: string;
  role: string;
  image_url: string;
  sort_order: number;
};

export type GalleryItem = {
  id: string;
  image_url: string;
  alt: string;
  caption: string;
  span: "wide" | "tall" | "normal";
  sort_order: number;
};

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_on: string;
  image_url: string;
  body: string;
  published: boolean;
};
