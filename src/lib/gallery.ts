import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  type GalleryAlbum,
  type GalleryAlbumCard,
  type GalleryImage,
} from "@/types/gallery";

export async function getGalleryAlbums() {
  if (!isSupabaseConfigured()) return [] as GalleryAlbumCard[];
  try {
    const supabase = await createServerSupabaseClient();
    const { data: albums } = await supabase
      .from("gallery_albums")
      .select("id, title, description, cover_image_url, sort_order, created_at")
      .order("sort_order")
      .order("created_at");
    if (!albums?.length) return [];

    const { data: images } = await supabase
      .from("gallery_images")
      .select("id, album_id, image_url, alt, caption, sort_order")
      .order("sort_order");

    const byAlbum = new Map<string, GalleryImage[]>();
    for (const image of (images as GalleryImage[] | null) ?? []) {
      const list = byAlbum.get(image.album_id) ?? [];
      list.push(image);
      byAlbum.set(image.album_id, list);
    }

    return (albums as GalleryAlbum[]).map((album) => {
      const photos = byAlbum.get(album.id) ?? [];
      return {
        ...album,
        cover_image_url: album.cover_image_url || photos[0]?.image_url || "",
        photo_count: photos.length,
      };
    });
  } catch {
    return [];
  }
}

export async function getGalleryAlbum(id: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabaseClient();
  const { data: album } = await supabase
    .from("gallery_albums")
    .select("id, title, description, cover_image_url, sort_order, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!album) return null;
  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, album_id, image_url, alt, caption, sort_order")
    .eq("album_id", id)
    .order("sort_order");
  return {
    album: album as GalleryAlbum,
    images: (images as GalleryImage[] | null) ?? [],
  };
}
