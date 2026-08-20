export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="mb-5 flex items-center gap-4">
        <span className="text-xs font-medium tracking-[0.32em] text-gold uppercase">
          {index}
        </span>
        <span className="gold-rule" />
        <span className="text-xs tracking-[0.28em] text-cream-muted uppercase">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-serif text-3xl leading-[1.15] text-cream sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
