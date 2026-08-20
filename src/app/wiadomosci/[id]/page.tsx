import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/site";
import { requireClubMember } from "@/lib/supabase/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { type ClubMessage } from "@/types/messages";

export const metadata: Metadata = {
  title: "Wiadomość",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MessagePage({ params }: PageProps) {
  const { id } = await params;
  const { user } = await requireClubMember(`/wiadomosci/${id}`);
  const supabase = await createServerSupabaseClient();

  const { data: access } = await supabase
    .from("message_recipients")
    .select("message_id, read_at")
    .eq("message_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: message } = await supabase
    .from("messages")
    .select("id, sender_id, subject, body, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!message || (!access && message.sender_id !== user.id)) notFound();
  const details = message as ClubMessage;

  if (access && !access.read_at) {
    await supabase
      .from("message_recipients")
      .update({ read_at: new Date().toISOString() })
      .eq("message_id", id)
      .eq("user_id", user.id);
  }

  const { data: sender } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", details.sender_id)
    .maybeSingle();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link
          href="/wiadomosci"
          className="text-xs tracking-[0.2em] text-gold uppercase"
        >
          ← Wiadomości
        </Link>
        <p className="mt-8 text-sm text-gold">
          {formatDate(details.created_at.slice(0, 10))}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl">
          {details.subject}
        </h1>
        <p className="mt-4 text-sm text-cream-muted">
          Od:{" "}
          {(sender as { full_name: string; email: string } | null)?.full_name ||
            (sender as { email: string } | null)?.email ||
            "Zarząd koła"}
        </p>
        <div className="mt-10 whitespace-pre-wrap text-base leading-relaxed text-cream-muted">
          {details.body}
        </div>
      </div>
    </main>
  );
}
