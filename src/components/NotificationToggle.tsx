"use client";

import { useEffect, useState } from "react";
import {
  getPushStatus,
  subscribeToPushNotifications,
  type PushStatus,
} from "@/lib/push-client";

export function NotificationToggle() {
  const [status, setStatus] = useState<PushStatus | "checking">("checking");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    getPushStatus().then(setStatus);
  }, []);

  if (status === "checking" || status === "unsupported") return null;

  async function handleClick() {
    setPending(true);
    try {
      const ok = await subscribeToPushNotifications();
      setStatus(ok ? "subscribed" : "unsubscribed");
    } catch {
      setStatus("unsubscribed");
    } finally {
      setPending(false);
    }
  }

  if (status === "subscribed") {
    return (
      <span className="text-xs text-neutral-500 dark:text-neutral-400">
        Notifications on
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-xs font-medium text-neutral-500 underline disabled:opacity-50 dark:text-neutral-400"
    >
      {pending ? "Enabling…" : "Enable notifications"}
    </button>
  );
}
