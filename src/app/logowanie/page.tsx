import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Logowanie",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextPath =
    params.next?.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/konto";

  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-lg px-5 sm:px-8">
        <p className="text-xs tracking-[0.32em] text-gold uppercase">
          Strefa koła
        </p>
        <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
          Logowanie
        </h1>
        <p className="mt-4 text-cream-muted">
          Wejście dla członków Koła Łowieckiego „Bór”. Rejestracja publiczna jest
          wyłączona.
        </p>
        <div className="mt-10">
          <LoginForm nextPath={nextPath} />
        </div>
      </div>
    </main>
  );
}
