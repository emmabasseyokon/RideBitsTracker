"use client";

import { useState, useTransition } from "react";
import type { Environment, Release, ReleaseStatus } from "@/lib/database.types";
import { STATUS_LABELS, STATUSES_BY_ENVIRONMENT, ENVIRONMENT_LABELS } from "@/lib/status";
import { createRelease, updateRelease } from "@/lib/actions";

type Props =
  | { mode: "create"; environment: Environment; release?: undefined; onClose: () => void }
  | { mode: "edit"; environment: Environment; release: Release; onClose: () => void };

export function ReleaseFormSheet({ mode, environment, release, onClose }: Props) {
  const otherEnvironment: Environment =
    environment === "production" ? "staging" : "production";

  const [targetEnvironment, setTargetEnvironment] = useState<Environment | "">("");
  const effectiveEnvironment: Environment =
    mode === "edit" && targetEnvironment ? targetEnvironment : environment;
  const statuses = STATUSES_BY_ENVIRONMENT[effectiveEnvironment];

  const [status, setStatus] = useState<ReleaseStatus>(release?.status ?? statuses[0]);
  const [notes, setNotes] = useState(release?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleMoveChange(value: string) {
    const next = value as Environment | "";
    setTargetEnvironment(next);
    const nextEnvironment = next || environment;
    const validStatuses = STATUSES_BY_ENVIRONMENT[nextEnvironment];
    if (!validStatuses.includes(status)) {
      setStatus(validStatuses[0]);
    }
  }

  function handleStatusChange(value: string) {
    const next = value as ReleaseStatus;
    setStatus(next);
    if (mode === "edit" && next === "rolled_back" && environment === "production") {
      setTargetEnvironment("staging");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createRelease({ environment, status, notes });
        } else {
          await updateRelease(release.id, {
            status,
            notes,
            ...(targetEnvironment ? { environment: targetEnvironment } : {}),
          });
        }
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-t-2xl bg-white p-5 pb-8 dark:bg-neutral-900"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-300 dark:bg-neutral-700" />

        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
          {targetEnvironment
            ? `${ENVIRONMENT_LABELS[environment]} → ${ENVIRONMENT_LABELS[targetEnvironment]}`
            : ENVIRONMENT_LABELS[environment]}
        </p>
        <h2 className="mb-4 text-lg font-semibold">
          {mode === "create" ? "New release" : release.version}
        </h2>

        {mode === "edit" && (
          <>
            <label htmlFor="move-to" className="mb-1 block text-sm font-medium">
              Move to
            </label>
            <select
              id="move-to"
              value={targetEnvironment}
              onChange={(e) => handleMoveChange(e.target.value)}
              className="mb-4 w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
            >
              <option value=""></option>
              <option value={otherEnvironment}>
                {ENVIRONMENT_LABELS[otherEnvironment]}
              </option>
            </select>
          </>
        )}

        <label htmlFor="status" className="mb-1 block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="mb-4 w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <label htmlFor="notes" className="mb-1 block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes ?? ""}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mb-4 w-full rounded-lg border border-neutral-300 p-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        />

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900"
        >
          {mode === "create" ? "Create release" : "Save"}
        </button>
      </form>
    </div>
  );
}
