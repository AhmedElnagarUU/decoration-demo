"use client";

import type { Banner, Inquiry, Pixel, PrivacyPolicy, Project, SocialLink } from "@/lib/data/types";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/lib/local-storage";

export const DEMO_KEYS = {
  projects: "dc_projects",
  banners: "dc_banners",
  inquiries: "dc_inquiries",
  pixels: "dc_pixels",
  socialLinks: "dc_social_links",
  privacyPolicy: "dc_privacy_policy",
} as const;

export interface DemoStoreSnapshot {
  projects: Project[];
  banners: Banner[];
  inquiries: Inquiry[];
  pixels: Pixel[];
  socialLinks: SocialLink[];
  privacyPolicy: PrivacyPolicy;
}

export function readDemoStoreFromLocalStorage(): Partial<DemoStoreSnapshot> {
  const projects = getLocalStorageItem(DEMO_KEYS.projects);
  const banners = getLocalStorageItem(DEMO_KEYS.banners);
  const inquiries = getLocalStorageItem(DEMO_KEYS.inquiries);
  const pixels = getLocalStorageItem(DEMO_KEYS.pixels);
  const socialLinks = getLocalStorageItem(DEMO_KEYS.socialLinks);
  const privacyPolicy = getLocalStorageItem(DEMO_KEYS.privacyPolicy);

  return {
    ...(projects ? { projects: JSON.parse(projects) as Project[] } : {}),
    ...(banners ? { banners: JSON.parse(banners) as Banner[] } : {}),
    ...(inquiries ? { inquiries: JSON.parse(inquiries) as Inquiry[] } : {}),
    ...(pixels ? { pixels: JSON.parse(pixels) as Pixel[] } : {}),
    ...(socialLinks ? { socialLinks: JSON.parse(socialLinks) as SocialLink[] } : {}),
    ...(privacyPolicy ? { privacyPolicy: JSON.parse(privacyPolicy) as PrivacyPolicy } : {}),
  };
}

export function hasLocalDemoData(): boolean {
  const store = readDemoStoreFromLocalStorage();
  return !!(
    store.projects?.length ||
    store.banners?.length ||
    store.inquiries?.length ||
    store.pixels?.length ||
    store.socialLinks?.length ||
    store.privacyPolicy
  );
}

export function writeDemoStoreToLocalStorage(store: DemoStoreSnapshot): void {
  setLocalStorageItem(DEMO_KEYS.projects, JSON.stringify(store.projects));
  setLocalStorageItem(DEMO_KEYS.banners, JSON.stringify(store.banners));
  setLocalStorageItem(DEMO_KEYS.inquiries, JSON.stringify(store.inquiries));
  setLocalStorageItem(DEMO_KEYS.pixels, JSON.stringify(store.pixels));
  setLocalStorageItem(DEMO_KEYS.socialLinks, JSON.stringify(store.socialLinks));
  setLocalStorageItem(DEMO_KEYS.privacyPolicy, JSON.stringify(store.privacyPolicy));
}

export async function hydrateServerFromLocalStorage(): Promise<boolean> {
  const store = readDemoStoreFromLocalStorage();
  if (!hasLocalDemoData()) return false;

  const res = await fetch("/api/demo/store", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(store),
  });

  return res.ok;
}

export async function syncDemoStoreFromServer(): Promise<void> {
  const res = await fetch("/api/demo/store");
  if (!res.ok) return;

  const store = (await res.json()) as DemoStoreSnapshot;
  writeDemoStoreToLocalStorage(store);
}
