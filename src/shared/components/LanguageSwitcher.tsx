"use client";

import { cn } from "@/lib/utils/cn";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const currentLocale = segments[1] === "ar" ? "ar" : "en";
  const otherLocale = currentLocale === "en" ? "ar" : "en";

  function switchLocale() {
    segments[1] = otherLocale;
    const newPath = segments.join("/") || `/${otherLocale}`;
    router.push(newPath);
  }

  return (
    <button
      onClick={switchLocale}
      className={cn(
        "text-sm tracking-wide uppercase transition-colors",
        light ? "hover:text-white/80" : "hover:text-accent",
      )}
      aria-label={`Switch to ${otherLocale}`}
    >
      {otherLocale}
    </button>
  );
}
