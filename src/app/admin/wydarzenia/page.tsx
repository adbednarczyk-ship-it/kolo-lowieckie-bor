import type { Metadata } from "next";
import Link from "next/link";
import { EventForm } from "./EventForm";
import { deleteEvent } from "./actions";
import { AdminNav } from "@/components/AdminNav";
import { formatDate } from "@/lib/site";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/supabase/profile";
import { signupTypeLabels, type ClubEvent } from "@/types/events";

export const metadata: Metadata = {
  title: "Zbiórki i polowania",
  robots: { index: false, follow: false },
};

export default async function AdminEventsPage() {
  await requireStaff("/admin/wydarzenia");
  const admin = createServiceSupabaseClient();
  const { data } = await admin
    .from("club_events")
    .select(
      "id, title, event_date, event_time, location, description, capacity, signup_type, created_by, created_at",
    )
    .order("event_date", { ascending: true });
  const events = (data as ClubEvent[] | null) ?? [];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <AdminNav />
        <h1 className="font-serif text-4xl text-cream">Zbiórki i polowania</h1>
        <p className="mt-4 mb-10 text-cream-muted">
          Dodawaj terminy zbiórek. Zapisy mogą być publiczne albo tylko dla
          członków koła.
        </p>
        <EventForm />
        <h2 className="mt-16 font-serif text-2xl text-cream">Lista</h2>
        {events.length === 0 ? (
          <p className="mt-6 text-cream-muted">Nie ma jeszcze wydarzeń.</p>
        ) : (
          <ul className="mt-6 divide-y divide-cream/10 border-y border-cream/10">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-serif text-xl text-cream">{event.title}</p>
                  <p className="text-sm text-cream-muted">
                    {formatDate(event.event_date)}
                    {event.event_time ? ` · ${event.event_time.slice(0, 5)}` : ""}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-gold">
                    {signupTypeLabels[event.signup_type]}
                    {event.capacity ? ` · limit ${event.capacity}` : " · bez limitu"}
                    {event.event_date < today ? " · minione" : ""}
                  </p>
                </div>
                <div className="flex gap-4 text-xs tracking-[0.14em] uppercase">
                  <Link href={`/admin/wydarzenia/${event.id}`} className="text-gold">
                    Edytuj / zapisy
                  </Link>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <button type="submit" className="text-cream-muted hover:text-red-300">
                      Usuń
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
