"use client";

import type {
  Banner,
  Inquiry,
  Pixel,
  PrivacyPolicy,
  Project,
  SocialLink,
} from "@/lib/data/types";
import { useCallback, useEffect, useState } from "react";
import { DEMO_STORE_CHANGED } from "./events";
import {
  getLocalActiveBanner,
  getLocalBanners,
  getLocalEnabledSocialLinks,
  getLocalInquiries,
  getLocalPixels,
  getLocalPrivacyPolicy,
  getLocalProjectById,
  getLocalProjectBySlug,
  getLocalProjects,
  getLocalPublishedPrivacyPolicy,
  getLocalSocialLinks,
} from "./local-store";

function useDemoRefresh<T>(read: () => T, seed: T): T {
  const [value, setValue] = useState<T>(seed);

  const refresh = useCallback(() => {
    setValue(read());
  }, [read]);

  useEffect(() => {
    refresh();
    window.addEventListener(DEMO_STORE_CHANGED, refresh);
    return () => window.removeEventListener(DEMO_STORE_CHANGED, refresh);
  }, [refresh]);

  return value;
}

export function useDemoProjects(seed: Project[], publishedOnly = false): Project[] {
  const read = useCallback(() => getLocalProjects(publishedOnly), [publishedOnly]);
  return useDemoRefresh(read, seed);
}

export function useDemoProjectById(id: string, seed: Project | null): Project | null {
  const read = useCallback(() => getLocalProjectById(id) ?? seed, [id, seed]);
  return useDemoRefresh(read, seed);
}

export function useDemoProjectBySlug(
  slug: string,
  seed: Project | null,
): Project | null {
  const read = useCallback(() => getLocalProjectBySlug(slug) ?? seed, [slug, seed]);
  return useDemoRefresh(read, seed);
}

export function useDemoBanners(seed: Banner[]): Banner[] {
  const read = useCallback(() => getLocalBanners(), []);
  return useDemoRefresh(read, seed);
}

export function useDemoActiveBanner(): Banner | null {
  const read = useCallback(() => getLocalActiveBanner(), []);
  return useDemoRefresh(read, null);
}

export function useDemoInquiries(seed: Inquiry[]): Inquiry[] {
  const read = useCallback(() => getLocalInquiries(), []);
  return useDemoRefresh(read, seed);
}

export function useDemoPixels(seed: Pixel[]): Pixel[] {
  const read = useCallback(() => getLocalPixels(), []);
  return useDemoRefresh(read, seed);
}

export function useDemoSocialLinks(seed: SocialLink[]): SocialLink[] {
  const read = useCallback(() => getLocalEnabledSocialLinks(), []);
  return useDemoRefresh(read, seed);
}

export function useDemoAllSocialLinks(seed: SocialLink[]): SocialLink[] {
  const read = useCallback(() => getLocalSocialLinks(), []);
  return useDemoRefresh(read, seed);
}

export function useDemoPrivacyPolicy(seed: PrivacyPolicy): PrivacyPolicy {
  const read = useCallback(() => getLocalPrivacyPolicy(), []);
  return useDemoRefresh(read, seed);
}

export function useDemoPublishedPrivacyPolicy(
  seed: PrivacyPolicy | null,
): PrivacyPolicy | null {
  const read = useCallback(() => getLocalPublishedPrivacyPolicy(), []);
  return useDemoRefresh(read, seed);
}
