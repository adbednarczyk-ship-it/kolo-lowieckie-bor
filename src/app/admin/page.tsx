import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Panel administratora",
  robots: { index: false, follow: false },
};

const cards = [
  {
    href: "/admin/tresc",
    title: "Treść strony",
    text: "Hero, O nas i dane kontaktowe.",
  },
  {
    href: "/admin/zarzad",
    title: "Zarząd",
    text: "Imiona, funkcje i zdjęcia członków zarządu.",
  },
  {
    href: "/admin/galeria",
    title: "Galeria",
    text: "Dodawanie i usuwanie zdjęć z opisami.",
  },
  {
    href: "/admin/aktualnosci",
    title: "Aktualności",
    text: "Wpisy: dodawanie, edycja, publikacja i ukrywanie.",
  },
  {
    href: "/admin/uzytkownicy",
    title: "Użytkownicy",
    text: "Konta członków i role.",
  },
  {
    href: "/szkody",
    title: "Szkody łowieckie",
    text: "Zgłoszenia od rolników: status, szacujący, notatki.",
  },
] as const;

export default async function AdminHomePage() {
  await requireAdmin();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <AdminNav />
        <p className="text-xs tracking-[0.32em] text-gold uppercase">Panel</p>
        <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
          Administrator
        </h1>
        <p className="mt-4 max-w-2xl text-cream-muted">
          Stąd zmieniasz treści na stronie głównej i zarządzasz kontami.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="border border-cream/10 bg-white/[0.02] p-6 transition hover:border-gold/40"
            >
              <h2 className="font-serif text-2xl text-cream">{card.title}</h2>
              <p className="mt-2 text-sm text-cream-muted">{card.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
