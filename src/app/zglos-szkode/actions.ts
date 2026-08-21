"use server";

import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { uploadPublicImage } from "@/lib/upload";

export type DamageFormValues = {
  full_name: string;
  phone: string;
  email: string;
  plot_location: string;
  description: string;
  noticed_on: string;
};

export type DamageFormState = {
  error?: string;
  success?: string;
  values?: DamageFormValues;
  stamp?: number;
} | undefined;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readValues(formData: FormData): DamageFormValues {
  return {
    full_name: String(formData.get("full_name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    plot_location: String(formData.get("plot_location") ?? ""),
    description: String(formData.get("description") ?? ""),
    noticed_on: String(formData.get("noticed_on") ?? ""),
  };
}

function fail(error: string, formData: FormData): DamageFormState {
  return { error, values: readValues(formData), stamp: Date.now() };
}

export async function submitDamageReport(
  _prev: DamageFormState,
  formData: FormData,
): Promise<DamageFormState> {
  if (!isSupabaseConfigured()) {
    return fail("Formularz nie jest jeszcze podłączony. Spróbuj później.", formData);
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const plotLocation = String(formData.get("plot_location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const noticedOn = String(formData.get("noticed_on") ?? "").trim();

  if (fullName.length < 2) return fail("Podaj imię i nazwisko.", formData);
  if (!phone) return fail("Podaj telefon.", formData);
  if (!emailPattern.test(email)) return fail("Podaj poprawny e-mail.", formData);
  if (plotLocation.length < 3) return fail("Podaj lokalizację działki.", formData);
  if (description.length < 10) {
    return fail("Opisz szkodę trochę dokładniej.", formData);
  }
  if (!noticedOn) return fail("Podaj datę zauważenia szkody.", formData);

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
      return fail(error?.message ?? "Nie udało się wysłać zgłoszenia.", formData);
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
    return fail(
      error instanceof Error ? error.message : "Nie udało się wysłać zgłoszenia.",
      formData,
    );
  }
}
