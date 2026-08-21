"use client";

import { useActionState } from "react";
import { updateDamageReport, type DamageUpdateState } from "../actions";
import { type Profile } from "@/types/auth";
import {
  damageStatusLabels,
  damageStatuses,
  type DamageStatus,
} from "@/types/damages";

export function UpdateForm({
  reportId,
  status,
  assigneeId,
  notes,
  estimators,
}: {
  reportId: string;
  status: DamageStatus;
  assigneeId: string | null;
  notes: string;
  estimators: Pick<Profile, "id" | "email" | "full_name">[];
}) {
  const [state, action, pending] = useActionState<DamageUpdateState, FormData>(
    updateDamageReport,
    undefined,
  );

  return (
    <form action={action} className="mt-12 space-y-5 border border-cream/10 p-6">
      <input type="hidden" name="id" value={reportId} />
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Status</span>
        <select
          name="status"
          defaultValue={status}
          className="w-full border border-cream/15 bg-charcoal px-4 py-3 text-cream outline-none focus:border-gold"
        >
          {damageStatuses.map((item) => (
            <option key={item} value={item}>
              {damageStatusLabels[item]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Osoba szacująca</span>
        <select
          name="assignee_id"
          defaultValue={assigneeId ?? ""}
          className="w-full border border-cream/15 bg-charcoal px-4 py-3 text-cream outline-none focus:border-gold"
        >
          <option value="">Nieprzypisana</option>
          {estimators.map((person) => (
            <option key={person.id} value={person.id}>
              {person.full_name || person.email}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-cream-muted">Notatki wewnętrzne</span>
        <textarea
          name="internal_notes"
          rows={5}
          defaultValue={notes}
          className="w-full border border-cream/15 bg-transparent px-4 py-3 text-cream outline-none focus:border-gold"
        />
      </label>
      {state?.error ? (
        <p className="text-sm text-red-300">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="text-sm text-gold">{state.success}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gold px-8 py-3 text-sm tracking-[0.16em] text-charcoal uppercase disabled:opacity-60"
      >
        {pending ? "Zapisywanie…" : "Zapisz"}
      </button>
    </form>
  );
}
