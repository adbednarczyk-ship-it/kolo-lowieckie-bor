"use client";

import { useActionState } from "react";
import { addAlbumImage, type AlbumState } from "../actions";

export function PhotoForm({ albumId }: { albumId: string }) {
  const [state, action, pending] = useActionState<AlbumState, FormData>(
    addAlbumImage,
    undefined,
  );

  return (
    <form action={action} className="space-y-4 border border-cream/10 p-6">
      <input type="hidden" name="album_id" value={albumId} />
      <h2 className="font-serif text-2xl text-cream">Dodaj zdjęcie</h2>
      <input type="file" name="image" accept="image/*" className="text-sm text-cream-muted" />
      <input
        name="image_url"
        placeholder="albo URL zdjęcia"
        className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
      />
      <input
        name="caption"
        placeholder="Podpis"
        className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
      />
      <input
        name="alt"
        placeholder="Opis dla niewidomych"
        className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
      />
      <input
        type="number"
        name="sort_order"
        defaultValue={0}
        className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
      />
      {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-gold">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-6 py-3 text-sm tracking-[0.16em] text-charcoal uppercase disabled:opacity-60"
      >
        {pending ? "Dodawanie…" : "Dodaj zdjęcie"}
      </button>
    </form>
  );
}
