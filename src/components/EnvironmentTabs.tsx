"use client";

import type { Environment } from "@/lib/database.types";
import { ENVIRONMENT_LABELS } from "@/lib/status";

const ENVIRONMENTS: Environment[] = ["production", "staging"];

export function EnvironmentTabs({
  active,
  onChange,
}: {
  active: Environment;
  onChange: (environment: Environment) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
      {ENVIRONMENTS.map((environment) => (
        <button
          key={environment}
          type="button"
          onClick={() => onChange(environment)}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
            active === environment
              ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-950 dark:text-neutral-50"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          {ENVIRONMENT_LABELS[environment]}
        </button>
      ))}
    </div>
  );
}
