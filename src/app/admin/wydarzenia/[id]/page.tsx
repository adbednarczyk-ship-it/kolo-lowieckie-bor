import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventForm } from "../EventForm";
import { AdminNav } from "@/components/AdminNav";
import { formatDate } from "@/lib/site";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/supabase/profile";
import { type Profile } from "@/types/auth";
import { type ClubEvent, type EventSignup } from "@/types/events";

export const metadata: Metadata = {
  title: "Edycja wydarzenia",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  await requireStaff(`/admin/wydarzenia/${id}`);
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
    .eq("event_id", id)
    .order("created_at");
  const signups = (signupsData as EventSignup[] | null) ?? [];
  const userIds = signups.map((item) => item.user_id).filter(Boolean) as string[];
  const { data: people } = userIds.length
    ? await admin.from("profiles").select("id, full_name, email").in("id", userIds)
    : { data: [] };
  const names = new Map(
    ((people as Pick<Profile, "id" | "full_name" | "email">[] | null) ?? []).map(
      (person) => [person.id, { name: person.full_name || person.email, email: person.email }],
    ),
  );

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <AdminNav />
        <Link
          href="/admin/wydarzenia"
          className="text-xs tracking-[0.2em] text-gold uppercase"
        >
          ← Wydarzenia
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-cream">{details.title}</h1>
        <p className="mt-2 text-cream-muted">
          {formatDate(details.event_date)}
          {details.event_time ? ` · ${details.event_time.slice(0, 5)}` : ""}
        </p>
        <div className="mt-10">
          <EventForm event={details} />
        </div>
        <h2 className="mt-16 font-serif text-2xl text-cream">
          Zapisani ({signups.length}
          {details.capacity ? ` / ${details.capacity}` : ""})
        </h2>
        {signups.length === 0 ? (
          <p className="mt-4 text-cream-muted">Nikt się jeszcze nie zapisał.</p>
        ) : (
          <ul className="mt-6 divide-y divide-cream/10 border-y border-cream/10">
            {signups.map((signup) => {
              const member = signup.user_id ? names.get(signup.user_id) : null;
              return (
                <li key={signup.id} className="py-4 text-sm text-cream">
                  {member?.name || signup.guest_name || "Gość"}
                  <span className="mt-1 block text-cream-muted">
                    {member
                      ? member.email
                      : [signup.guest_email, signup.guest_phone].filter(Boolean).join(" · ")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
