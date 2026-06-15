"use client";

import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/constants";
import { IS_PHONE_OTP_AVAILABLE } from "@/lib/config";
import { signOut } from "@/lib/auth/auth-client";
import {
  DashboardTourButton,
  useDashboardTour,
} from "@/features/dashboard/tour/DashboardTour";
import { ConnectionStatusIndicator } from "@/features/dashboard/components/ConnectionStatusIndicator";
import { FeedbackWidget } from "@/features/dashboard/components/FeedbackWidget";
import { LogoMark } from "@/shared/components/LogoMark";
import {
  BarChart3,
  Crosshair,
  Eye,
  FolderKanban,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Shield,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const storefrontUrl = `/${routing.defaultLocale}`;

const links = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard, short: "Home" },
  { href: "/dashboard/projects", label: "Projects", Icon: FolderKanban, short: "Projects" },
  { href: "/dashboard/banners", label: "Banners", Icon: Megaphone, short: "Banners" },
  { href: "/dashboard/analytics", label: "Analytics", Icon: BarChart3, short: "Stats" },
  { href: "/dashboard/pixels", label: "Pixels", Icon: Crosshair, short: "Pixels" },
  ...(IS_PHONE_OTP_AVAILABLE
    ? [{ href: "/dashboard/security", label: "Security", Icon: Shield, short: "Security" }]
    : []),
];

function NavLink({
  href,
  label,
  Icon,
  pathname,
  onNavigate,
  compact,
}: {
  href: string;
  label: string;
  Icon: typeof LayoutDashboard;
  pathname: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors ${
        compact ? "flex-col gap-1 px-2 py-2 text-[10px]" : ""
      } ${
        isActive
          ? compact
            ? "text-accent"
            : "bg-accent text-white"
          : compact
            ? "text-muted"
            : "text-muted hover:bg-background hover:text-foreground"
      }`}
    >
      <Icon className={compact ? "h-5 w-5" : "h-4 w-4"} strokeWidth={1.75} />
      <span className={compact ? "leading-tight" : ""}>{compact ? label.split(" ")[0] : label}</span>
    </Link>
  );
}

function ViewStorefrontLink({
  className,
  iconClassName = "h-4 w-4",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <a
      href={storefrontUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="View storefront"
    >
      <Eye className={iconClassName} strokeWidth={1.75} />
    </a>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { startTour } = useDashboardTour();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <LogoMark className="h-4 w-4" />
          <span className="font-serif text-sm font-semibold tracking-[0.12em] uppercase">
            {SITE_NAME}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ConnectionStatusIndicator compact />
          <ViewStorefrontLink
            className="rounded p-2 text-muted hover:bg-background hover:text-foreground"
            iconClassName="h-5 w-5"
          />
          <button
            type="button"
            onClick={startTour}
            className="rounded p-2 text-muted hover:bg-background hover:text-foreground"
            aria-label="Open dashboard guide"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded p-2 text-muted hover:bg-background hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />
          <aside className="absolute top-0 left-0 flex h-full w-72 flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div className="flex items-center gap-2">
                <LogoMark className="h-4 w-4" />
                <span className="font-serif text-sm font-semibold tracking-[0.12em] uppercase">
                  {SITE_NAME}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ViewStorefrontLink
                  className="rounded p-1.5 text-muted hover:bg-background hover:text-foreground"
                  iconClassName="h-5 w-5"
                />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded p-1 text-muted hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <nav className="flex-1 space-y-1 p-3" data-tour="tour-nav-sidebar">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  pathname={pathname}
                  onNavigate={() => setDrawerOpen(false)}
                />
              ))}
            </nav>
            <div className="space-y-1 border-t border-border p-3">
              <ConnectionStatusIndicator />
              <DashboardTourButton />
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div className="flex items-center gap-2">
              <LogoMark className="h-4 w-4" />
              <span className="font-serif text-sm font-semibold tracking-[0.15em] uppercase">
                {SITE_NAME}
              </span>
            </div>
            <ViewStorefrontLink className="rounded p-1.5 text-muted transition-colors hover:bg-background hover:text-foreground" />
          </div>
          <nav className="flex-1 space-y-1 p-4" data-tour="tour-nav-sidebar">
            {links.map((link) => (
              <NavLink key={link.href} {...link} pathname={pathname} />
            ))}
          </nav>
          <div className="space-y-1 border-t border-border p-4">
            <ConnectionStatusIndicator />
            <DashboardTourButton />
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Sign Out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:p-8">
          {children}
        </main>
      </div>

      <FeedbackWidget />

      {/* Mobile bottom nav */}
      <nav
        className="fixed right-0 bottom-0 left-0 z-40 border-t border-border bg-card lg:hidden"
        data-tour="tour-nav-mobile"
      >
        <div
          className={`grid ${links.length > 4 ? "grid-cols-5" : "grid-cols-4"}`}
        >
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.short}
              Icon={link.Icon}
              pathname={pathname}
              compact
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
