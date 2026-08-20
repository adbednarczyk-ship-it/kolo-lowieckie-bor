import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "./env";

export function createServiceSupabaseClient() {
  const { url } = getSupabasePublicEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceKey) {
    throw new Error(
      "Brak SUPABASE_SERVICE_ROLE_KEY. Dodaj klucz service/secret w .env.local.",
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
