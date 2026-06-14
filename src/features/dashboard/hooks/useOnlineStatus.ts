"use client";

import { useCallback, useEffect, useState } from "react";

const CHECK_INTERVAL_MS = 15_000;
const CONNECTIVITY_CHECK_URL = "https://www.gstatic.com/generate_204";

async function verifyInternetAccess(): Promise<boolean> {
  if (!navigator.onLine) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch(CONNECTIVITY_CHECK_URL, {
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
}

export function useOnlineStatus(): boolean | null {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const updateStatus = useCallback(async () => {
    const online = await verifyInternetAccess();
    setIsOnline(online);
  }, []);

  useEffect(() => {
    void updateStatus();

    function handleOffline() {
      setIsOnline(false);
    }

    function handleOnline() {
      void updateStatus();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void updateStatus();
      }
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = setInterval(() => {
      void updateStatus();
    }, CHECK_INTERVAL_MS);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [updateStatus]);

  return isOnline;
}
