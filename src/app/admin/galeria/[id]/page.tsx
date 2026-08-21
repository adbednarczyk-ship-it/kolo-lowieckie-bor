import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoForm } from "./PhotoForm";
import { AlbumForm } from "../AlbumForm";
import { deleteAlbumImage } from "../actions";
import { AdminNav } from "@/components/AdminNav";
import { getGalleryAlbum } from "@/lib/gallery";
import { requireAdmin } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Zdjęcia albumu",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminAlbumPage({ params }: PageProps) {
  const { id } = await params;
  await requireAdmin();
  const data = await getGalleryAlbum(id);
  if (!data) notFound();
  const { album, images } = data;

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <AdminNav />
        <Link
          href="/admin/galeria"
          className="text-xs tracking-[0.2em] text-gold uppercase"
        >
          ← Albumy
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-cream">{album.title}</h1>
        <div className="mt-10">
          <AlbumForm album={album} />
        </div>
        <div className="mt-12">
          <PhotoForm albumId={album.id} />
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((image) => (
            <figure key={image.id} className="border border-cream/10">
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.image_url}
                  alt={image.alt || image.caption}
                  fill
                  className="object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 p-3 text-sm text-cream">
                <span>{image.caption || "Bez podpisu"}</span>
                <form action={deleteAlbumImage}>
                  <input type="hidden" name="id" value={image.id} />
                  <input type="hidden" name="album_id" value={album.id} />
                  <button type="submit" className="text-xs text-cream-muted uppercase hover:text-red-300">
                    Usuń
                  </button>
                </form>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
