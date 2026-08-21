"use client";

import { useActionState } from "react";
import { addBoardMember, type CmsState } from "../cms-actions";

export function BoardForm() {
  const [state, action, pending] = useActionState<CmsState, FormData>(
    addBoardMember,
    undefined,
  );

  return (
    <form action={action} className="border border-cream/10 p-6">
      <h2 className="font-serif text-2xl text-cream">Dodaj osobę</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <input
          required
          name="name"
          placeholder="Imię i nazwisko"
          className="border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
        <input
          name="role"
          placeholder="Funkcja (np. Prezes)"
          className="border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
        <input
          name="sort_order"
          type="number"
          defaultValue={0}
          placeholder="Kolejność"
          className="border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
        <input type="file" name="image" accept="image/*" className="text-sm text-cream-muted" />
        <input
          name="image_url"
          placeholder="albo URL zdjęcia"
          className="border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold sm:col-span-2"
        />
      </div>
      {state?.error ? <p className="mt-3 text-sm text-red-300">{state.error}</p> : null}
      {state?.success ? <p className="mt-3 text-sm text-gold">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-full bg-gold px-6 py-3 text-sm tracking-[0.16em] text-charcoal uppercase"
      >
        {pending ? "Dodawanie…" : "Dodaj"}
      </button>
    </form>
  );
}
