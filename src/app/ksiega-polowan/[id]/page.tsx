import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  monthCells,
  monthLabels,
  parseMonthParam,
  shiftMonth,
  todayKey,
  weekdayLabels,
} from "@/lib/calendar";
import { formatDate } from "@/lib/site";
import { requireClubMember } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type GroundReservation, type HuntingGround } from "@/types/grounds";

export const metadata: Metadata = {
  title: "Kalendarz łowiska",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ miesiac?: string }>;
};

export default async function GroundCalendarPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = await searchParams;
  await requireClubMember(`/ksiega-polowan/${id}`);

  const { year, month } = parseMonthParam(query.miesiac);
  const previous = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const from = `${year}-${String(month).padStart(2, "0")}-01`;
  const to = shiftMonth(year, month, 1).param + "-01";

  const supabase = await createServerSupabaseClient();
  const { data: ground } = await supabase
    .from("hunting_grounds")
    .select("id, name, description, location, sort_order, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!ground) notFound();
  const details = ground as HuntingGround;

  const { data: bookings } = await supabase
    .from("ground_reservations")
    .select("id, ground_id, user_id, reserved_on, starts_at, ends_at, created_at")
    .eq("ground_id", id)
    .gte("reserved_on", from)
    .lt("reserved_on", to);

  const busyDays = new Set(
    ((bookings as GroundReservation[] | null) ?? []).map(
      (item) => item.reserved_on,
    ),
  );
  const today = todayKey();
  const cells = monthCells(year, month);

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Link
          href="/ksiega-polowan"
          className="text-xs tracking-[0.2em] text-gold uppercase"
        >
          ← Łowiska
        </Link>
        <h1 className="mt-6 font-serif text-4xl text-cream sm:text-5xl">
          {details.name}
        </h1>
        <p className="mt-3 text-cream-muted">
          {details.location}
          {details.description ? ` · ${details.description}` : ""}
        </p>
        <p className="mt-6 text-sm text-cream-muted">
          Kliknij dzień, żeby zobaczyć godziny i się zapisać.
        </p>

        <div className="mt-10 flex items-center justify-between">
          <Link
            href={`/ksiega-polowan/${id}?miesiac=${previous.param}`}
            className="text-sm text-gold"
          >
            ← {monthLabels[previous.month - 1]}
          </Link>
          <p className="font-serif text-2xl text-cream capitalize">
            {monthLabels[month - 1]} {year}
          </p>
          <Link
            href={`/ksiega-polowan/${id}?miesiac=${next.param}`}
            className="text-sm text-gold"
          >
            {monthLabels[next.month - 1]} →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[11px] tracking-[0.16em] text-cream-muted uppercase">
          {weekdayLabels.map((label) => (
            <div key={label} className="py-2">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, index) => {
            if (!cell.date) {
              return <div key={`empty-${index}`} className="min-h-16" />;
            }
            const booked = busyDays.has(cell.date);
            const isToday = cell.date === today;
            const past = cell.date < today;
            return (
              <Link
                key={cell.date}
                href={`/ksiega-polowan/${id}/${cell.date}`}
                className={`flex min-h-16 flex-col items-center justify-center border text-sm transition hover:border-gold hover:text-gold ${
                  isToday
                    ? "border-gold text-gold"
                    : "border-cream/10 text-cream"
                } ${past ? "opacity-50" : ""}`}
              >
                <span className="font-serif text-lg">{cell.day}</span>
                {booked ? (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold" />
                ) : null}
              </Link>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-cream-muted">
          Złota kropka oznacza dzień z rezerwacją. Dziś: {formatDate(today)}.
        </p>
      </div>
    </main>
  );
}
