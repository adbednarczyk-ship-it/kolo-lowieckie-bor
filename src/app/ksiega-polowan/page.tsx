import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/site";
import { isStaff, requireClubMember } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Hunt } from "@/types/hunts";

export const metadata: Metadata = {
  title: "Księga polowań",
  robots: { index: false, follow: false },
};

export default async function HuntingBookPage() {
  const { profile } = await requireClubMember();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("hunts")
    .select("id, title, hunt_date, meeting_time, location, notes, created_by, created_at")
    .order("hunt_date", { ascending: true });

  const hunts = (data as Hunt[] | null) ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = hunts.filter((hunt) => hunt.hunt_date >= today);
  const past = hunts.filter((hunt) => hunt.hunt_date < today);

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.32em] text-gold uppercase">
              Strefa koła
            </p>
            <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
              Księga polowań
            </h1>
            <p className="mt-4 max-w-xl text-cream-muted">
              Nadchodzące zbiórki i rezerwacja stanowisk. Jedno stanowisko na
              myśliwego.
            </p>
          </div>
          {isStaff(profile?.role) ? (
            <Link
              href="/ksiega-polowan/nowe"
              className="inline-flex rounded-full bg-gold px-6 py-3 text-sm tracking-[0.16em] text-charcoal uppercase"
            >
              Dodaj polowanie
            </Link>
          ) : null}
        </div>

        <HuntList title="Nadchodzące" items={upcoming} empty="Brak zaplanowanych polowań." />
        <HuntList title="Minione" items={past} empty="Brak archiwum." />
      </div>
    </main>
  );
}

function HuntList({
  title,
  items,
  empty,
}: {
  title: string;
  items: Hunt[];
  empty: string;
}) {
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl text-cream">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-cream-muted">{empty}</p>
      ) : (
        <div className="mt-6 divide-y divide-cream/10 border-y border-cream/10">
          {items.map((hunt) => (
            <Link
              key={hunt.id}
              href={`/ksiega-polowan/${hunt.id}`}
              className="grid gap-2 py-6 transition hover:text-gold md:grid-cols-12 md:items-center"
            >
              <p className="font-serif text-xl text-cream md:col-span-4">
                {formatDate(hunt.hunt_date)}
                {hunt.meeting_time ? (
                  <span className="mt-1 block text-sm text-gold">
                    {hunt.meeting_time.slice(0, 5)}
                  </span>
                ) : null}
              </p>
              <div className="md:col-span-8">
                <p className="font-serif text-2xl">{hunt.title}</p>
                <p className="mt-1 text-sm text-cream-muted">
                  {hunt.location || "Miejsce do uzupełnienia"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
