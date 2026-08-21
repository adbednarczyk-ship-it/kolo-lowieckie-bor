import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignupForm } from "../SignupForm";
import { formatDate } from "@/lib/site";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { getSessionProfile } from "@/lib/supabase/profile";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { type ClubEvent, type EventSignup } from "@/types/events";

export const metadata: Metadata = {
  title: "Wydarzenie",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!isSupabaseConfigured()) notFound();

  const { user } = await getSessionProfile();
  const admin = createServiceSupabaseClient();
  const { data: event } = await admin
    .from("club_events")
    .select(
      "id, title, event_date, event_time, location, description, capacity, signup_type, created_by, created_at",
    )
    .eq("id", id)
    .maybeSingle();
  if (!event) notFound();
  const details = event as ClubEvent;

  const { data: signupsData } = await admin
    .from("event_signups")
    .select("id, event_id, user_id, guest_name, guest_email, guest_phone, created_at")
    .eq("event_id", id);
  const signups = (signupsData as EventSignup[] | null) ?? [];
  const own = user
    ? signups.find((item) => item.user_id === user.id)
    : null;

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link href="/wydarzenia" className="text-xs tracking-[0.2em] text-gold uppercase">
          ← Kalendarz
        </Link>
        <p className="mt-8 text-gold">{formatDate(details.event_date)}</p>
        <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl">
          {details.title}
        </h1>
        <p className="mt-4 text-cream-muted">
          {details.location || "Miejsce do uzupełnienia"}
          {details.event_time ? ` · ${details.event_time.slice(0, 5)}` : ""}
        </p>
        {details.description ? (
          <p className="mt-6 whitespace-pre-wrap text-cream-muted">
            {details.description}
          </p>
        ) : null}
        <div className="mt-12 border border-cream/10 p-6">
          <SignupForm
            event={details}
            taken={signups.length}
            isLoggedIn={Boolean(user)}
            ownSignupId={own?.id ?? null}
          />
        </div>
      </div>
    </main>
  );
}
