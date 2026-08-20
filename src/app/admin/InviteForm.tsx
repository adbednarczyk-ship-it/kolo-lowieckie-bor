"use client";

import { useActionState } from "react";
import { inviteMember, type AdminState } from "./actions";
import { roleLabels, userRoles } from "@/types/auth";

export function InviteForm() {
  const [state, action, pending] = useActionState<AdminState, FormData>(
    inviteMember,
    undefined,
  );

  return (
    <form
      action={action}
      className="border border-cream/10 bg-charcoal/40 p-6 sm:p-8"
    >
      <h2 className="font-serif text-2xl text-cream">Dodaj członka</h2>
      <p className="mt-2 text-sm text-cream-muted">
        Konto pojawi się od razu. Przekaż osobie e-mail i hasło tymczasowe.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Imię i nazwisko</span>
          <input
            required
            name="full_name"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">E-mail</span>
          <input
            required
            type="email"
            name="email"
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Hasło tymczasowe</span>
          <input
            required
            type="password"
            name="password"
            minLength={8}
            className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-cream-muted">Rola</span>
          <select
            name="role"
            defaultValue="member"
            className="w-full border border-cream/15 bg-charcoal px-4 py-3 text-cream outline-none focus:border-gold"
          >
            {userRoles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state?.error ? (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="mt-4 text-sm text-gold" role="status">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 rounded-full bg-gold px-8 py-3.5 text-sm font-medium tracking-[0.16em] text-charcoal uppercase hover:bg-gold-light disabled:opacity-60"
      >
        {pending ? "Dodawanie…" : "Dodaj konto"}
      </button>
    </form>
  );
}
