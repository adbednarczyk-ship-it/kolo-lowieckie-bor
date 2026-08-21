import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlbumForm } from "./AlbumForm";
import { deleteAlbum } from "./actions";
import { AdminNav } from "@/components/AdminNav";
import { getGalleryAlbums } from "@/lib/gallery";
import { requireAdmin } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Albumy galerii",
  robots: { index: false, follow: false },
};

export default async function AdminGalleryPage() {
  await requireAdmin();
  const albums = await getGalleryAlbums();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <AdminNav />
        <h1 className="font-serif text-4xl text-cream">Albumy galerii</h1>
        <p className="mt-4 mb-10 text-cream-muted">
          Najpierw utwórz album (np. Hubertus 2025), potem dodaj do niego zdjęcia.
        </p>
        <AlbumForm />
        {albums.length === 0 ? (
          <p className="mt-12 text-cream-muted">Nie ma jeszcze albumów.</p>
        ) : (
          <ul className="mt-12 divide-y divide-cream/10 border-y border-cream/10">
            {albums.map((album) => (
              <li
                key={album.id}
                className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link href={`/admin/galeria/${album.id}`} className="flex items-center gap-4">
                  <div className="relative h-16 w-24 overflow-hidden bg-charcoal-soft">
                    {album.cover_image_url ? (
                      <Image
                        src={album.cover_image_url}
                        alt={album.title}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-serif text-xl text-cream">{album.title}</p>
                    <p className="text-sm text-cream-muted">
                      {album.photo_count}{" "}
                      {album.photo_count === 1 ? "zdjęcie" : "zdjęć"}
                    </p>
                  </div>
                </Link>
                <div className="flex gap-4 text-xs tracking-[0.14em] uppercase">
                  <Link href={`/admin/galeria/${album.id}`} className="text-gold">
                    Zdjęcia
                  </Link>
                  <form action={deleteAlbum}>
                    <input type="hidden" name="id" value={album.id} />
                    <button type="submit" className="text-cream-muted hover:text-red-300">
                      Usuń album
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
