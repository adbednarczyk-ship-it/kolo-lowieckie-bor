import type { Metadata } from "next";
import Link from "next/link";
import { deleteNewsPost, toggleNewsPublished } from "../cms-actions";
import { AdminNav } from "@/components/AdminNav";
import { createServiceSupabaseClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/profile";
import { type NewsPost } from "@/types/cms";

export const metadata: Metadata = {
  title: "Aktualności",
  robots: { index: false, follow: false },
};

export default async function AdminNewsPage() {
  await requireAdmin();
  const admin = createServiceSupabaseClient();
  const { data } = await admin
    .from("news_posts")
    .select("id, slug, title, excerpt, category, published_on, image_url, body, published")
    .order("published_on", { ascending: false });
  const posts = (data as NewsPost[] | null) ?? [];

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <AdminNav />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl text-cream">Aktualności</h1>
            <p className="mt-4 text-cream-muted">
              Ukryty wpis nie pokazuje się na stronie głównej.
            </p>
          </div>
          <Link
            href="/admin/aktualnosci/nowa"
            className="rounded-full bg-gold px-6 py-3 text-sm tracking-[0.16em] text-charcoal uppercase"
          >
            Nowy wpis
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="mt-12 text-cream-muted">
            Brak wpisów w bazie. Dopóki nic nie dodasz, strona pokazuje przykładowe
            artykuły.
          </p>
        ) : (
          <ul className="mt-12 divide-y divide-cream/10 border-y border-cream/10">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-cream">{post.title}</p>
                  <p className="text-sm text-cream-muted">
                    {post.published_on} · {post.published ? "opublikowany" : "ukryty"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.14em]">
                  <Link href={`/admin/aktualnosci/${post.id}`} className="text-gold">
                    Edytuj
                  </Link>
                  <form action={toggleNewsPublished}>
                    <input type="hidden" name="id" value={post.id} />
                    <input type="hidden" name="published" value={String(post.published)} />
                    <button type="submit" className="text-cream-muted hover:text-gold">
                      {post.published ? "Ukryj" : "Publikuj"}
                    </button>
                  </form>
                  <form action={deleteNewsPost}>
                    <input type="hidden" name="id" value={post.id} />
                    <button type="submit" className="text-cream-muted hover:text-red-300">
                      Usuń
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
