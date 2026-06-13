const STORAGE_KEY = "dashboard-tour-seen-pages";

export function getSeenTourPages(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markTourPageSeen(pageKey: string): void {
  const seen = new Set(getSeenTourPages());
  seen.add(pageKey);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
}

export function hasSeenTourPage(pageKey: string): boolean {
  return getSeenTourPages().includes(pageKey);
}

export function resetTourProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}
