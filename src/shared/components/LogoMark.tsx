"use client";

import { cn } from "@/lib/utils/cn";
import { Armchair } from "lucide-react";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Armchair
      className={cn("h-5 w-5 shrink-0", className)}
      strokeWidth={1.75}
      aria-hidden
    />
  );
}
