import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/logowanie/actions";
import { getSessionProfile } from "@/lib/supabase/profile";
import { roleLabels } from "@/types/auth";

export const metadata: Metadata = {
  title: "Konto",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect("/logowanie?next=/konto");

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
          Jesteś zalogowany w strefie koła.
        </p>
        {profile?.role === "admin" ? (
          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm tracking-[0.16em] text-charcoal uppercase"
          >
            Panel administratora
          </Link>
        ) : null}

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
