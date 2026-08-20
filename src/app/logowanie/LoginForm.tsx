"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined,
  );

  return (
    <form action={action} className="border border-cream/10 bg-charcoal/40 p-6 sm:p-8">
      <input type="hidden" name="next" value={nextPath} />
      <label className="block text-sm">
        <span className="mb-2 block tracking-wide text-cream-muted">E-mail</span>
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none transition focus:border-gold"
        />
      </label>
      <label className="mt-5 block text-sm">
        <span className="mb-2 block tracking-wide text-cream-muted">Hasło</span>
        <input
          required
          type="password"
          name="password"
          autoComplete="current-password"
          className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none transition focus:border-gold"
        />
      </label>
      {state?.error ? (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-[0.16em] text-charcoal uppercase transition hover:bg-gold-light disabled:opacity-60"
      >
        {pending ? "Logowanie…" : "Zaloguj się"}
      </button>
      <p className="mt-6 text-sm leading-relaxed text-cream-muted">
        Konta zakłada wyłącznie zarząd koła. Jeśli nie masz dostępu, napisz na
        stronie głównej w sekcji Kontakt.
      </p>
    </form>
  );
}
