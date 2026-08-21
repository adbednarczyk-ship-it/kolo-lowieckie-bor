"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { damageStatuses, type DamageStatus } from "@/types/damages";

export async function updateDamageReport(formData: FormData) {
  await requireStaff("/szkody");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as DamageStatus;
  const assigneeId = String(formData.get("assignee_id") ?? "");
  const notes = String(formData.get("internal_notes") ?? "");

  if (!id || !damageStatuses.includes(status)) return;

  const supabase = await createServerSupabaseClient();
  await supabase
    .from("damage_reports")
    .update({
      status,
      assignee_id: assigneeId || null,
      internal_notes: notes,
    })
    .eq("id", id);

  revalidatePath("/szkody");
  revalidatePath(`/szkody/${id}`);
}
