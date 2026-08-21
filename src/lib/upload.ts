import { createServiceSupabaseClient } from "@/lib/supabase/admin";

export async function uploadPublicImage(file: File, folder: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 6 * 1024 * 1024) {
    throw new Error("Zdjęcie jest za duże (maks. 6 MB).");
  }

  const admin = createServiceSupabaseClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from("site-media").upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = admin.storage.from("site-media").getPublicUrl(path);
  return data.publicUrl;
}

export async function resolveImageUrl(
  formData: FormData,
  folder: string,
  current?: string,
) {
  const file = formData.get("image");
  const pasted = String(formData.get("image_url") ?? "").trim();
  if (file instanceof File && file.size > 0) {
    return uploadPublicImage(file, folder);
  }
  if (pasted) return pasted;
  return current ?? "";
}
