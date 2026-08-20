import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelReservation, deleteHunt, reserveStand } from "../actions";
import { formatDate } from "@/lib/site";
import { isStaff, requireClubMember } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Hunt, type Reservation, type Stand } from "@/types/hunts";

export const metadata: Metadata = {
  title: "Polowanie",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HuntDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { user, profile } = await requireClubMember(`/ksiega-polowan/${id}`);
  const supabase = await createServerSupabaseClient();

  const { data: hunt } = await supabase
    .from("hunts")
    .select("id, title, hunt_date, meeting_time, location, notes, created_by, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!hunt) notFound();
  const details = hunt as Hunt;

  const [{ data: standsData }, { data: reservationsData }] = await Promise.all([
    supabase
      .from("stands")
      .select("id, hunt_id, name, sort_order")
      .eq("hunt_id", id)
      .order("sort_order"),
    supabase
      .from("reservations")
      .select("id, hunt_id, stand_id, user_id, created_at")
      .eq("hunt_id", id),
  ]);

  const stands = (standsData as Stand[] | null) ?? [];
  const reservations = (reservationsData as Reservation[] | null) ?? [];
  const userIds = [...new Set(reservations.map((item) => item.user_id))];

  const { data: people } = userIds.length
    ? await supabase.from("profiles").select("id, full_name, email").in("id", userIds)
    : { data: [] };

  const names = new Map(
    ((people as { id: string; full_name: string; email: string }[] | null) ?? []).map(
      (person) => [person.id, person.full_name || person.email],
    ),
  );

  const reservationByStand = new Map(
    reservations.map((item) => [item.stand_id, item]),
  );
  const myReservation = reservations.find((item) => item.user_id === user.id);
  const open = details.hunt_date >= new Date().toISOString().slice(0, 10);
  const staff = isStaff(profile?.role);

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Link
          href="/ksiega-polowan"
          className="text-xs tracking-[0.2em] text-gold uppercase"
        >
          ← Księga polowań
        </Link>
        <p className="mt-8 text-gold">{formatDate(details.hunt_date)}</p>
        <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl">
          {details.title}
        </h1>
        <p className="mt-4 text-cream-muted">
          {details.location || "Miejsce do uzupełnienia"}
          {details.meeting_time ? ` · zbiórka ${details.meeting_time.slice(0, 5)}` : ""}
        </p>
        {details.notes ? (
          <p className="mt-4 whitespace-pre-wrap text-cream-muted">{details.notes}</p>
        ) : null}

        <h2 className="mt-12 font-serif text-2xl text-cream">Stanowiska</h2>
        <p className="mt-2 text-sm text-cream-muted">
          Możesz zająć jedno stanowisko. Wolne rezerwujesz przyciskiem.
        </p>

        <ul className="mt-6 divide-y divide-cream/10 border-y border-cream/10">
          {stands.map((stand) => {
            const reservation = reservationByStand.get(stand.id);
            const mine = reservation?.user_id === user.id;
            const taken = Boolean(reservation);

            return (
              <li
                key={stand.id}
                className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-serif text-xl text-cream">{stand.name}</p>
                  <p className="mt-1 text-sm text-cream-muted">
                    {mine
                      ? "Twoja rezerwacja"
                      : taken
                        ? `Zajęte: ${names.get(reservation!.user_id) ?? "członek koła"}`
                        : "Wolne"}
                  </p>
                </div>
                {open && mine ? (
                  <form action={cancelReservation}>
                    <input type="hidden" name="hunt_id" value={id} />
                    <input
                      type="hidden"
                      name="reservation_id"
                      value={reservation!.id}
                    />
                    <button
                      type="submit"
                      className="rounded-full border border-cream/20 px-5 py-2 text-xs tracking-[0.16em] text-cream uppercase hover:border-gold hover:text-gold"
                    >
                      Zrezygnuj
                    </button>
                  </form>
                ) : null}
                {open && !taken && !myReservation ? (
                  <form action={reserveStand}>
                    <input type="hidden" name="hunt_id" value={id} />
                    <input type="hidden" name="stand_id" value={stand.id} />
                    <button
                      type="submit"
                      className="rounded-full bg-gold px-5 py-2 text-xs tracking-[0.16em] text-charcoal uppercase hover:bg-gold-light"
                    >
                      Rezerwuj
                    </button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>

        {staff ? (
          <form action={deleteHunt} className="mt-12">
            <input type="hidden" name="hunt_id" value={id} />
            <button
              type="submit"
              className="text-sm text-cream-muted underline-offset-4 hover:text-red-300 hover:underline"
            >
              Usuń polowanie
            </button>
          </form>
        ) : null}
      </div>
    </main>
  );
}
