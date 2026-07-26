"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Release } from "@/lib/database.types";
import { deleteRelease } from "@/lib/actions";
import { getPushSubscriptionEndpoint } from "@/lib/push-client";
import { ENVIRONMENT_LABELS } from "@/lib/status";
import { formatRelativeTime } from "@/lib/time";
import { StatusBadge } from "./StatusBadge";
import { KebabMenu } from "./KebabMenu";
import { ReleaseFormSheet } from "./ReleaseFormSheet";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function ReleaseDetails({ release }: { release: Release }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        const subscriberEndpoint = await getPushSubscriptionEndpoint();
        await deleteRelease(release.id, subscriberEndpoint);
        router.push("/");
      } catch (err) {
        setDeleting(false);
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 active:bg-neutral-100 dark:text-neutral-400 dark:active:bg-neutral-800"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <KebabMenu
          items={[
            { label: "Edit", onClick: () => setEditing(true) },
            { label: "Delete", onClick: () => setDeleting(true), destructive: true },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-2xl font-semibold">{release.version}</span>
          <StatusBadge status={release.status} />
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {ENVIRONMENT_LABELS[release.environment]}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Released {formatRelativeTime(release.created_at)}
        </p>
        {release.notes && (
          <div>
            <h2 className="mb-1 text-sm font-medium">Notes</h2>
            <p className="whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300">
              {release.notes}
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {editing && (
        <ReleaseFormSheet
          mode="edit"
          environment={release.environment}
          release={release}
          onClose={() => setEditing(false)}
        />
      )}

      {deleting && (
        <ConfirmDeleteDialog
          version={release.version}
          isPending={isPending}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(false)}
        />
      )}
    </main>
  );
}
