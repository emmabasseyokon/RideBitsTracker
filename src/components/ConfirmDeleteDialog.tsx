"use client";

export function ConfirmDeleteDialog({
  version,
  isPending,
  onConfirm,
  onCancel,
}: {
  version: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-6"
      onClick={(e) => {
        e.stopPropagation();
        onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={`Delete ${version}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-5 dark:bg-neutral-900"
      >
        <h3 className="mb-1 text-base font-semibold">
          Delete {version}?
        </h3>
        <p className="mb-5 text-sm text-neutral-500 dark:text-neutral-400">
          This release will be permanently removed. This can&apos;t be undone.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 rounded-lg border border-neutral-300 py-2.5 text-sm font-semibold disabled:opacity-50 dark:border-neutral-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
