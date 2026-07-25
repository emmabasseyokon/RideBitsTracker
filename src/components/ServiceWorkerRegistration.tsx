"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failing (e.g. unsupported browser) is fine — the app
        // still works, it just isn't installable/offline-capable.
      });
    }
  }, []);

  return null;
}
