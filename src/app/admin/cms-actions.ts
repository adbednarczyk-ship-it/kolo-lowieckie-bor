"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/slug";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/profile";
import { resolveImageUrl } from "@/lib/upload";

export type CmsState = { error?: string; success?: string } | undefined;

function refreshPublic() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/tresc");
  revalidatePath("/admin/zarzad");
  revalidatePath("/admin/galeria");
  revalidatePath("/admin/aktualnosci");
}

export async function saveSiteSettings(
  _prev: CmsState,
  formData: FormData,
): Promise<CmsState> {
  await requireAdmin();
  try {
    const heroImage = await resolveImageUrl(
      formData,
      "hero",
      String(formData.get("current_hero_image") ?? ""),
    );
    const admin = createServiceSupabaseClient();
    const { error } = await admin.from("site_settings").upsert({
      id: 1,
      hero_eyebrow: String(formData.get("hero_eyebrow") ?? "").trim(),
      hero_headline: String(formData.get("hero_headline") ?? "").trim(),
      hero_text: String(formData.get("hero_text") ?? "").trim(),
      hero_image: heroImage,
      about_title: String(formData.get("about_title") ?? "").trim(),
      about_intro: String(formData.get("about_intro") ?? "").trim(),
      about_mission: String(formData.get("about_mission") ?? "").trim(),
      about_body: String(formData.get("about_body") ?? "").trim(),
      about_caption: String(formData.get("about_caption") ?? "").trim(),
      pillar1_title: String(formData.get("pillar1_title") ?? "").trim(),
      pillar1_text: String(formData.get("pillar1_text") ?? "").trim(),
      pillar2_title: String(formData.get("pillar2_title") ?? "").trim(),
      pillar2_text: String(formData.get("pillar2_text") ?? "").trim(),
      pillar3_title: String(formData.get("pillar3_title") ?? "").trim(),
      pillar3_text: String(formData.get("pillar3_text") ?? "").trim(),
      stat_founded: String(formData.get("stat_founded") ?? "").trim(),
      stat_area: String(formData.get("stat_area") ?? "").trim(),
      stat_members: String(formData.get("stat_members") ?? "").trim(),
      stat_plot: String(formData.get("stat_plot") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      address_line1: String(formData.get("address_line1") ?? "").trim(),
      address_line2: String(formData.get("address_line2") ?? "").trim(),
      postal: String(formData.get("postal") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      hours: String(formData.get("hours") ?? "").trim(),
      pzl: String(formData.get("pzl") ?? "").trim(),
      club_name: String(formData.get("club_name") ?? "").trim(),
      updated_at: new Date().toISOString(),
    });
    if (error) return { error: error.message };
    refreshPublic();
    return { success: "Zapisano treść strony." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Nie udało się zapisać." };
  }
}

export async function addBoardMember(
  _prev: CmsState,
  formData: FormData,
): Promise<CmsState> {
  await requireAdmin();
  try {
    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 2) return { error: "Podaj imię i nazwisko." };
    const image_url = (await resolveImageUrl(formData, "board")) || "";
    const admin = createServiceSupabaseClient();
    const { error } = await admin.from("board_members").insert({
      name,
      role: String(formData.get("role") ?? "").trim(),
      image_url,
      sort_order: Number(formData.get("sort_order") ?? 0),
    });
    if (error) return { error: error.message };
    refreshPublic();
    return { success: "Dodano osobę do zarządu." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Błąd zapisu." };
  }
}

export async function deleteBoardMember(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createServiceSupabaseClient();
  await admin.from("board_members").delete().eq("id", id);
  refreshPublic();
}

export async function addGalleryItem(
  _prev: CmsState,
  formData: FormData,
): Promise<CmsState> {
  await requireAdmin();
  try {
    const image_url = await resolveImageUrl(formData, "gallery");
    if (!image_url) return { error: "Dodaj zdjęcie albo wklej adres URL." };
    const admin = createServiceSupabaseClient();
    const { error } = await admin.from("gallery_items").insert({
      image_url,
      alt: String(formData.get("alt") ?? "").trim(),
      caption: String(formData.get("caption") ?? "").trim(),
      span: String(formData.get("span") ?? "normal"),
      sort_order: Number(formData.get("sort_order") ?? 0),
    });
    if (error) return { error: error.message };
    refreshPublic();
    return { success: "Dodano zdjęcie." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Błąd zapisu." };
  }
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createServiceSupabaseClient();
  await admin.from("gallery_items").delete().eq("id", id);
  refreshPublic();
}

export async function saveNewsPost(
  _prev: CmsState,
  formData: FormData,
): Promise<CmsState> {
  await requireAdmin();
  try {
    const id = String(formData.get("id") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    if (title.length < 3) return { error: "Podaj tytuł." };
    const currentImage = String(formData.get("current_image") ?? "");
    const image_url = (await resolveImageUrl(formData, "news", currentImage)) || "";
    const slugBase = slugify(String(formData.get("slug") ?? title));
    const slug = slugBase || `wpis-${Date.now()}`;
    const payload = {
      title,
      slug,
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      category: String(formData.get("category") ?? "Aktualności").trim(),
      published_on: String(formData.get("published_on") ?? "").slice(0, 10),
      image_url,
      body: String(formData.get("body") ?? "").trim(),
      published: formData.get("published") === "on",
    };

    const admin = createServiceSupabaseClient();
    const { error } = id
      ? await admin.from("news_posts").update(payload).eq("id", id)
      : await admin.from("news_posts").insert(payload);
    if (error) return { error: error.message };
    refreshPublic();
    revalidatePath(`/aktualnosci/${slug}`);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Błąd zapisu." };
  }
  redirect("/admin/aktualnosci");
}

export async function deleteNewsPost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createServiceSupabaseClient();
  await admin.from("news_posts").delete().eq("id", id);
  refreshPublic();
}

export async function toggleNewsPublished(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "") === "true";
  if (!id) return;
  const admin = createServiceSupabaseClient();
  await admin.from("news_posts").update({ published: !published }).eq("id", id);
  refreshPublic();
}
