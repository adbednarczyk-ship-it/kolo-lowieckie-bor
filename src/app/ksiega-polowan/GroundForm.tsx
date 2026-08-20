"use client";

import { useActionState } from "react";
import { createGround, type FormState } from "./actions";

export function GroundForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    createGround,
    undefined,
  );

  return (
    <form
      action={action}
      className="border border-cream/10 bg-charcoal/40 p-6 sm:p-8"
    >
      <h2 className="font-serif text-2xl text-cream">Dodaj łowisko</h2>
      <p className="mt-2 text-sm text-cream-muted">
        Tylko administrator zarządza listą łowisk.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-2 block text-cream-muted">Nazwa</span>
          <input
            required
            name="name"
            placeholder="Obwód nr 47 — uroczysko Jawor"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-2 block text-cream-muted">Lokalizacja</span>
          <input
            name="location"
            placeholder="Leśniczówka Bór / parking przy ambonie"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-2 block text-cream-muted">Opis</span>
          <textarea
            name="description"
            rows={3}
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
      </div>
      {state?.error ? (
        <p className="mt-4 text-sm text-red-300">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="mt-4 text-sm text-gold">{state.success}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase hover:bg-gold-light disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : "Dodaj łowisko"}
      </button>
    </form>
  );
}
