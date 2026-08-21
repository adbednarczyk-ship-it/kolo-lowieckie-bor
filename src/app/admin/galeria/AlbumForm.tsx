"use client";

import { useActionState } from "react";
import { saveAlbum, type AlbumState } from "./actions";
import { type GalleryAlbum } from "@/types/gallery";

const field =
  "w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold";

export function AlbumForm({ album }: { album?: GalleryAlbum }) {
  const [state, action, pending] = useActionState<AlbumState, FormData>(
    saveAlbum,
    undefined,
  );

  return (
    <form action={action} className="space-y-5 border border-cream/10 p-6">
      {album ? <input type="hidden" name="id" value={album.id} /> : null}
      <input type="hidden" name="current_cover" value={album?.cover_image_url ?? ""} />
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Nazwa albumu</span>
        <input
          required
          name="title"
          defaultValue={album?.title}
          placeholder="Hubertus 2025"
          className={field}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Opis</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={album?.description}
          className={field}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Kolejność</span>
        <input
          type="number"
          name="sort_order"
          defaultValue={album?.sort_order ?? 0}
          className={field}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Miniaturka (plik)</span>
        <input type="file" name="image" accept="image/*" className="text-sm text-cream-muted" />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">albo URL miniaturki</span>
        <input name="image_url" defaultValue={album?.cover_image_url} className={field} />
      </label>
      {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-gold">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : album ? "Zapisz album" : "Dodaj album"}
      </button>
    </form>
  );
}
