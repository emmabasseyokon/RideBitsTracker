"use client";

import { useEffect, useRef, useState } from "react";

type MenuItem = {
  label: string;
  onClick: () => void;
  destructive?: boolean;
};

export function KebabMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Release options"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 active:bg-neutral-100 dark:text-neutral-400 dark:active:bg-neutral-800"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm ${
                item.destructive
                  ? "text-red-600 dark:text-red-400"
                  : "text-neutral-700 dark:text-neutral-300"
              } active:bg-neutral-100 dark:active:bg-neutral-800`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
