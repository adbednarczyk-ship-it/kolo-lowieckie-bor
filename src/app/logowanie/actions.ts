"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type LoginState = { error: string } | undefined;

function safeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/konto";
  }
  return value;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Logowanie nie jest jeszcze skonfigurowane. Uzupełnij klucze Supabase w .env.local.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!email || !password) {
    return { error: "Podaj e-mail i hasło." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: "Nieprawidłowy e-mail lub hasło." };
    }
  } catch {
    return {
      error:
        "Nie udało się połączyć z logowaniem. Sprawdź adres Supabase (bez /rest/v1) i spróbuj ponownie.",
    };
  }

  redirect(next);
}

export async function logout() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
