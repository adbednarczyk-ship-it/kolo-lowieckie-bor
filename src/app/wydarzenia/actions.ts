"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { getSessionProfile } from "@/lib/supabase/profile";
import { type ClubEvent, type EventSignup } from "@/types/events";

export type SignupState = { error?: string; success?: string } | undefined;

function refresh(eventId: string) {
  revalidatePath("/");
  revalidatePath("/wydarzenia");
  revalidatePath(`/wydarzenia/${eventId}`);
  revalidatePath("/admin/wydarzenia");
  revalidatePath(`/admin/wydarzenia/${eventId}`);
}

async function getEventWithCount(eventId: string) {
  const admin = createServiceSupabaseClient();
  const { data: event } = await admin
    .from("club_events")
    .select(
      "id, title, event_date, event_time, location, description, capacity, signup_type, created_by, created_at",
    )
    .eq("id", eventId)
    .maybeSingle();
  if (!event) return { event: null as ClubEvent | null, count: 0, admin };
  const { count } = await admin
    .from("event_signups")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);
  return { event: event as ClubEvent, count: count ?? 0, admin };
}

export async function signupForEvent(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const eventId = String(formData.get("event_id") ?? "");
  if (!eventId) return { error: "Brakuje wydarzenia." };

  const { event, count, admin } = await getEventWithCount(eventId);
  if (!event) return { error: "Nie znaleziono wydarzenia." };
  if (event.event_date < new Date().toISOString().slice(0, 10)) {
    return { error: "To wydarzenie już się odbyło." };
  }
  if (event.capacity && count >= event.capacity) {
    return { error: "Brak wolnych miejsc." };
  }

  const { user, profile } = await getSessionProfile();

  if (event.signup_type === "members" && !user) {
    return { error: "Zapisy tylko dla zalogowanych członków koła." };
  }

  if (user) {
    const { error } = await admin.from("event_signups").insert({
      event_id: eventId,
      user_id: user.id,
      guest_name: profile?.full_name || "",
      guest_email: user.email || "",
      guest_phone: "",
    });
    if (error) {
      if (error.code === "23505") return { error: "Jesteś już zapisany na to wydarzenie." };
      return { error: error.message };
    }
    refresh(eventId);
    return { success: "Zapisano na wydarzenie." };
  }

  const guestName = String(formData.get("guest_name") ?? "").trim();
  const guestEmail = String(formData.get("guest_email") ?? "").trim().toLowerCase();
  const guestPhone = String(formData.get("guest_phone") ?? "").trim();
  if (guestName.length < 2) return { error: "Podaj imię i nazwisko." };
  if (!guestEmail.includes("@")) return { error: "Podaj e-mail." };

  const { error } = await admin.from("event_signups").insert({
    event_id: eventId,
    user_id: null,
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: guestPhone,
  });
  if (error) {
    if (error.code === "23505") return { error: "Ten e-mail jest już zapisany." };
    return { error: error.message };
  }
  refresh(eventId);
  return { success: "Zapisano na wydarzenie." };
}

export async function cancelSignup(formData: FormData) {
  const eventId = String(formData.get("event_id") ?? "");
  const signupId = String(formData.get("signup_id") ?? "");
  if (!eventId || !signupId) return;
  const { user } = await getSessionProfile();
  const admin = createServiceSupabaseClient();
  const { data: signup } = await admin
    .from("event_signups")
    .select("id, event_id, user_id, guest_name, guest_email, guest_phone, created_at")
    .eq("id", signupId)
    .maybeSingle();
  const row = signup as EventSignup | null;
  if (!row) return;
  const guestEmail = String(formData.get("guest_email") ?? "").trim().toLowerCase();
  const allowed =
    (user && row.user_id === user.id) ||
    (!row.user_id && guestEmail && guestEmail === row.guest_email.toLowerCase());
  if (!allowed) return;
  await admin.from("event_signups").delete().eq("id", signupId);
  refresh(eventId);
}
