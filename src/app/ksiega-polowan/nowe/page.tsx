import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { HuntForm } from "../HuntForm";
import { isStaff, requireClubMember } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Nowe polowanie",
  robots: { index: false, follow: false },
};

export default async function NewHuntPage() {
  const { profile } = await requireClubMember("/ksiega-polowan/nowe");
  if (!isStaff(profile?.role)) redirect("/ksiega-polowan");

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <Link
          href="/ksiega-polowan"
          className="text-xs tracking-[0.2em] text-gold uppercase"
        >
          ← Księga polowań
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-cream">Nowe polowanie</h1>
        <p className="mt-4 text-cream-muted">
          Dodaj zbiórkę i listę stanowisk. Członkowie będą mogli je rezerwować.
        </p>
        <div className="mt-10">
          <HuntForm />
        </div>
      </div>
    </main>
  );
}
