"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/profile";
import { resolveImageUrl } from "@/lib/upload";

export type AlbumState = { error?: string; success?: string } | undefined;

function refresh(albumId?: string) {
  revalidatePath("/");
  revalidatePath("/admin/galeria");
  if (albumId) {
    revalidatePath(`/admin/galeria/${albumId}`);
    revalidatePath(`/galeria/${albumId}`);
  }
}

export async function saveAlbum(
  _prev: AlbumState,
  formData: FormData,
): Promise<AlbumState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 2) return { error: "Podaj nazwę albumu." };

  try {
    const cover = await resolveImageUrl(
      formData,
      "albums",
      String(formData.get("current_cover") ?? ""),
    );
    const payload = {
      title,
      description: String(formData.get("description") ?? "").trim(),
      cover_image_url: cover,
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    };
    const admin = createServiceSupabaseClient();
    if (id) {
      const { error } = await admin.from("gallery_albums").update(payload).eq("id", id);
      if (error) return { error: error.message };
      refresh(id);
      return { success: "Zapisano album." };
    }
    const { error } = await admin.from("gallery_albums").insert(payload);
    if (error) return { error: error.message };
    refresh();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Nie udało się zapisać albumu." };
  }
  redirect("/admin/galeria");
}

export async function deleteAlbum(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createServiceSupabaseClient();
  await admin.from("gallery_albums").delete().eq("id", id);
  refresh();
  redirect("/admin/galeria");
}

export async function addAlbumImage(
  _prev: AlbumState,
  formData: FormData,
): Promise<AlbumState> {
  await requireAdmin();
  const albumId = String(formData.get("album_id") ?? "");
  if (!albumId) return { error: "Brak albumu." };
  try {
    const image_url = await resolveImageUrl(formData, "albums");
    if (!image_url) return { error: "Dodaj zdjęcie albo wklej adres URL." };
    const admin = createServiceSupabaseClient();
    const { error } = await admin.from("gallery_images").insert({
      album_id: albumId,
      image_url,
      alt: String(formData.get("alt") ?? "").trim(),
      caption: String(formData.get("caption") ?? "").trim(),
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    });
    if (error) return { error: error.message };
    refresh(albumId);
    return { success: "Dodano zdjęcie." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Nie udało się dodać zdjęcia." };
  }
}

export async function deleteAlbumImage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const albumId = String(formData.get("album_id") ?? "");
  if (!id) return;
  const admin = createServiceSupabaseClient();
  await admin.from("gallery_images").delete().eq("id", id);
  refresh(albumId);
}
