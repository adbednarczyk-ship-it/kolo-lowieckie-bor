import Image from "next/image";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";
import { type SiteSettings } from "@/types/cms";

export function About({ settings }: { settings: SiteSettings }) {
  const pillars = [
    { title: settings.pillar1_title, text: settings.pillar1_text },
    { title: settings.pillar2_title, text: settings.pillar2_text },
    { title: settings.pillar3_title, text: settings.pillar3_text },
  ];
  const stats = [
    { value: settings.stat_founded, label: "Rok założenia" },
    { value: settings.stat_area, label: "Obwód łowiecki" },
    { value: settings.stat_members, label: "Członków koła" },
    { value: settings.stat_plot, label: "Numer obwodu" },
  ];
  return (
    <section id="o-nas" className="scroll-mt-24 bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            index="01"
            eyebrow="O nas"
            title={settings.about_title}
            description={settings.about_intro}
          />
        </FadeIn>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-12">
          <FadeIn className="relative lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
              <Image
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80"
                alt="Korony drzew w ostępach koła"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
            </div>
            <p className="mt-4 font-serif text-sm italic text-cream-muted">
              {settings.about_caption}
            </p>
          </FadeIn>

          <div className="lg:col-span-6">
            <FadeIn delay={0.1}>
              <p className="font-serif text-2xl leading-snug text-cream sm:text-3xl">
                {settings.about_mission}
              </p>
              <p className="mt-6 text-base leading-relaxed text-cream-muted">
                {settings.about_body}
              </p>
            </FadeIn>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {pillars.map((pillar, index) => (
                <FadeIn key={pillar.title} delay={0.08 * index}>
                  <div className="border-t border-gold/40 pt-4">
                    <h3 className="font-serif text-xl text-cream">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-cream-muted">
                      {pillar.text}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        <FadeIn className="mt-20 grid grid-cols-2 gap-px overflow-hidden border border-cream/10 bg-cream/10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-charcoal px-6 py-8 text-center"
            >
              <p className="font-serif text-3xl text-gold sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs tracking-[0.2em] text-cream-muted uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
