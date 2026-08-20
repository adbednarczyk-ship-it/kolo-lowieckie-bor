import type { Metadata } from "next";
import Link from "next/link";
import { ComposeForm } from "../ComposeForm";
import { requireStaff } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Profile } from "@/types/auth";

export const metadata: Metadata = {
  title: "Nowa wiadomość",
  robots: { index: false, follow: false },
};

export default async function NewMessagePage() {
  await requireStaff("/wiadomosci/nowa");
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at")
    .order("full_name");

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <Link
          href="/wiadomosci"
          className="text-xs tracking-[0.2em] text-gold uppercase"
        >
          ← Wiadomości
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-cream">Nowa wiadomość</h1>
        <p className="mt-4 text-cream-muted">
          Wyślij komunikat do wszystkich, tylko do członków albo do wybranych
          osób.
        </p>
        <div className="mt-10">
          <ComposeForm people={(data as Profile[] | null) ?? []} />
        </div>
      </div>
    </main>
  );
}
