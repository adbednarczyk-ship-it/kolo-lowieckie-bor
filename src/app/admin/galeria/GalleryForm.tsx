"use client";

import { useActionState } from "react";
import { addGalleryItem, type CmsState } from "../cms-actions";

export function GalleryForm() {
  const [state, action, pending] = useActionState<CmsState, FormData>(
    addGalleryItem,
    undefined,
  );

  return (
    <form action={action} className="border border-cream/10 p-6">
      <h2 className="font-serif text-2xl text-cream">Dodaj zdjęcie</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <input type="file" name="image" accept="image/*" className="text-sm text-cream-muted" />
        <input
          name="image_url"
          placeholder="albo URL zdjęcia"
          className="border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
        <input
          name="caption"
          placeholder="Podpis"
          className="border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
        <input
          name="alt"
          placeholder="Opis dla niewidomych"
          className="border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
        <select
          name="span"
          defaultValue="normal"
          className="border border-cream/15 bg-charcoal px-4 py-3 text-cream outline-none focus:border-gold"
        >
          <option value="normal">Zwykłe</option>
          <option value="wide">Szerokie</option>
          <option value="tall">Wysokie</option>
        </select>
        <input
          type="number"
          name="sort_order"
          defaultValue={0}
          className="border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </div>
      {state?.error ? <p className="mt-3 text-sm text-red-300">{state.error}</p> : null}
      {state?.success ? <p className="mt-3 text-sm text-gold">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-full bg-gold px-6 py-3 text-sm tracking-[0.16em] text-charcoal uppercase"
      >
        {pending ? "Dodawanie…" : "Dodaj do galerii"}
      </button>
    </form>
  );
}
