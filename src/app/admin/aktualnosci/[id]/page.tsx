import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsForm } from "../NewsForm";
import { AdminNav } from "@/components/AdminNav";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/profile";
import { type NewsPost } from "@/types/cms";

export const metadata: Metadata = {
  title: "Edycja wpisu",
  robots: { index: false, follow: false },
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditNewsPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const admin = createServiceSupabaseClient();
  const { data } = await admin
    .from("news_posts")
    .select("id, slug, title, excerpt, category, published_on, image_url, body, published")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <AdminNav />
        <h1 className="mb-8 font-serif text-4xl text-cream">Edycja wpisu</h1>
        <NewsForm post={data as NewsPost} />
      </div>
    </main>
  );
}
