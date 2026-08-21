"use server";

import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { uploadPublicImage } from "@/lib/upload";

export type DamageFormState = { error?: string; success?: string } | undefined;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitDamageReport(
  _prev: DamageFormState,
  formData: FormData,
): Promise<DamageFormState> {
  if (!isSupabaseConfigured()) {
    return { error: "Formularz nie jest jeszcze podłączony. Spróbuj później." };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const plotLocation = String(formData.get("plot_location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const noticedOn = String(formData.get("noticed_on") ?? "").trim();

  if (fullName.length < 2) return { error: "Podaj imię i nazwisko." };
  if (!phone) return { error: "Podaj telefon." };
  if (!emailPattern.test(email)) return { error: "Podaj poprawny e-mail." };
  if (plotLocation.length < 3) return { error: "Podaj lokalizację działki." };
  if (description.length < 10) return { error: "Opisz szkodę trochę dokładniej." };
  if (!noticedOn) return { error: "Podaj datę zauważenia szkody." };

  try {
    const admin = createServiceSupabaseClient();
    const { data: report, error } = await admin
      .from("damage_reports")
      .insert({
        full_name: fullName,
        phone,
        email,
        plot_location: plotLocation,
        description,
        noticed_on: noticedOn,
        status: "nowe",
      })
      .select("id")
      .single();

    if (error || !report) {
      return { error: error?.message ?? "Nie udało się wysłać zgłoszenia." };
    }

    const files = formData
      .getAll("photos")
      .filter((item): item is File => item instanceof File && item.size > 0)
      .slice(0, 8);

    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadPublicImage(file, "szkody");
      if (url) urls.push(url);
    }

    if (urls.length) {
      await admin.from("damage_photos").insert(
        urls.map((image_url) => ({ report_id: report.id, image_url })),
      );
    }

    return {
      success:
        "Zgłoszenie zostało przyjęte. Skontaktujemy się w sprawie oględzin.",
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Nie udało się wysłać zgłoszenia.",
    };
  }
}
