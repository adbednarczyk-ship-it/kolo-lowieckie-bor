"use client";

import { useActionState } from "react";
import { saveEvent, type EventFormState } from "./actions";
import { signupTypeLabels, signupTypes, type ClubEvent } from "@/types/events";

const field =
  "w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold";

export function EventForm({ event }: { event?: ClubEvent }) {
  const [state, action, pending] = useActionState<EventFormState, FormData>(
    saveEvent,
    undefined,
  );

  return (
    <form action={action} className="space-y-5 border border-cream/10 p-6">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Tytuł</span>
        <input required name="title" defaultValue={event?.title} className={field} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Data</span>
          <input
            required
            type="date"
            name="event_date"
            defaultValue={event?.event_date}
            className={field}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Godzina</span>
          <input
            type="time"
            name="event_time"
            defaultValue={event?.event_time?.slice(0, 5) ?? ""}
            className={field}
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Miejsce</span>
        <input name="location" defaultValue={event?.location} className={field} />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Opis</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={event?.description}
          className={field}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">
          Limit miejsc (puste = bez limitu)
        </span>
        <input
          type="number"
          min={1}
          name="capacity"
          defaultValue={event?.capacity ?? ""}
          className={field}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Kto może się zapisać</span>
        <select
          name="signup_type"
          defaultValue={event?.signup_type ?? "members"}
          className="w-full border border-cream/15 bg-charcoal px-4 py-3 text-cream outline-none focus:border-gold"
        >
          {signupTypes.map((type) => (
            <option key={type} value={type}>
              {signupTypeLabels[type]}
            </option>
          ))}
        </select>
      </label>
      {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-gold">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : event ? "Zapisz zmiany" : "Dodaj wydarzenie"}
      </button>
    </form>
  );
}
