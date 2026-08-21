"use client";

import { FormEvent, useState } from "react";
import { membershipSteps } from "@/data/content";
import { settingsToClub } from "@/lib/club";
import { type SiteSettings } from "@/types/cms";
import { FadeIn } from "./FadeIn";
import { SectionHeading } from "./SectionHeading";

type Status = "idle" | "loading" | "success" | "error";

const topics = [
  { value: "czlonkostwo", label: "Chcę dołączyć do koła" },
  { value: "polowanie", label: "Pytanie o polowanie / zapis" },
  { value: "wspolpraca", label: "Współpraca i szkody łowieckie" },
  { value: "inne", label: "Inna sprawa" },
] as const;

export function Contact({ settings }: { settings: SiteSettings }) {
  const club = settingsToClub(settings);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error ?? "Nie udało się wysłać wiadomości.");
        return;
      }

      setStatus("success");
      setMessage(
        "Dziękujemy. Zarząd odpowie najpóźniej w ciągu kilku dni roboczych.",
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Brak połączenia. Spróbuj ponownie lub zadzwoń do kancelarii.");
    }
  }

  return (
    <section id="kontakt" className="scroll-mt-24 bg-forest py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <SectionHeading
            index="06"
            eyebrow="Kontakt"
            title="Dołącz do koła. Napisz do nas."
            description="Kancelaria przyjmuje w wtorki i czwartki. Kandydatów zapraszamy na rozmowę — bez pośpiechu, z rekomendacją członka koła."
          />
        </FadeIn>

        <div className="mt-16 grid gap-14 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5">
            <h3 className="font-serif text-2xl text-cream">Członkostwo</h3>
            <ol className="mt-8 space-y-8">
              {membershipSteps.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="font-serif text-xl text-gold">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-cream">{step.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-cream-muted">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 space-y-4 border-t border-cream/10 pt-8 text-sm text-cream-muted">
              <p>
                <span className="block text-[11px] tracking-[0.2em] text-gold uppercase">
                  Adres
                </span>
                {club.address.line1}
                <br />
                {club.address.line2}, {club.address.postal} {club.address.city}
              </p>
              <p>
                <span className="block text-[11px] tracking-[0.2em] text-gold uppercase">
                  Telefon
                </span>
                <a href={`tel:${club.phone.replace(/\s/g, "")}`} className="text-cream hover:text-gold">
                  {club.phone}
                </a>
              </p>
              <p>
                <span className="block text-[11px] tracking-[0.2em] text-gold uppercase">
                  E-mail
                </span>
                <a href={`mailto:${club.email}`} className="text-cream hover:text-gold">
                  {club.email}
                </a>
              </p>
              <p>
                <span className="block text-[11px] tracking-[0.2em] text-gold uppercase">
                  Kancelaria
                </span>
                {club.hours}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="border border-cream/10 bg-charcoal/40 p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-2 block tracking-wide text-cream-muted">
                    Imię i nazwisko
                  </span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none transition focus:border-gold"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-2 block tracking-wide text-cream-muted">
                    E-mail
                  </span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none transition focus:border-gold"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-2 block tracking-wide text-cream-muted">
                    Telefon
                  </span>
                  <input
                    name="phone"
                    autoComplete="tel"
                    className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none transition focus:border-gold"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-2 block tracking-wide text-cream-muted">
                    Temat
                  </span>
                  <select
                    name="topic"
                    required
                    defaultValue="czlonkostwo"
                    className="w-full border border-cream/15 bg-charcoal px-4 py-3 text-cream outline-none transition focus:border-gold"
                  >
                    {topics.map((topic) => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="mt-5 block text-sm">
                <span className="mb-2 block tracking-wide text-cream-muted">
                  Wiadomość
                </span>
                <textarea
                  required
                  name="message"
                  rows={6}
                  className="w-full resize-y border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none transition focus:border-gold"
                />
              </label>
              <label className="mt-5 flex items-start gap-3 text-sm text-cream-muted">
                <input
                  required
                  type="checkbox"
                  name="consent"
                  value="true"
                  className="mt-1 accent-gold"
                />
                <span>
                  Wyrażam zgodę na przetwarzanie danych w celu odpowiedzi na
                  zgłoszenie. Szczegóły w{" "}
                  <a
                    href="/polityka-prywatnosci"
                    className="text-gold underline-offset-4 hover:underline"
                  >
                    polityce prywatności
                  </a>
                  .
                </span>
              </label>
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-8 inline-flex rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-[0.16em] text-charcoal uppercase transition hover:bg-gold-light disabled:opacity-60"
              >
                {status === "loading" ? "Wysyłanie…" : "Wyślij zgłoszenie"}
              </button>
              {message ? (
                <p
                  className={`mt-4 text-sm ${status === "success" ? "text-gold" : "text-red-300"}`}
                  role="status"
                >
                  {message}
                </p>
              ) : null}
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
