import type { Metadata } from "next";
import Link from "next/link";
import { GroundForm } from "./GroundForm";
import { deleteGround } from "./actions";
import { requireClubMember } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type HuntingGround } from "@/types/grounds";

export const metadata: Metadata = {
  title: "Księga polowań",
  robots: { index: false, follow: false },
};

export default async function HuntingBookPage() {
  const { profile } = await requireClubMember();
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("hunting_grounds")
    .select("id, name, description, location, sort_order, created_at")
    .order("sort_order")
    .order("name");

  const grounds = (data as HuntingGround[] | null) ?? [];
  const isAdmin = profile?.role === "admin";

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-xs tracking-[0.32em] text-gold uppercase">
          Strefa koła
        </p>
        <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
          Łowiska
        </h1>
        <p className="mt-4 max-w-2xl text-cream-muted">
          Wybierz łowisko, otwórz dzień w kalendarzu i zapisz się na wybrane
          godziny. Widać, kto zajmuje pozostałe terminy.
        </p>

        {grounds.length === 0 ? (
          <p className="mt-12 text-cream-muted">
            {isAdmin
              ? "Nie ma jeszcze łowisk. Dodaj pierwsze poniżej."
              : "Administrator nie dodał jeszcze listy łowisk."}
          </p>
        ) : (
          <ul className="mt-12 divide-y divide-cream/10 border-y border-cream/10">
            {grounds.map((ground) => (
              <li
                key={ground.id}
                className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <Link href={`/ksiega-polowan/${ground.id}`} className="group">
                  <h2 className="font-serif text-2xl text-cream transition group-hover:text-gold">
                    {ground.name}
                  </h2>
                  <p className="mt-1 text-sm text-cream-muted">
                    {ground.location || "Lokalizacja do uzupełnienia"}
                  </p>
                  {ground.description ? (
                    <p className="mt-2 max-w-xl text-sm text-cream-muted">
                      {ground.description}
                    </p>
                  ) : null}
                </Link>
                {isAdmin ? (
                  <form action={deleteGround}>
                    <input type="hidden" name="ground_id" value={ground.id} />
                    <button
                      type="submit"
                      className="text-xs tracking-[0.16em] text-cream-muted uppercase hover:text-red-300"
                    >
                      Usuń
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {isAdmin ? (
          <div className="mt-16">
            <GroundForm />
          </div>
        ) : null}
      </div>
    </main>
  );
}
