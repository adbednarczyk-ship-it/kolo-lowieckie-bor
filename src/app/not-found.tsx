import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-charcoal px-5 text-center">
      <p className="text-xs tracking-[0.3em] text-gold uppercase">404</p>
      <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
        Ta ścieżka ginie w ostępie.
      </h1>
      <p className="mt-4 max-w-md text-cream-muted">
        Strona nie istnieje albo została przeniesiona. Wróć na stronę główną koła.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase"
      >
        Strona główna
      </Link>
    </main>
  );
}
