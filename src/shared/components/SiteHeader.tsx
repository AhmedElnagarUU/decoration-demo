"use client";

import { AnnouncementBanner } from "@/shared/components/AnnouncementBanner";
import { Navbar } from "@/shared/components/Navbar";
import { useEffect, useRef } from "react";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${el.offsetHeight}px`,
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="fixed top-0 z-50 w-full">
      <Navbar />
      <AnnouncementBanner />
    </header>
  );
}
