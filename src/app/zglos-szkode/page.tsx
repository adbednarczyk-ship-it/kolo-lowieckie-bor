import type { Metadata } from "next";
import { DamageForm } from "./DamageForm";

export const metadata: Metadata = {
  title: "Zgłoś szkodę łowiecką",
  description:
    "Formularz zgłoszenia szkody łowieckiej dla Koła Łowieckiego Bór.",
};

export default function DamagePage() {
  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="text-xs tracking-[0.32em] text-gold uppercase">
          Szkody łowieckie
        </p>
        <h1 className="mt-4 font-serif text-4xl text-cream sm:text-5xl">
          Zgłoś szkodę
        </h1>
        <p className="mt-4 text-cream-muted">
          Jeśli zwierzyna uszkodziła uprawę lub mienie, wypełnij formularz.
          Zarząd skontaktuje się w sprawie oględzin.
        </p>
        <div className="mt-10">
          <DamageForm />
        </div>
      </div>
    </main>
  );
}
