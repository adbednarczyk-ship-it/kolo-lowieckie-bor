import { redirect } from "next/navigation";
import { type Profile } from "@/types/auth";
import { isSupabaseConfigured } from "./env";
import { createServerSupabaseClient, getSessionUser } from "./server";

const profileColumns = "id, email, full_name, role, created_at, updated_at";

export async function getSessionProfile() {
  const user = await getSessionUser();
  if (!user || !isSupabaseConfigured()) {
    return { user: null, profile: null as Profile | null };
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (data as Profile | null) ?? null };
}

export function isStaff(role?: string | null) {
  return role === "admin" || role === "board";
}

export async function requireAdmin() {
  const session = await getSessionProfile();
  if (!session.user) redirect("/logowanie?next=/admin");
  if (session.profile?.role !== "admin") redirect("/konto");
  return session;
}

export async function requireClubMember(nextPath = "/ksiega-polowan") {
  const session = await getSessionProfile();
  if (!session.user) redirect(`/logowanie?next=${nextPath}`);
  if (!session.profile) redirect("/konto");
  return session;
}

export async function requireStaff(nextPath = "/wiadomosci/nowa") {
  const session = await requireClubMember(nextPath);
  if (!isStaff(session.profile?.role)) redirect("/konto");
  return session;
}
