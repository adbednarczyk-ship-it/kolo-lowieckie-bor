import type { Metadata } from "next";
import Link from "next/link";
import { club } from "@/data/content";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: `Zasady przetwarzania danych osobowych w ${club.name}.`,
};

export default function PrivacyPage() {
  return (
    <main id="tresc" className="bg-charcoal pt-28 pb-24">
      <article className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link href="/" className="text-xs tracking-[0.2em] text-gold uppercase">
          ← Strona główna
        </Link>
        <h1 className="mt-8 font-serif text-4xl text-cream sm:text-5xl">
          Polityka prywatności
        </h1>
        <div className="mt-10 space-y-6 text-sm leading-relaxed text-cream-muted sm:text-base">
          <p>
            Administratorem danych jest {club.fullLegalName}, {club.address.line1},{" "}
            {club.address.line2}, {club.address.postal} {club.address.city}, e-mail:{" "}
            {club.email}.
          </p>
          <p>
            Dane z formularza kontaktowego (imię i nazwisko, e-mail, telefon,
            treść wiadomości) przetwarzamy wyłącznie w celu odpowiedzi na
            zgłoszenie, na podstawie art. 6 ust. 1 lit. a i f RODO.
          </p>
          <p>
            Dane przechowujemy przez czas obsługi sprawy, a następnie do 12
            miesięcy, chyba że przepisy wymagają dłuższego okresu. Nie sprzedajemy
            danych i nie przekazujemy ich poza EOG.
          </p>
          <p>
            Przysługuje Państwu prawo dostępu, sprostowania, usunięcia, ograniczenia
            przetwarzania, przenoszenia danych, sprzeciwu oraz skargi do PUODO.
          </p>
          <p>
            Strona może zapisywać niezbędne pliki cookies techniczne. Nie
            stosujemy cookies marketingowych bez zgody.
          </p>
        </div>
      </article>
    </main>
  );
}
