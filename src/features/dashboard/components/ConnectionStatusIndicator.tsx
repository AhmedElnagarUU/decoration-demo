"use client";

import { useOnlineStatus } from "@/features/dashboard/hooks/useOnlineStatus";

export function ConnectionStatusIndicator({ compact }: { compact?: boolean }) {
  const isOnline = useOnlineStatus();

  if (isOnline === null) {
    return null;
  }

  const label = isOnline ? "Connected" : "Offline";
  const title = isOnline
    ? "Internet connection is active"
    : "No internet connection";

  return (
    <div
      className={`flex items-center ${compact ? "gap-1.5" : "gap-2 rounded px-3 py-2"}`}
      title={title}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          isOnline
            ? "bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.45)]"
            : "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.45)]"
        }`}
        aria-hidden="true"
      />
      {!compact && (
        <span className="text-xs text-muted">{label}</span>
      )}
    </div>
  );
}
