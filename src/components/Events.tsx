import Link from "next/link";
import { events as fallbackEvents } from "@/data/content";
import { getUpcomingEvents } from "@/lib/events";
import { formatDate } from "@/lib/site";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";

export async function Events() {
  const fromDb = await getUpcomingEvents();
  const hasDb = fromDb.length > 0;

  return (
    <section
      id="polowania"
      className="scroll-mt-24 bg-charcoal py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            index="03"
            eyebrow="Polowania"
            title="Kalendarz zbiórek i wydarzeń."
            description="Terminy polowań zbiorowych, szkoleń i świąt koła. Zapisz się online — zależnie od wydarzenia dla wszystkich albo tylko dla członków."
          />
        </FadeIn>

        {hasDb ? (
          <div className="mt-16 divide-y divide-cream/10 border-y border-cream/10">
            {fromDb.map((event, index) => (
              <FadeIn key={event.id} delay={0.04 * index}>
                <Link
                  href={`/wydarzenia/${event.id}`}
                  className="group grid gap-4 py-8 md:grid-cols-12 md:items-center md:gap-8"
                >
                  <div className="md:col-span-3">
                    <p className="font-serif text-2xl text-cream">
                      {formatDate(event.event_date)}
                    </p>
                    {event.event_time ? (
                      <p className="mt-1 text-sm tracking-wide text-gold">
                        {event.event_time.slice(0, 5)}
                      </p>
                    ) : null}
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-[11px] tracking-[0.22em] text-cream-muted uppercase">
                      {event.signup_type === "public" ? "Zapisy otwarte" : "Dla członków"}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-cream transition group-hover:text-gold">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm text-cream-muted">
                      {event.location || "Miejsce do uzupełnienia"}
                    </p>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <span className="inline-flex rounded-full border border-gold/35 px-4 py-1.5 text-[11px] tracking-[0.16em] text-gold uppercase">
                      Zapisz się
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="mt-16 divide-y divide-cream/10 border-y border-cream/10">
            {fallbackEvents.map((event, index) => (
              <FadeIn key={event.title} delay={0.04 * index}>
                <article className="grid gap-4 py-8 md:grid-cols-12 md:items-center md:gap-8">
                  <div className="md:col-span-3">
                    <p className="font-serif text-2xl text-cream">
                      {formatDate(event.date)}
                    </p>
                    <p className="mt-1 text-sm tracking-wide text-gold">
                      {event.time}
                    </p>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-[11px] tracking-[0.22em] text-cream-muted uppercase">
                      {event.type}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-cream">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm text-cream-muted">{event.place}</p>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <span className="inline-flex rounded-full border border-gold/35 px-4 py-1.5 text-[11px] tracking-[0.16em] text-gold uppercase">
                      {event.status}
                    </span>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}

        <p className="mt-8 text-sm text-cream-muted">
          Pełna lista:{" "}
          <Link href="/wydarzenia" className="text-gold">
            zbiórki i polowania
          </Link>
          . Polowania indywidualne — według planu odstrzału, szczegóły w kancelarii.
        </p>
      </div>
    </section>
  );
}
