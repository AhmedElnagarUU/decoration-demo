"use client";

import { X } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BannerData {
  id: string;
  message: { en: string; ar: string };
  link?: string;
}

export function AnnouncementBanner() {
  const locale = useLocale();
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/banners/active")
      .then((r) => r.json())
      .then((data) => {
        if (data.banner) setBanner(data.banner);
      })
      .catch(() => {});
  }, []);

  if (!banner || dismissed) return null;

  const message = locale === "ar" ? banner.message.ar : banner.message.en;

  return (
    <div className="relative bg-accent px-4 py-2.5 text-center text-sm text-white">
      {banner.link ? (
        <Link href={banner.link} className="hover:underline">
          {message}
        </Link>
      ) : (
        <span>{message}</span>
      )}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
