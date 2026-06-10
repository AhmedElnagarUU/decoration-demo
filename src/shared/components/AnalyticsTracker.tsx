"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const tracked = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/dashboard") || tracked.current === pathname) return;
    tracked.current = pathname;

    async function track() {
      let country = "Unknown";
      let city = "Unknown";

      try {
        const geoRes = await fetch("http://ip-api.com/json/?fields=country,city");
        const geo = await geoRes.json();
        country = geo.country ?? "Unknown";
        city = geo.city ?? "Unknown";
      } catch {
        // geolocation unavailable
      }

      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          referrer: document.referrer,
          country,
          city,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    track();
  }, [pathname]);

  return null;
}
