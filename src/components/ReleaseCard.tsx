import Link from "next/link";
import type { Release } from "@/lib/database.types";
import { formatRelativeTime } from "@/lib/time";
import { StatusBadge } from "./StatusBadge";

export function ReleaseCard({ release }: { release: Release }) {
  return (
    <Link
      href={`/releases/${release.id}`}
      className="flex w-full flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-left shadow-sm active:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:active:bg-neutral-800"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-base font-semibold">
            {release.version}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Released {formatRelativeTime(release.created_at)}
          </span>
        </div>
        <StatusBadge status={release.status} />
      </div>
      {release.notes && (
        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
          {release.notes}
        </p>
      )}
    </Link>
  );
}
