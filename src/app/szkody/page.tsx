import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/site";
import { requireStaff } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { damageStatusLabels, type DamageReport } from "@/types/damages";

export const metadata: Metadata = {
  title: "Zgłoszenia szkód",
  robots: { index: false, follow: false },
};

export default async function DamagesListPage() {
  await requireStaff("/szkody");
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("damage_reports")
    .select(
      "id, full_name, phone, email, plot_location, description, noticed_on, status, assignee_id, internal_notes, created_at",
    )
    .order("created_at", { ascending: false });

  const reports = (data as DamageReport[] | null) ?? [];

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="text-xs tracking-[0.32em] text-gold uppercase">
          Strefa koła
        </p>
        <h1 className="mt-4 font-serif text-4xl text-cream">Zgłoszenia szkód</h1>
        <p className="mt-4 text-cream-muted">
          Widoczne dla zarządu i administratora.
        </p>
        {reports.length === 0 ? (
          <p className="mt-12 text-cream-muted">Brak zgłoszeń.</p>
        ) : (
          <ul className="mt-12 divide-y divide-cream/10 border-y border-cream/10">
            {reports.map((report) => (
              <li key={report.id}>
                <Link
                  href={`/szkody/${report.id}`}
                  className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-serif text-xl text-cream">
                      {report.full_name}
                    </p>
                    <p className="text-sm text-cream-muted">
                      {report.plot_location} · zauważono{" "}
                      {formatDate(report.noticed_on)}
                    </p>
                  </div>
                  <span className="text-xs tracking-[0.16em] text-gold uppercase">
                    {damageStatusLabels[report.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
