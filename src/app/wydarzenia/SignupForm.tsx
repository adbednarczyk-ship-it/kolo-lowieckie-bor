"use client";

import { useActionState } from "react";
import Link from "next/link";
import { cancelSignup, signupForEvent, type SignupState } from "./actions";
import { type ClubEvent } from "@/types/events";

export function SignupForm({
  event,
  taken,
  isLoggedIn,
  ownSignupId,
}: {
  event: ClubEvent;
  taken: number;
  isLoggedIn: boolean;
  ownSignupId: string | null;
}) {
  const [state, action, pending] = useActionState<SignupState, FormData>(
    signupForEvent,
    undefined,
  );
  const past = event.event_date < new Date().toISOString().slice(0, 10);
  const full = Boolean(event.capacity && taken >= event.capacity);
  const remaining = event.capacity ? Math.max(event.capacity - taken, 0) : null;

  if (past) {
    return <p className="text-sm text-cream-muted">To wydarzenie już się odbyło.</p>;
  }

  if (ownSignupId) {
    return (
      <div>
        <p className="text-gold">Jesteś zapisany na to wydarzenie.</p>
        <form action={cancelSignup} className="mt-4">
          <input type="hidden" name="event_id" value={event.id} />
          <input type="hidden" name="signup_id" value={ownSignupId} />
          <button type="submit" className="text-sm text-cream-muted uppercase hover:text-gold">
            Wypisz się
          </button>
        </form>
      </div>
    );
  }

  if (full) {
    return <p className="text-sm text-cream-muted">Brak wolnych miejsc.</p>;
  }

  if (event.signup_type === "members" && !isLoggedIn) {
    return (
      <p className="text-sm text-cream-muted">
        Zapisy tylko dla członków.{" "}
        <Link href={`/logowanie?next=/wydarzenia/${event.id}`} className="text-gold">
          Zaloguj się
        </Link>
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="event_id" value={event.id} />
      {remaining !== null ? (
        <p className="text-sm text-gold">Wolne miejsca: {remaining}</p>
      ) : (
        <p className="text-sm text-cream-muted">Bez limitu miejsc.</p>
      )}
      {!isLoggedIn ? (
        <>
          <input
            required
            name="guest_name"
            placeholder="Imię i nazwisko"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
          <input
            required
            type="email"
            name="guest_email"
            placeholder="E-mail"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
          <input
            name="guest_phone"
            placeholder="Telefon (opcjonalnie)"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </>
      ) : null}
      {state?.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      {state?.success ? <p className="text-sm text-gold">{state.success}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : "Zapisz się"}
      </button>
    </form>
  );
}
