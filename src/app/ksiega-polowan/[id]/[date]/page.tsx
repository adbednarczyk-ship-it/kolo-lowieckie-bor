import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "../../BookingForm";
import { cancelBooking } from "../../actions";
import {
  DAY_HOURS,
  isDateKey,
  rangesOverlap,
  todayKey,
} from "@/lib/calendar";
import { formatDate } from "@/lib/site";
import { isStaff, requireClubMember } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type GroundReservation, type HuntingGround } from "@/types/grounds";

export const metadata: Metadata = {
  title: "Rezerwacja dnia",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string; date: string }>;
};

function hourLabel(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export default async function GroundDayPage({ params }: PageProps) {
  const { id, date } = await params;
  if (!isDateKey(date)) notFound();

  const { user, profile } = await requireClubMember(
    `/ksiega-polowan/${id}/${date}`,
  );
  const supabase = await createServerSupabaseClient();

  const { data: ground } = await supabase
    .from("hunting_grounds")
    .select("id, name, description, location, sort_order, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!ground) notFound();
  const details = ground as HuntingGround;

  const { data: bookingsData } = await supabase
    .from("ground_reservations")
    .select("id, ground_id, user_id, reserved_on, starts_at, ends_at, created_at")
    .eq("ground_id", id)
    .eq("reserved_on", date)
    .order("starts_at");

  const bookings = (bookingsData as GroundReservation[] | null) ?? [];
  const userIds = [...new Set(bookings.map((item) => item.user_id))];
  const { data: people } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds)
    : { data: [] };

  const names = new Map(
    ((people as { id: string; full_name: string; email: string }[] | null) ?? []).map(
      (person) => [person.id, person.full_name || person.email],
    ),
  );

  const open = date >= todayKey();
  const staff = isStaff(profile?.role);

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Link
          href={`/ksiega-polowan/${id}`}
          className="text-xs tracking-[0.2em] text-gold uppercase"
        >
          ← Kalendarz
        </Link>
        <p className="mt-8 text-gold">{details.name}</p>
        <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl">
          {formatDate(date)}
        </h1>
        <p className="mt-4 text-cream-muted">
          Szare godziny są wolne. Zajęty zakres pokazuje, kto się zapisał.
        </p>

        <ol className="mt-10 divide-y divide-cream/10 border-y border-cream/10">
          {DAY_HOURS.map((hour) => {
            const start = hourLabel(hour);
            const end = hour === 23 ? "24:00" : hourLabel(hour + 1);
            const occupying = bookings.filter((item) =>
              rangesOverlap(start, end, item.starts_at, item.ends_at),
            );
            const taken = occupying[0];

            return (
              <li
                key={hour}
                className={`flex items-center justify-between gap-4 px-2 py-3 ${
                  taken ? "bg-gold/10" : ""
                }`}
              >
                <span className="w-24 text-sm text-cream-muted">
                  {start}–{end === "24:00" ? "24:00" : end}
                </span>
                <span className="flex-1 font-serif text-cream">
                  {taken
                    ? names.get(taken.user_id) || "Członek koła"
                    : "Wolne"}
                </span>
                {taken ? (
                  <span className="text-xs text-gold">
                    {taken.starts_at.slice(0, 5)}–{taken.ends_at.slice(0, 5)}
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        {bookings.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-serif text-2xl text-cream">Zapisy</h2>
            <ul className="mt-4 space-y-3">
              {bookings.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 border border-cream/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-cream">
                    <span className="text-gold">
                      {item.starts_at.slice(0, 5)}–{item.ends_at.slice(0, 5)}
                    </span>
                    {" · "}
                    {names.get(item.user_id) || "Członek koła"}
                  </p>
                  {open && (item.user_id === user.id || staff) ? (
                    <form action={cancelBooking}>
                      <input type="hidden" name="reservation_id" value={item.id} />
                      <input type="hidden" name="ground_id" value={id} />
                      <input type="hidden" name="reserved_on" value={date} />
                      <button
                        type="submit"
                        className="text-xs tracking-[0.16em] text-cream-muted uppercase hover:text-gold"
                      >
                        Odwołaj
                      </button>
                    </form>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {open ? (
          <div className="mt-12">
            <BookingForm groundId={id} date={date} />
          </div>
        ) : (
          <p className="mt-12 text-sm text-cream-muted">
            Ten dzień już minął. Nowe zapisy są wyłączone.
          </p>
        )}
      </div>
    </main>
  );
}
