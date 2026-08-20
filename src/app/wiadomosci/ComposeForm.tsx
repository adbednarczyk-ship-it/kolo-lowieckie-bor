"use client";

import { useActionState, useState } from "react";
import { sendMessage, type MessageState } from "./actions";
import { roleLabels, type Profile } from "@/types/auth";

export function ComposeForm({ people }: { people: Profile[] }) {
  const [audience, setAudience] = useState("all");
  const [state, action, pending] = useActionState<MessageState, FormData>(
    sendMessage,
    undefined,
  );

  return (
    <form action={action} className="border border-cream/10 bg-charcoal/40 p-6 sm:p-8">
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Temat</span>
        <input
          required
          name="subject"
          className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </label>
      <label className="mt-5 block text-sm">
        <span className="mb-2 block text-cream-muted">Treść</span>
        <textarea
          required
          name="body"
          rows={8}
          className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </label>
      <fieldset className="mt-6">
        <legend className="text-sm text-cream-muted">Odbiorcy</legend>
        <div className="mt-3 flex flex-col gap-2 text-sm text-cream">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="audience"
              value="all"
              checked={audience === "all"}
              onChange={() => setAudience("all")}
              className="accent-gold"
            />
            Wszyscy członkowie koła
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="audience"
              value="members"
              checked={audience === "members"}
              onChange={() => setAudience("members")}
              className="accent-gold"
            />
            Tylko zwykli członkowie
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="audience"
              value="selected"
              checked={audience === "selected"}
              onChange={() => setAudience("selected")}
              className="accent-gold"
            />
            Wybrane osoby
          </label>
        </div>
      </fieldset>
      {audience === "selected" ? (
        <ul className="mt-4 max-h-56 space-y-2 overflow-auto border border-cream/10 p-4 text-sm">
          {people.map((person) => (
            <li key={person.id}>
              <label className="flex items-center gap-2 text-cream">
                <input
                  type="checkbox"
                  name="recipient"
                  value={person.id}
                  className="accent-gold"
                />
                {person.full_name || person.email}
                <span className="text-cream-muted">
                  ({roleLabels[person.role]})
                </span>
              </label>
            </li>
          ))}
        </ul>
      ) : null}
      {state?.error ? (
        <p className="mt-4 text-sm text-red-300">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-8 rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase hover:bg-gold-light disabled:opacity-60"
      >
        {pending ? "Wysyłanie…" : "Wyślij"}
      </button>
    </form>
  );
}
