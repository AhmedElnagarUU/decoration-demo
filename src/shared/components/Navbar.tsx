"use client";

import { SITE_NAME } from "@/lib/constants";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { cn } from "@/lib/utils/cn";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const locale = pathname.split("/")[1] || "en";
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

  const links = [
    { href: `/${locale}/work`, label: t("work") },
    { href: `/${locale}/services`, label: t("services") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const isTransparent = isHome && !scrolled;

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: isTransparent
          ? "rgba(0, 0, 0, 0)"
          : "rgba(255, 255, 255, 0.95)",
        boxShadow: isTransparent
          ? "0 0 0 rgba(0,0,0,0)"
          : "0 1px 20px rgba(0,0,0,0.06)",
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "top-0 z-50 w-full backdrop-blur-md",
        isHome ? "fixed" : "sticky",
        isTransparent ? "text-white" : "border-b border-border/50 text-foreground",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8 lg:py-5">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <motion.span
            animate={{ borderColor: isTransparent ? "#ffffff" : "#1a1a1a" }}
            transition={{ duration: 0.35 }}
            className="inline-block h-5 w-5 border-2"
          />
          <span className="font-serif text-xl font-semibold tracking-[0.15em] uppercase">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors",
                isTransparent ? "hover:text-white/80" : "hover:text-accent",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher light={isTransparent} />
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className={cn(
            "border-t px-6 py-4 md:hidden",
            isTransparent ? "border-white/20 bg-black/80" : "border-border bg-card",
          )}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-sm font-medium tracking-wide"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </motion.header>
  );
}
