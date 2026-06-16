"use client";

import {
  hasLocalDemoData,
  hydrateServerFromLocalStorage,
} from "@/lib/data/demo-client-sync";
import { IS_DEMO } from "@/lib/config";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function DemoStoreHydrator() {
  const router = useRouter();
  const hydrated = useRef(false);

  useEffect(() => {
    if (!IS_DEMO || hydrated.current) return;
    hydrated.current = true;

    if (!hasLocalDemoData()) return;

    void hydrateServerFromLocalStorage().then((ok) => {
      if (ok) router.refresh();
    });
  }, [router]);

  return null;
}
