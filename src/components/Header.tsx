"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { club, navItems } from "@/data/content";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-cream/10 bg-charcoal/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3 text-gold">
          <Logo className="h-9 w-9 transition-transform duration-500 group-hover:rotate-6" />
          <span className="leading-tight">
            <span className="block font-serif text-lg tracking-wide text-cream">
              {club.shortName}
            </span>
            <span className="hidden text-[10px] tracking-[0.28em] text-cream-muted uppercase sm:block">
              Koło Łowieckie
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Główne">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-[13px] tracking-[0.16em] text-cream-muted uppercase transition-colors hover:text-cream"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <Link
          href="/#kontakt"
          className="hidden rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-[12px] tracking-[0.18em] text-gold uppercase transition hover:bg-gold hover:text-charcoal lg:inline-flex"
        >
          Dołącz do nas
        </Link>

        <button
          type="button"
          className="relative z-50 flex h-11 w-11 items-center justify-center text-cream lg:hidden"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span
              className={`block h-px w-6 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-6 bg-current transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-px w-6 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex h-full flex-col justify-center gap-6 px-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-4xl text-cream"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/#kontakt"
                onClick={() => setOpen(false)}
                className="mt-4 w-fit rounded-full bg-gold px-6 py-3 text-sm tracking-[0.18em] text-charcoal uppercase"
              >
                Dołącz do nas
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
