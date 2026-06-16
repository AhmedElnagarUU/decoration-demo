export const DEMO_STORE_CHANGED = "demo-store-changed";

export function notifyDemoStoreChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(DEMO_STORE_CHANGED));
}
