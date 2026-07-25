import type { ReleaseStatus } from "@/lib/database.types";
import { STATUS_LABELS, STATUS_STYLES } from "@/lib/status";

export function StatusBadge({ status }: { status: ReleaseStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
