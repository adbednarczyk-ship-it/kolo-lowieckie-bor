import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type ClubEvent } from "@/types/events";

export async function getUpcomingEvents() {
  if (!isSupabaseConfigured()) return [] as ClubEvent[];
  try {
    const supabase = await createServerSupabaseClient();
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("club_events")
      .select(
        "id, title, event_date, event_time, location, description, capacity, signup_type, created_by, created_at",
      )
      .gte("event_date", today)
      .order("event_date", { ascending: true });
    return (data as ClubEvent[] | null) ?? [];
  } catch {
    return [];
  }
}
