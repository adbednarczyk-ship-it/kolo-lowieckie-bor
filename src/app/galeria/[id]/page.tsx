import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { getGalleryAlbum } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Album",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function PublicAlbumPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getGalleryAlbum(id);
  if (!data) notFound();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link href="/#galeria" className="text-xs tracking-[0.2em] text-gold uppercase">
          ← Galeria
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-cream sm:text-5xl">
          {data.album.title}
        </h1>
        {data.album.description ? (
          <p className="mt-4 max-w-2xl text-cream-muted">{data.album.description}</p>
        ) : null}
        <GalleryLightbox images={data.images} />
      </div>
    </main>
  );
}
