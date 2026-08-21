"use client";

import { useActionState } from "react";
import { saveNewsPost, type CmsState } from "../cms-actions";
import { type NewsPost } from "@/types/cms";

const field =
  "w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold";

export function NewsForm({ post }: { post?: NewsPost }) {
  const [state, action, pending] = useActionState<CmsState, FormData>(
    saveNewsPost,
    undefined,
  );

  return (
    <form action={action} className="space-y-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="current_image" value={post?.image_url ?? ""} />
      <input required name="title" defaultValue={post?.title} placeholder="Tytuł" className={field} />
      <input name="slug" defaultValue={post?.slug} placeholder="Adres (zostaw puste — utworzy się sam)" className={field} />
      <input name="category" defaultValue={post?.category ?? "Aktualności"} className={field} />
      <input type="date" name="published_on" defaultValue={post?.published_on} className={field} />
      <textarea name="excerpt" rows={3} defaultValue={post?.excerpt} placeholder="Krótki wstęp" className={field} />
      <textarea name="body" rows={10} defaultValue={post?.body} placeholder="Treść (akapity oddziel pustą linią)" className={field} />
      <input type="file" name="image" accept="image/*" className="text-sm text-cream-muted" />
      <input name="image_url" defaultValue={post?.image_url} placeholder="albo URL zdjęcia" className={field} />
      <label className="flex items-center gap-2 text-sm text-cream">
        <input type="checkbox" name="published" defaultChecked={post?.published ?? false} className="accent-gold" />
        Opublikowany (widoczny na stronie)
      </label>
      {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase"
      >
        {pending ? "Zapisywanie…" : "Zapisz wpis"}
      </button>
    </form>
  );
}
