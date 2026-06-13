"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Armchair } from "lucide-react";

export function LogoMark({
  className,
}: {
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Function to check scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    // Attach listener
    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Armchair
      className={cn(
        "h-5 w-5 shrink-0",
        scrolled ? "text-black" : "text-white",
        className,
      )}
      strokeWidth={1.75}
      aria-hidden
    />
  );
}
