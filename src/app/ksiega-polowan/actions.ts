"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isStaff, requireClubMember } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type HuntFormState = { error?: string } | undefined;

export async function createHunt(
  _prev: HuntFormState,
  formData: FormData,
): Promise<HuntFormState> {
  const { user, profile } = await requireClubMember("/ksiega-polowan/nowe");
  if (!isStaff(profile?.role)) {
    return { error: "Tylko zarząd i administrator mogą dodawać polowania." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const huntDate = String(formData.get("hunt_date") ?? "").trim();
  const meetingTime = String(formData.get("meeting_time") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const standsRaw = String(formData.get("stands") ?? "");

  if (title.length < 3) return { error: "Podaj nazwę polowania." };
  if (!huntDate) return { error: "Podaj datę." };

  const standNames = standsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (standNames.length < 1) {
    return { error: "Dodaj przynajmniej jedno stanowisko (jedna linia = jedno stanowisko)." };
  }

  const supabase = await createServerSupabaseClient();
  const { data: hunt, error } = await supabase
    .from("hunts")
    .insert({
      title,
      hunt_date: huntDate,
      meeting_time: meetingTime || null,
      location,
      notes,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !hunt) {
    return { error: error?.message ?? "Nie udało się zapisać polowania." };
  }

  const { error: standsError } = await supabase.from("stands").insert(
    standNames.map((name, index) => ({
      hunt_id: hunt.id,
      name,
      sort_order: index + 1,
    })),
  );

  if (standsError) {
    return { error: standsError.message };
  }

  revalidatePath("/ksiega-polowan");
  redirect(`/ksiega-polowan/${hunt.id}`);
}

export async function reserveStand(formData: FormData) {
  const { user } = await requireClubMember();
  const huntId = String(formData.get("hunt_id") ?? "");
  const standId = String(formData.get("stand_id") ?? "");
  if (!huntId || !standId) return;

  const supabase = await createServerSupabaseClient();
  const { data: hunt } = await supabase
    .from("hunts")
    .select("hunt_date")
    .eq("id", huntId)
    .maybeSingle();

  if (!hunt || hunt.hunt_date < new Date().toISOString().slice(0, 10)) {
    return;
  }

  await supabase.from("reservations").insert({
    hunt_id: huntId,
    stand_id: standId,
    user_id: user.id,
  });

  revalidatePath(`/ksiega-polowan/${huntId}`);
  revalidatePath("/ksiega-polowan");
}

export async function cancelReservation(formData: FormData) {
  await requireClubMember();
  const huntId = String(formData.get("hunt_id") ?? "");
  const reservationId = String(formData.get("reservation_id") ?? "");
  if (!huntId || !reservationId) return;

  const supabase = await createServerSupabaseClient();
  await supabase.from("reservations").delete().eq("id", reservationId);

  revalidatePath(`/ksiega-polowan/${huntId}`);
  revalidatePath("/ksiega-polowan");
}

export async function deleteHunt(formData: FormData) {
  const { profile } = await requireClubMember();
  if (!isStaff(profile?.role)) return;

  const huntId = String(formData.get("hunt_id") ?? "");
  if (!huntId) return;

  const supabase = await createServerSupabaseClient();
  await supabase.from("hunts").delete().eq("id", huntId);
  revalidatePath("/ksiega-polowan");
  redirect("/ksiega-polowan");
}
