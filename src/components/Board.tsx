import Image from "next/image";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";
import { type BoardMember } from "@/types/cms";

export function Board({ members }: { members: BoardMember[] }) {
  return (
    <section
      id="zarzad"
      className="scroll-mt-24 bg-forest py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            index="02"
            eyebrow="Zarząd"
            title="Ludzie, którzy prowadzą koło."
            description="Kadencja zarządu 2024–2028. Każdy z nas poluje, pracuje w terenie i odpowiada przed walnym zgromadzeniem."
          />
        </FadeIn>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {members.map((member, index) => (
            <FadeIn key={member.id} delay={0.06 * index}>
              <article className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-soft">
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-serif text-lg text-cream">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-xs tracking-[0.18em] text-gold uppercase">
                      {member.role}
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
