"use client";

import { SITE_NAME } from "@/lib/constants";
import { signOut } from "@/lib/auth/auth-client";
import {
  BarChart3,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", Icon: FolderKanban },
  { href: "/dashboard/banners", label: "Banners", Icon: Megaphone },
  { href: "/dashboard/analytics", label: "Analytics", Icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-6 py-5">
        <span className="inline-block h-4 w-4 border-2 border-foreground" />
        <span className="font-serif text-sm font-semibold tracking-[0.15em] uppercase">
          {SITE_NAME}
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "text-muted hover:bg-background hover:text-foreground"
              }`}
            >
              <link.Icon className="h-4 w-4" strokeWidth={1.75} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
