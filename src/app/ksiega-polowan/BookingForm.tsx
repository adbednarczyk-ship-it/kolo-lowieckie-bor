"use client";

import { useActionState } from "react";
import { createBooking, type FormState } from "./actions";

export function BookingForm({
  groundId,
  date,
}: {
  groundId: string;
  date: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    createBooking,
    undefined,
  );

  return (
    <form action={action} className="border border-cream/10 bg-charcoal/40 p-6">
      <h2 className="font-serif text-2xl text-cream">Zapisz się</h2>
      <p className="mt-2 text-sm text-cream-muted">
        Wybierz zakres godzin. Nie może nachodzić na cudzą rezerwację.
      </p>
      <input type="hidden" name="ground_id" value={groundId} />
      <input type="hidden" name="reserved_on" value={date} />
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Od</span>
          <input
            required
            type="time"
            name="starts_at"
            defaultValue="06:00"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Do</span>
          <input
            required
            type="time"
            name="ends_at"
            defaultValue="12:00"
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
        {pending ? "Zapisywanie…" : "Zarezerwuj zakres"}
      </button>
    </form>
  );
}
