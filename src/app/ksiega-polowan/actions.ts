"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { rangesOverlap, todayKey } from "@/lib/calendar";
import { requireAdmin, requireClubMember } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type GroundReservation } from "@/types/grounds";

export type FormState = { error?: string; success?: string } | undefined;

function normalizeTime(value: string) {
  return value.length === 5 ? `${value}:00` : value;
}

export async function createGround(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (name.length < 2) return { error: "Podaj nazwę łowiska." };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("hunting_grounds").insert({
    name,
    location,
    description,
  });

  if (error) return { error: error.message };
  revalidatePath("/ksiega-polowan");
  return { success: "Dodano łowisko." };
}

export async function deleteGround(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("ground_id") ?? "");
  if (!id) return;
  const supabase = await createServerSupabaseClient();
  await supabase.from("hunting_grounds").delete().eq("id", id);
  revalidatePath("/ksiega-polowan");
}

export async function createBooking(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { user } = await requireClubMember();
  const groundId = String(formData.get("ground_id") ?? "");
  const reservedOn = String(formData.get("reserved_on") ?? "");
  const startsAt = normalizeTime(String(formData.get("starts_at") ?? ""));
  const endsAt = normalizeTime(String(formData.get("ends_at") ?? ""));

  if (!groundId || !reservedOn) return { error: "Brakuje danych rezerwacji." };
  if (!startsAt || !endsAt) return { error: "Wybierz godzinę od i do." };
  if (startsAt >= endsAt) {
    return { error: "Godzina „do” musi być późniejsza niż „od”." };
  }
  if (reservedOn < todayKey()) {
    return { error: "Nie można zapisać się na dzień, który już minął." };
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("ground_reservations")
    .select("id, ground_id, user_id, reserved_on, starts_at, ends_at, created_at")
    .eq("ground_id", groundId)
    .eq("reserved_on", reservedOn);

  const existing = (data as GroundReservation[] | null) ?? [];
  const clash = existing.some((item) =>
    rangesOverlap(startsAt, endsAt, item.starts_at, item.ends_at),
  );
  if (clash) {
    return { error: "Ten zakres nachodzi na inną rezerwację. Wybierz wolne godziny." };
  }

  const { error } = await supabase.from("ground_reservations").insert({
    ground_id: groundId,
    user_id: user.id,
    reserved_on: reservedOn,
    starts_at: startsAt,
    ends_at: endsAt,
  });

  if (error) return { error: error.message };

  revalidatePath(`/ksiega-polowan/${groundId}`);
  revalidatePath(`/ksiega-polowan/${groundId}/${reservedOn}`);
  return { success: "Zapisano rezerwację." };
}

export async function cancelBooking(formData: FormData) {
  await requireClubMember();
  const reservationId = String(formData.get("reservation_id") ?? "");
  const groundId = String(formData.get("ground_id") ?? "");
  const reservedOn = String(formData.get("reserved_on") ?? "");
  if (!reservationId) return;

  const supabase = await createServerSupabaseClient();
  await supabase.from("ground_reservations").delete().eq("id", reservationId);

  revalidatePath(`/ksiega-polowan/${groundId}`);
  revalidatePath(`/ksiega-polowan/${groundId}/${reservedOn}`);
  redirect(`/ksiega-polowan/${groundId}/${reservedOn}`);
}
