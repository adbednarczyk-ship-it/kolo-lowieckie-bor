"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/supabase/profile";
import { damageStatuses, type DamageStatus } from "@/types/damages";

export type DamageUpdateState = { error?: string; success?: string } | undefined;

export async function updateDamageReport(
  _prev: DamageUpdateState,
  formData: FormData,
): Promise<DamageUpdateState> {
  await requireStaff("/szkody");
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim() as DamageStatus;
  const assigneeId = String(formData.get("assignee_id") ?? "").trim();
  const notes = String(formData.get("internal_notes") ?? "");

  if (!id) return { error: "Brakuje zgłoszenia." };
  if (!damageStatuses.includes(status)) {
    return { error: "Nieprawidłowy status." };
  }

  const admin = createServiceSupabaseClient();
  const { error } = await admin
    .from("damage_reports")
    .update({
      status,
      assignee_id: assigneeId || null,
      internal_notes: notes,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/szkody");
  revalidatePath(`/szkody/${id}`);
  return { success: "Zapisano zmiany." };
}
