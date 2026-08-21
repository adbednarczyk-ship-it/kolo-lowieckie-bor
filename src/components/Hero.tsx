"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { type SiteSettings } from "@/types/cms";

export function Hero({ settings }: { settings: SiteSettings }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 180]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.35]);

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 scale-110">
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 18, ease: "linear" }}
          className="h-full w-full"
        >
          <Image
            src={settings.hero_image}
            alt="Mglisty las o świcie — tereny Koła Łowieckiego Bór"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/55 to-charcoal/25" />
      <div className="noise pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay" />

      <motion.div
        style={{ opacity }}
        className="mx-auto w-full max-w-7xl px-5 pb-24 pt-40 sm:px-8 sm:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-5 text-xs tracking-[0.35em] text-gold uppercase"
        >
          {settings.hero_eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28 }}
          className="max-w-4xl font-serif text-4xl leading-[1.08] text-cream sm:text-6xl lg:text-7xl"
        >
          {settings.hero_headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.42 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-cream-muted sm:text-lg"
        >
          {settings.hero_text}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Link
            href="/#kontakt"
            className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-[0.16em] text-charcoal uppercase transition hover:bg-gold-light"
          >
            Dołącz do nas
          </Link>
          <Link
            href="/#o-nas"
            className="inline-flex items-center justify-center rounded-full border border-cream/20 px-8 py-3.5 text-sm tracking-[0.16em] text-cream uppercase transition hover:border-gold hover:text-gold"
          >
            Poznaj koło
          </Link>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-cream-muted uppercase sm:flex">
        <span>Przewiń</span>
        <span className="h-10 w-px animate-pulse bg-gold/70" />
      </div>
    </section>
  );
}
