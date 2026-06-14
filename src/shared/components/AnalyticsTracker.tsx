"use client";

import { getOrCreateVisitorId } from "@/lib/analytics/visitor-id";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const tracked = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/dashboard") || tracked.current === pathname) return;
    tracked.current = pathname;

    void fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer,
        visitorId: getOrCreateVisitorId(),
        timestamp: new Date().toISOString(),
      }),
    });
  }, [pathname]);

  return null;
}
