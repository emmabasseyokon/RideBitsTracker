"use client";

import { useMemo, useState } from "react";
import type { Environment, Release } from "@/lib/database.types";
import { ENVIRONMENT_LABELS } from "@/lib/status";
import { EnvironmentTabs } from "./EnvironmentTabs";
import { ReleaseCard } from "./ReleaseCard";
import { ReleaseFormSheet } from "./ReleaseFormSheet";
import { ThemeToggle } from "./ThemeToggle";

export function ReleaseTracker({
  initialReleases,
  loadError,
}: {
  initialReleases: Release[];
  loadError: string | null;
}) {
  const [environment, setEnvironment] = useState<Environment>("production");
  const [creating, setCreating] = useState(false);

  const releases = useMemo(
    () => initialReleases.filter((r) => r.environment === environment),
    [initialReleases, environment],
  );

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">RideBits Release Tracker</h1>
        <ThemeToggle />
      </div>

      <EnvironmentTabs active={environment} onChange={setEnvironment} />

      {loadError && (
        <p className="text-sm text-red-600">
          Couldn&apos;t load releases: {loadError}
        </p>
      )}

      {!loadError && releases.length === 0 && (
        <p className="mt-8 text-center text-sm text-neutral-500">
          No {ENVIRONMENT_LABELS[environment].toLowerCase()} releases yet.
        </p>
      )}

      <div className="flex flex-col gap-3 pb-20">
        {releases.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCreating(true)}
        aria-label="Add release"
        className="fixed right-6 bottom-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-2xl leading-none text-white shadow-lg dark:bg-neutral-50 dark:text-neutral-900"
      >
        +
      </button>

      {creating && (
        <ReleaseFormSheet
          mode="create"
          environment="staging"
          onClose={() => setCreating(false)}
        />
      )}
    </main>
  );
}
