import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, getPublishedNews } from "@/lib/cms";
import { formatDate } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedNews();
  return posts.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "Nie znaleziono" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.published_on,
      images: [{ url: article.image_url }],
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <article className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link
          href="/#aktualnosci"
          className="text-xs tracking-[0.2em] text-gold uppercase"
        >
          ← Aktualności
        </Link>
        <p className="mt-8 text-[11px] tracking-[0.22em] text-cream-muted uppercase">
          {article.category} · {formatDate(article.published_on)}
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-cream-muted">
          {article.excerpt}
        </p>
        <div className="relative mt-10 aspect-[16/9] overflow-hidden">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-cream-muted">
          {article.body.split(/\n\s*\n/).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
