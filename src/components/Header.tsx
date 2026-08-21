"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { logout } from "@/app/logowanie/actions";
import { club } from "@/data/content";
import { type UserRole } from "@/types/auth";
import { Logo } from "./Logo";

type NavLink = { href: string; label: string };

const aboutLinks: NavLink[] = [
  { href: "/#o-nas", label: "O nas" },
  { href: "/#zarzad", label: "Zarząd" },
  { href: "/#kontakt", label: "Kontakt" },
];

const infoLinks: NavLink[] = [
  { href: "/#aktualnosci", label: "Aktualności" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#polowania", label: "Polowania" },
  { href: "/zglos-szkode", label: "Zgłoś szkodę" },
];

function memberLinks(role?: UserRole | null): NavLink[] {
  const items: NavLink[] = [
    { href: "/ksiega-polowan", label: "Księga polowań" },
    { href: "/wiadomosci", label: "Wiadomości" },
    { href: "/konto", label: "Konto" },
  ];
  if (role === "admin" || role === "board") {
    items.splice(2, 0, { href: "/szkody", label: "Szkody" });
  }
  if (role === "admin") {
    items.push({ href: "/admin", label: "Panel" });
  }
  return items;
}

function DesktopDropdown({
  label,
  items,
}: {
  label: string;
  items: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="px-2 py-2 text-[12px] tracking-[0.18em] text-cream uppercase transition hover:text-gold"
      >
        {label}
        <span className="ml-1.5 text-gold">▾</span>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full left-0 min-w-52 border border-cream/10 bg-forest py-2 shadow-xl"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2.5 text-[12px] tracking-[0.14em] text-cream-muted uppercase transition hover:bg-charcoal hover:text-gold"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MobileGroup({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavLink[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] tracking-[0.28em] text-gold uppercase">
        {title}
      </p>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="font-serif text-lg text-cream"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header({
  userEmail,
  userRole,
}: {
  userEmail?: string | null;
  userRole?: UserRole | null;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const members = memberLinks(userRole);

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
        open
          ? "border-b border-cream/10 bg-forest"
          : scrolled
            ? "border-b border-cream/10 bg-charcoal/95"
            : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3 text-gold">
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

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Główne"
        >
          <DesktopDropdown label="O kole" items={aboutLinks} />
          <DesktopDropdown label="Informacje" items={infoLinks} />
          {userEmail ? (
            <DesktopDropdown label="Dla członków" items={members} />
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {userEmail ? (
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full border border-cream/20 px-5 py-2 text-[12px] tracking-[0.18em] text-cream uppercase transition hover:border-gold hover:text-gold"
              >
                Wyloguj
              </button>
            </form>
          ) : (
            <Link
              href="/logowanie"
              className="rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-[12px] tracking-[0.18em] text-gold uppercase transition hover:bg-gold hover:text-charcoal"
            >
              Strefa koła
            </Link>
          )}
        </div>

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
            className="fixed inset-0 z-40 overflow-y-auto bg-forest pt-24 pb-10 lg:hidden"
          >
            <nav className="flex flex-col gap-7 px-8">
              <MobileGroup
                title="O kole"
                items={aboutLinks}
                onNavigate={() => setOpen(false)}
              />
              <MobileGroup
                title="Informacje"
                items={infoLinks}
                onNavigate={() => setOpen(false)}
              />
              {userEmail ? (
                <>
                  <MobileGroup
                    title="Dla członków"
                    items={members}
                    onNavigate={() => setOpen(false)}
                  />
                  <form action={logout}>
                    <button
                      type="submit"
                      className="font-serif text-lg text-gold"
                    >
                      Wyloguj
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/logowanie"
                  onClick={() => setOpen(false)}
                  className="w-fit rounded-full bg-gold px-6 py-2.5 text-sm tracking-[0.18em] text-charcoal uppercase"
                >
                  Strefa koła
                </Link>
              )}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
