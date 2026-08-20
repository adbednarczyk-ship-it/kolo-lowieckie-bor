import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logout } from "@/app/logowanie/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient, getSessionUser } from "@/lib/supabase/server";
import { roleLabels, type Profile } from "@/types/auth";

export const metadata: Metadata = {
  title: "Konto",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/logowanie?next=/konto");

  let profile: Profile | null = null;

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at, updated_at")
      .eq("id", user.id)
      .maybeSingle();
    profile = data as Profile | null;
  }

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-xs tracking-[0.32em] text-gold uppercase">
          Strefa koła
        </p>
        <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
          Twoje konto
        </h1>
        <p className="mt-4 text-cream-muted">
          Jesteś zalogowany. Księga polowań, wiadomości i panel administratora
          pojawią się w kolejnych krokach.
        </p>

        <div className="mt-10 space-y-4 border border-cream/10 bg-white/[0.02] p-6">
          <p>
            <span className="block text-[11px] tracking-[0.2em] text-gold uppercase">
              E-mail
            </span>
            <span className="text-cream">{user.email}</span>
          </p>
          <p>
            <span className="block text-[11px] tracking-[0.2em] text-gold uppercase">
              Imię i nazwisko
            </span>
            <span className="text-cream">
              {profile?.full_name || "Uzupełni administrator"}
            </span>
          </p>
          <p>
            <span className="block text-[11px] tracking-[0.2em] text-gold uppercase">
              Rola
            </span>
            <span className="text-cream">
              {profile ? roleLabels[profile.role] : "Brak profilu — uruchom SQL w Supabase"}
            </span>
          </p>
        </div>

        <form action={logout} className="mt-8">
          <button
            type="submit"
            className="rounded-full border border-cream/20 px-8 py-3 text-sm tracking-[0.16em] text-cream uppercase transition hover:border-gold hover:text-gold"
          >
            Wyloguj się
          </button>
        </form>
      </div>
    </main>
  );
}
