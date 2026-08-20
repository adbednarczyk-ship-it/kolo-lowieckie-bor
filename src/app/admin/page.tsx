import type { Metadata } from "next";
import { updateMemberRole } from "./actions";
import { InviteForm } from "./InviteForm";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/profile";
import { roleLabels, userRoles, type Profile } from "@/types/auth";

export const metadata: Metadata = {
  title: "Panel administratora",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const { user } = await requireAdmin();
  const supabase = createServiceSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at, updated_at")
    .order("created_at", { ascending: true });

  const members = (data as Profile[] | null) ?? [];

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-xs tracking-[0.32em] text-gold uppercase">
          Panel
        </p>
        <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
          Administrator
        </h1>
        <p className="mt-4 max-w-2xl text-cream-muted">
          Dodawaj członków i nadawaj role. Zwykły użytkownik nie może założyć
          konta sam.
        </p>

        <div className="mt-12">
          <InviteForm />
        </div>

        <h2 className="mt-16 font-serif text-2xl text-cream">Członkowie</h2>
        <div className="mt-6 overflow-x-auto border border-cream/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/[0.03] text-[11px] tracking-[0.18em] text-cream-muted uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Osoba</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Rola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/10">
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-4 text-cream">
                    {member.full_name || "—"}
                  </td>
                  <td className="px-4 py-4 text-cream-muted">{member.email}</td>
                  <td className="px-4 py-4">
                    {member.id === user.id ? (
                      <span className="text-gold">
                        {roleLabels[member.role]} (Ty)
                      </span>
                    ) : (
                      <form action={updateMemberRole} className="flex gap-2">
                        <input type="hidden" name="user_id" value={member.id} />
                        <select
                          name="role"
                          defaultValue={member.role}
                          className="border border-cream/15 bg-charcoal px-3 py-2 text-cream outline-none focus:border-gold"
                        >
                          {userRoles.map((role) => (
                            <option key={role} value={role}>
                              {roleLabels[role]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="border border-gold/40 px-3 py-2 text-[11px] tracking-[0.14em] text-gold uppercase hover:bg-gold hover:text-charcoal"
                        >
                          Zapisz
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
