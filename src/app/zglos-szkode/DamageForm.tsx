"use client";

import { useActionState } from "react";
import { submitDamageReport, type DamageFormState } from "./actions";

const field =
  "w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold";

export function DamageForm() {
  const [state, action, pending] = useActionState<DamageFormState, FormData>(
    submitDamageReport,
    undefined,
  );

  return (
    <form action={action} className="border border-cream/10 bg-charcoal/40 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Imię i nazwisko</span>
          <input required name="full_name" autoComplete="name" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Telefon</span>
          <input required name="phone" autoComplete="tel" className={field} />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-2 block text-cream-muted">E-mail</span>
          <input required type="email" name="email" autoComplete="email" className={field} />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-2 block text-cream-muted">Lokalizacja działki</span>
          <input
            required
            name="plot_location"
            placeholder="Obręb, numer działki, najbliższa miejscowość"
            className={field}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Data zauważenia</span>
          <input required type="date" name="noticed_on" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Zdjęcia (do 8 plików)</span>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            className="text-sm text-cream-muted"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-2 block text-cream-muted">Opis szkody</span>
          <textarea required name="description" rows={6} className={field} />
        </label>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-cream-muted">
        Zgłoszenie trafia do zarządu koła. Dane użyjemy wyłącznie do szacowania
        szkody.
      </p>
      {state?.error ? (
        <p className="mt-4 text-sm text-red-300">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="mt-4 text-sm text-gold">{state.success}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-8 rounded-full bg-gold px-8 py-3.5 text-sm tracking-[0.16em] text-charcoal uppercase hover:bg-gold-light disabled:opacity-60"
      >
        {pending ? "Wysyłanie…" : "Wyślij zgłoszenie"}
      </button>
    </form>
  );
}
