"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { type GalleryImage } from "@/types/gallery";

export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () =>
      setActive((current) =>
        current === null ? current : (current + images.length - 1) % images.length,
      ),
    [images.length],
  );
  const next = useCallback(
    () =>
      setActive((current) =>
        current === null ? current : (current + 1) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, next, prev]);

  if (!images.length) {
    return <p className="mt-10 text-cream-muted">Ten album jest jeszcze pusty.</p>;
  }

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(index)}
            className="group relative aspect-[4/3] overflow-hidden"
          >
            <Image
              src={image.image_url}
              alt={image.alt || image.caption}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            {image.caption ? (
              <span className="absolute inset-x-0 bottom-0 bg-charcoal/70 p-3 text-left text-sm text-cream opacity-0 transition group-hover:opacity-100">
                {image.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {active !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/92 px-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-6 right-6 text-sm tracking-[0.2em] text-cream uppercase"
            >
              Zamknij
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                prev();
              }}
              className="absolute left-4 text-cream"
              aria-label="Poprzednie"
            >
              ←
            </button>
            <motion.div
              key={images[active].id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative h-[72vh] w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={images[active].image_url}
                alt={images[active].alt || images[active].caption}
                fill
                className="object-contain"
              />
              <p className="absolute inset-x-0 -bottom-10 text-center font-serif text-cream">
                {images[active].caption}
              </p>
            </motion.div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              className="absolute right-4 text-cream"
              aria-label="Następne"
            >
              →
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
