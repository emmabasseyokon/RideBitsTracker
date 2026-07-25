import type { Environment, ReleaseStatus } from "./database.types";

export const STATUS_LABELS: Record<ReleaseStatus, string> = {
  in_production: "In Production",
  rolled_back: "Rolled Back",
  current_version: "Current Version",
};

export const STATUS_STYLES: Record<ReleaseStatus, string> = {
  current_version:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  in_production:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  rolled_back: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

export const STATUSES_BY_ENVIRONMENT: Record<Environment, ReleaseStatus[]> = {
  production: ["current_version", "in_production", "rolled_back"],
  staging: ["current_version", "in_production"],
};

export const ENVIRONMENT_LABELS: Record<Environment, string> = {
  production: "Production",
  staging: "Staging",
};
