"use client";

import { cn } from "@/lib/utils/cn";
import { usePathname } from "next/navigation";

export function MainWithOffset({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  return (
    <main
      className={cn(
        "flex-1",
        !isHome && "pt-[var(--site-header-height,4.5rem)]",
      )}
    >
      {children}
    </main>
  );
}
