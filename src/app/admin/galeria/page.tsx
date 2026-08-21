import type { Metadata } from "next";
import Image from "next/image";
import { GalleryForm } from "./GalleryForm";
import { deleteGalleryItem } from "../cms-actions";
import { AdminNav } from "@/components/AdminNav";
import { getGalleryItems } from "@/lib/cms";
import { requireAdmin } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Galeria",
  robots: { index: false, follow: false },
};

export default async function AdminGalleryPage() {
  await requireAdmin();
  const items = await getGalleryItems();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <AdminNav />
        <h1 className="font-serif text-4xl text-cream">Galeria</h1>
        <p className="mt-4 mb-10 text-cream-muted">
          Wgraj plik z komputera albo wklej adres zdjęcia.
        </p>
        <GalleryForm />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((item) => (
            <figure key={item.id} className="border border-cream/10">
              <div className="relative aspect-[4/3]">
                <Image src={item.image_url} alt={item.alt || item.caption} fill className="object-cover" />
              </div>
              <figcaption className="flex items-center justify-between p-3 text-sm text-cream">
                <span>{item.caption || "Bez podpisu"}</span>
                {!item.id.startsWith("static-") ? (
                  <form action={deleteGalleryItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="text-xs text-cream-muted uppercase hover:text-red-300">
                      Usuń
                    </button>
                  </form>
                ) : (
                  <span className="text-xs text-cream-muted">przykład</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
