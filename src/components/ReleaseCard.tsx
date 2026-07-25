import type { Release } from "@/lib/database.types";
import { formatRelativeTime } from "@/lib/time";
import { StatusBadge } from "./StatusBadge";

export function ReleaseCard({
  release,
  onClick,
}: {
  release: Release;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 text-left shadow-sm active:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:active:bg-neutral-800"
    >
      <div className="flex flex-col gap-1">
        <span className="font-mono text-base font-semibold">
          {release.version}
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {formatRelativeTime(release.created_at)}
        </span>
      </div>
      <StatusBadge status={release.status} />
    </button>
  );
}
