import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";
import { type GalleryAlbumCard } from "@/types/gallery";

export function Gallery({ albums }: { albums: GalleryAlbumCard[] }) {
  return (
    <section id="galeria" className="scroll-mt-24 bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            index="04"
            eyebrow="Galeria"
            title="Ostępy, które strzeżemy."
            description="Zdjęcia pogrupowane według wydarzeń. Wejdź w album, żeby zobaczyć galerię."
          />
        </FadeIn>

        {albums.length === 0 ? (
          <p className="mt-16 text-cream-muted">
            Albumy pojawią się, gdy administrator doda pierwsze wydarzenie.
          </p>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album, index) => (
              <FadeIn key={album.id} delay={0.06 * index}>
                <Link href={`/galeria/${album.id}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-soft">
                    {album.cover_image_url ? (
                      <Image
                        src={album.cover_image_url}
                        alt={album.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-serif text-2xl text-cream group-hover:text-gold">
                        {album.title}
                      </h3>
                      <p className="mt-1 text-sm text-cream-muted">
                        {album.photo_count}{" "}
                        {album.photo_count === 1 ? "zdjęcie" : "zdjęć"}
                      </p>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
