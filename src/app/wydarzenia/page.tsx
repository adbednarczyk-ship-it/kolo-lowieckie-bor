import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/site";
import { getUpcomingEvents } from "@/lib/events";

export const metadata: Metadata = {
  title: "Zbiórki i polowania",
};

export default async function EventsPage() {
  const events = await getUpcomingEvents();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <p className="text-xs tracking-[0.32em] text-gold uppercase">Kalendarz</p>
        <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
          Zbiórki i polowania
        </h1>
        <p className="mt-4 text-cream-muted">
          Nadchodzące terminy. Kliknij wydarzenie, żeby się zapisać.
        </p>
        {events.length === 0 ? (
          <p className="mt-12 text-cream-muted">Brak nadchodzących wydarzeń.</p>
        ) : (
          <ul className="mt-12 divide-y divide-cream/10 border-y border-cream/10">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={`/wydarzenia/${event.id}`}
                  className="grid gap-2 py-6 md:grid-cols-12 md:items-center"
                >
                  <p className="font-serif text-xl text-cream md:col-span-4">
                    {formatDate(event.event_date)}
                    {event.event_time ? (
                      <span className="mt-1 block text-sm text-gold">
                        {event.event_time.slice(0, 5)}
                      </span>
                    ) : null}
                  </p>
                  <div className="md:col-span-8">
                    <p className="font-serif text-2xl text-cream">{event.title}</p>
                    <p className="mt-1 text-sm text-cream-muted">
                      {event.location || "Miejsce do uzupełnienia"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
