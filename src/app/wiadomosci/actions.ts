"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type Profile } from "@/types/auth";

export type MessageState = { error?: string } | undefined;

export async function sendMessage(
  _prev: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const { user } = await requireStaff("/wiadomosci/nowa");
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const audience = String(formData.get("audience") ?? "all");
  const selected = formData.getAll("recipient").map(String);

  if (subject.length < 2) return { error: "Podaj temat wiadomości." };
  if (body.length < 3) return { error: "Wpisz treść wiadomości." };

  const supabase = await createServerSupabaseClient();
  const { data: people } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at");

  const profiles = (people as Profile[] | null) ?? [];
  let recipients = profiles.map((item) => item.id);

  if (audience === "members") {
    recipients = profiles.filter((item) => item.role === "member").map((item) => item.id);
  }
  if (audience === "selected") {
    recipients = selected.filter((id) => profiles.some((item) => item.id === id));
  }

  recipients = [...new Set([...recipients, user.id])];
  if (recipients.length === 0) {
    return { error: "Wybierz przynajmniej jednego odbiorcę." };
  }

  const { data: message, error } = await supabase
    .from("messages")
    .insert({ sender_id: user.id, subject, body })
    .select("id")
    .single();

  if (error || !message) {
    return { error: error?.message ?? "Nie udało się wysłać wiadomości." };
  }

  const { error: recipientError } = await supabase.from("message_recipients").insert(
    recipients.map((userId) => ({
      message_id: message.id,
      user_id: userId,
    })),
  );

  if (recipientError) return { error: recipientError.message };

  revalidatePath("/wiadomosci");
  redirect("/wiadomosci");
}
