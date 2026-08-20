"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { gallery } from "@/data/content";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () =>
      setActive((current) =>
        current === null
          ? current
          : (current + gallery.length - 1) % gallery.length,
      ),
    [],
  );
  const next = useCallback(
    () =>
      setActive((current) =>
        current === null ? current : (current + 1) % gallery.length,
      ),
    [],
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

  return (
    <section
      id="galeria"
      className="scroll-mt-24 bg-charcoal-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            index="04"
            eyebrow="Galeria"
            title="Ostępy, które strzeżemy."
            description="Las, zwierzyna i światło — kadry z obwodu nr 47. Kliknij zdjęcie, aby otworzyć."
          />
        </FadeIn>

        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {gallery.map((item, index) => (
            <FadeIn
              key={item.src}
              delay={0.04 * index}
              className={
                item.span === "wide"
                  ? "col-span-2"
                  : item.span === "tall"
                    ? "row-span-2"
                    : ""
              }
            >
              <button
                type="button"
                onClick={() => setActive(index)}
                className="group relative block h-full min-h-[220px] w-full overflow-hidden md:min-h-[260px]"
                aria-label={`Otwórz zdjęcie: ${item.caption}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-charcoal/0 transition group-hover:bg-charcoal/25" />
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-sm text-cream opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  {item.caption}
                </span>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/92 px-4 backdrop-blur-md"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Podgląd zdjęcia"
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
              className="absolute left-4 text-cream md:left-8"
              aria-label="Poprzednie zdjęcie"
            >
              ←
            </button>
            <motion.div
              key={gallery[active].src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="relative h-[72vh] w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={gallery[active].src}
                alt={gallery[active].alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
              <p className="absolute inset-x-0 -bottom-10 text-center font-serif text-cream">
                {gallery[active].caption}
              </p>
            </motion.div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              className="absolute right-4 text-cream md:right-8"
              aria-label="Następne zdjęcie"
            >
              →
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
