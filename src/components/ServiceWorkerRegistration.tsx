"use client";

import { useEffect } from "react";
import { subscribeToPushNotifications } from "@/lib/push-client";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => subscribeToPushNotifications())
        .catch(() => {
          // Registration/subscription failing (e.g. unsupported browser,
          // permission denied) is fine — the app still works, it just
          // isn't installable/notification-capable.
        });
    }
  }, []);

  return null;
}
