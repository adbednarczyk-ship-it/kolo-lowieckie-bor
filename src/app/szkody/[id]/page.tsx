import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateDamageReport } from "../actions";
import { formatDate } from "@/lib/site";
import { requireStaff } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Profile } from "@/types/auth";
import {
  damageStatusLabels,
  damageStatuses,
  type DamagePhoto,
  type DamageReport,
} from "@/types/damages";

export const metadata: Metadata = {
  title: "Zgłoszenie szkody",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function DamageDetailPage({ params }: PageProps) {
  const { id } = await params;
  await requireStaff(`/szkody/${id}`);
  const supabase = await createServerSupabaseClient();

  const { data: report } = await supabase
    .from("damage_reports")
    .select(
      "id, full_name, phone, email, plot_location, description, noticed_on, status, assignee_id, internal_notes, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!report) notFound();
  const details = report as DamageReport;

  const [{ data: photosData }, { data: people }] = await Promise.all([
    supabase
      .from("damage_photos")
      .select("id, report_id, image_url")
      .eq("report_id", id),
    supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at, updated_at")
      .in("role", ["admin", "board"]),
  ]);

  const photos = (photosData as DamagePhoto[] | null) ?? [];
  const estimators = (people as Profile[] | null) ?? [];

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link href="/szkody" className="text-xs tracking-[0.2em] text-gold uppercase">
          ← Zgłoszenia
        </Link>
        <p className="mt-8 text-sm text-gold">
          {formatDate(details.created_at.slice(0, 10))} ·{" "}
          {damageStatusLabels[details.status]}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-cream">{details.full_name}</h1>
        <div className="mt-8 space-y-3 text-cream-muted">
          <p>Telefon: {details.phone}</p>
          <p>E-mail: {details.email}</p>
          <p>Działka: {details.plot_location}</p>
          <p>Zauważono: {formatDate(details.noticed_on)}</p>
        </div>
        <p className="mt-8 whitespace-pre-wrap text-cream">{details.description}</p>

        {photos.length ? (
          <div className="mt-10 grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <a key={photo.id} href={photo.image_url} target="_blank" rel="noreferrer">
                <div className="relative aspect-[4/3] overflow-hidden border border-cream/10">
                  <Image
                    src={photo.image_url}
                    alt="Zdjęcie szkody"
                    fill
                    className="object-cover"
                  />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-cream-muted">Brak zdjęć.</p>
        )}

        <form action={updateDamageReport} className="mt-12 space-y-5 border border-cream/10 p-6">
          <input type="hidden" name="id" value={details.id} />
          <label className="block text-sm">
            <span className="mb-2 block text-cream-muted">Status</span>
            <select
              name="status"
              defaultValue={details.status}
              className="w-full border border-cream/15 bg-charcoal px-4 py-3 text-cream outline-none focus:border-gold"
            >
              {damageStatuses.map((status) => (
                <option key={status} value={status}>
                  {damageStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-cream-muted">Osoba szacująca</span>
            <select
              name="assignee_id"
              defaultValue={details.assignee_id ?? ""}
              className="w-full border border-cream/15 bg-charcoal px-4 py-3 text-cream outline-none focus:border-gold"
            >
              <option value="">Nieprzypisana</option>
              {estimators.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.full_name || person.email}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-cream-muted">Notatki wewnętrzne</span>
            <textarea
              name="internal_notes"
              rows={5}
              defaultValue={details.internal_notes}
              className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase"
          >
            Zapisz
          </button>
        </form>
      </div>
    </main>
  );
}
