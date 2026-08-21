"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/supabase/profile";
import { signupTypes, type SignupType } from "@/types/events";

export type EventFormState = { error?: string; success?: string } | undefined;

function parseEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const eventDate = String(formData.get("event_date") ?? "").trim();
  const eventTime = String(formData.get("event_time") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const capacityRaw = String(formData.get("capacity") ?? "").trim();
  const signupType = String(formData.get("signup_type") ?? "members") as SignupType;
  const capacity = capacityRaw ? Number(capacityRaw) : null;

  return {
    title,
    event_date: eventDate,
    event_time: eventTime || null,
    location,
    description,
    capacity: Number.isFinite(capacity) && capacity && capacity > 0 ? capacity : null,
    signup_type: signupTypes.includes(signupType) ? signupType : "members",
  };
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/wydarzenia");
  revalidatePath("/admin/wydarzenia");
}

export async function saveEvent(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const { user } = await requireStaff("/admin/wydarzenia");
  const id = String(formData.get("id") ?? "").trim();
  const payload = parseEvent(formData);

  if (payload.title.length < 3) return { error: "Podaj tytuł wydarzenia." };
  if (!payload.event_date) return { error: "Podaj datę." };

  const admin = createServiceSupabaseClient();
  if (id) {
    const { error } = await admin.from("club_events").update(payload).eq("id", id);
    if (error) return { error: error.message };
    refresh();
    revalidatePath(`/admin/wydarzenia/${id}`);
    revalidatePath(`/wydarzenia/${id}`);
    return { success: "Zapisano wydarzenie." };
  }

  const { error } = await admin.from("club_events").insert({
    ...payload,
    created_by: user.id,
  });
  if (error) return { error: error.message };
  refresh();
  redirect("/admin/wydarzenia");
}

export async function deleteEvent(formData: FormData) {
  await requireStaff("/admin/wydarzenia");
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const admin = createServiceSupabaseClient();
  await admin.from("club_events").delete().eq("id", id);
  refresh();
  redirect("/admin/wydarzenia");
}
