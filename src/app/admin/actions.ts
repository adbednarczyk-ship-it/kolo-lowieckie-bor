"use server";

import { revalidatePath } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { userRoles, type UserRole } from "@/types/auth";

export type AdminState = { error?: string; success?: string } | undefined;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseRole(value: FormDataEntryValue | null): UserRole | null {
  const role = String(value ?? "");
  return userRoles.includes(role as UserRole) ? (role as UserRole) : null;
}

export async function inviteMember(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = parseRole(formData.get("role"));

  if (fullName.length < 2) return { error: "Podaj imię i nazwisko." };
  if (!emailPattern.test(email)) return { error: "Podaj poprawny e-mail." };
  if (password.length < 8) return { error: "Hasło musi mieć co najmniej 8 znaków." };
  if (!role) return { error: "Wybierz rolę." };

  try {
    const admin = createServiceSupabaseClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });

    if (error || !data.user) {
      return { error: error?.message ?? "Nie udało się utworzyć konta." };
    }

    await admin.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    });

    revalidatePath("/admin");
    return { success: `Dodano konto: ${email}` };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nie udało się dodać członka.";
    return { error: message };
  }
}

export async function updateMemberRole(formData: FormData) {
  const { user } = await requireAdmin();
  const userId = String(formData.get("user_id") ?? "");
  const role = parseRole(formData.get("role"));

  if (!userId || !role) return;
  if (userId === user.id) return;

  const client = await createServerSupabaseClient();
  await client
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId);

  revalidatePath("/admin");
}
