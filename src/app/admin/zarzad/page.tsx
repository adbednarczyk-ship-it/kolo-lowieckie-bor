import type { Metadata } from "next";
import Image from "next/image";
import { BoardForm } from "./BoardForm";
import { deleteBoardMember } from "../cms-actions";
import { AdminNav } from "@/components/AdminNav";
import { getBoardMembers } from "@/lib/cms";
import { requireAdmin } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "Zarząd",
  robots: { index: false, follow: false },
};

export default async function AdminBoardPage() {
  await requireAdmin();
  const members = await getBoardMembers();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <AdminNav />
        <h1 className="font-serif text-4xl text-cream">Zarząd</h1>
        <p className="mt-4 mb-10 text-cream-muted">
          Osoby na stronie w sekcji Zarząd. Jeśli lista jest pusta w bazie,
          strona pokazuje przykładowe dane, dopóki nie dodasz pierwszych osób.
        </p>
        <BoardForm />
        <ul className="mt-12 divide-y divide-cream/10 border-y border-cream/10">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-4 py-4">
              <div className="relative h-16 w-12 overflow-hidden bg-charcoal-soft">
                {member.image_url ? (
                  <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="text-cream">{member.name}</p>
                <p className="text-sm text-gold">{member.role}</p>
              </div>
              {!member.id.startsWith("static-") ? (
                <form action={deleteBoardMember}>
                  <input type="hidden" name="id" value={member.id} />
                  <button type="submit" className="text-xs text-cream-muted uppercase hover:text-red-300">
                    Usuń
                  </button>
                </form>
              ) : (
                <span className="text-xs text-cream-muted">przykład</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
