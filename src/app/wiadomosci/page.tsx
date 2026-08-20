import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/site";
import { isStaff, requireClubMember } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Wiadomości",
  robots: { index: false, follow: false },
};

type InboxRow = {
  id: string;
  subject: string;
  created_at: string;
  message_recipients: { read_at: string | null; user_id: string }[];
};

export default async function MessagesPage() {
  const { user, profile } = await requireClubMember("/wiadomosci");
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("messages")
    .select(
      "id, subject, created_at, message_recipients!inner(read_at, user_id)",
    )
    .eq("message_recipients.user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (data as InboxRow[] | null) ?? [];

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-[0.32em] text-gold uppercase">
              Strefa koła
            </p>
            <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
              Wiadomości
            </h1>
            <p className="mt-4 text-cream-muted">
              Komunikaty zarządu i administratora do członków koła.
            </p>
          </div>
          {isStaff(profile?.role) ? (
            <Link
              href="/wiadomosci/nowa"
              className="inline-flex rounded-full bg-gold px-6 py-3 text-sm tracking-[0.16em] text-charcoal uppercase"
            >
              Nowa wiadomość
            </Link>
          ) : null}
        </div>

        {rows.length === 0 ? (
          <p className="mt-12 text-cream-muted">Skrzynka jest pusta.</p>
        ) : (
          <ul className="mt-12 divide-y divide-cream/10 border-y border-cream/10">
            {rows.map((row) => {
              const unread = !row.message_recipients[0]?.read_at;
              return (
                <li key={row.id}>
                  <Link
                    href={`/wiadomosci/${row.id}`}
                    className="flex items-center justify-between gap-4 py-5"
                  >
                    <div>
                      <p
                        className={`font-serif text-xl ${unread ? "text-gold" : "text-cream"}`}
                      >
                        {row.subject}
                      </p>
                      <p className="mt-1 text-sm text-cream-muted">
                        {formatDate(row.created_at.slice(0, 10))}
                        {unread ? " · nieprzeczytane" : ""}
                      </p>
                    </div>
                    {unread ? (
                      <span className="h-2 w-2 rounded-full bg-gold" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
