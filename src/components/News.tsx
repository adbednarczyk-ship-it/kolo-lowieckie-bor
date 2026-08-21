import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/site";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";
import { type NewsPost } from "@/types/cms";

export function News({ posts }: { posts: NewsPost[] }) {
  return (
    <section
      id="aktualnosci"
      className="scroll-mt-24 bg-charcoal py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            index="05"
            eyebrow="Aktualności"
            title="Z życia koła."
            description="Komunikaty zarządu, gospodarka w obwodzie i sprawy członkowskie."
          />
        </FadeIn>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {posts.map((item, index) => (
            <FadeIn key={item.slug} delay={0.08 * index}>
              <article className="group flex h-full flex-col border border-cream/10 bg-white/[0.02] transition hover:border-gold/40">
                <Link href={`/aktualnosci/${item.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase">
                    <span className="text-gold">{item.category}</span>
                    <span className="text-cream-muted">
                      {formatDate(item.published_on)}
                    </span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl leading-snug text-cream">
                    <Link
                      href={`/aktualnosci/${item.slug}`}
                      className="transition hover:text-gold"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-cream-muted">
                    {item.excerpt}
                  </p>
                  <Link
                    href={`/aktualnosci/${item.slug}`}
                    className="mt-6 text-xs tracking-[0.2em] text-gold uppercase"
                  >
                    Czytaj więcej →
                  </Link>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
