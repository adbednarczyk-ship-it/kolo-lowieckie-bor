"use client";

import { useActionState } from "react";
import { createHunt, type HuntFormState } from "./actions";

export function HuntForm() {
  const [state, action, pending] = useActionState<HuntFormState, FormData>(
    createHunt,
    undefined,
  );

  return (
    <form
      action={action}
      className="border border-cream/10 bg-charcoal/40 p-6 sm:p-8"
    >
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Nazwa polowania</span>
        <input
          required
          name="title"
          placeholder="Polowanie zbiorowe na dziki"
          className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </label>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Data</span>
          <input
            required
            type="date"
            name="hunt_date"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Zbiórka (godzina)</span>
          <input
            type="time"
            name="meeting_time"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
      </div>
      <label className="mt-5 block text-sm">
        <span className="mb-2 block text-cream-muted">Miejsce zbiórki</span>
        <input
          name="location"
          placeholder="Uroczysko Jawor"
          className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </label>
      <label className="mt-5 block text-sm">
        <span className="mb-2 block text-cream-muted">Uwagi</span>
        <textarea
          name="notes"
          rows={3}
          className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </label>
      <label className="mt-5 block text-sm">
        <span className="mb-2 block text-cream-muted">
          Stanowiska (jedno w linii)
        </span>
        <textarea
          required
          name="stands"
          rows={6}
          placeholder={"Ambona Jawor\nAmbona Smug\nStanowisko 3\nStanowisko 4"}
          className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </label>
      {state?.error ? (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-8 rounded-full bg-gold px-8 py-3.5 text-sm tracking-[0.16em] text-charcoal uppercase hover:bg-gold-light disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : "Dodaj polowanie"}
      </button>
    </form>
  );
}
