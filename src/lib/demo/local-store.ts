import { DEMO_BANNERS, DEMO_PROJECTS } from "@/lib/data/demo-seed";
import type {
  Banner,
  CreateBannerInput,
  CreateInquiryInput,
  CreatePixelInput,
  CreateProjectInput,
  CreateSocialLinkInput,
  Inquiry,
  InquiryStatus,
  Pixel,
  PrivacyPolicy,
  Project,
  PublicPixel,
  SocialLink,
  UpdateInquiryInput,
  UpdatePixelInput,
  UpdatePrivacyPolicyInput,
  UpdateProjectInput,
  UpdateSocialLinkInput,
} from "@/lib/data/types";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/lib/local-storage";
import { DEMO_PRIVACY_POLICY } from "@/lib/privacy-policy/demo-seed";
import { DEMO_SOCIAL_LINKS } from "@/lib/social-links/demo-seed";
import { v4 as uuidv4 } from "uuid";
import { notifyDemoStoreChanged } from "./events";

export const DEMO_KEYS = {
  projects: "dc_projects",
  banners: "dc_banners",
  inquiries: "dc_inquiries",
  pixels: "dc_pixels",
  socialLinks: "dc_social_links",
  privacyPolicy: "dc_privacy_policy",
} as const;

function sortByCreatedAt<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function readJson<T>(key: string, fallback: T): T {
  const raw = getLocalStorageItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  setLocalStorageItem(key, JSON.stringify(value));
  notifyDemoStoreChanged();
}

export function hasLocalDemoData(): boolean {
  if (typeof window === "undefined") return false;
  return Object.values(DEMO_KEYS).some((key) => getLocalStorageItem(key) !== null);
}

// ——— Projects ———

export function getLocalProjects(publishedOnly = false): Project[] {
  const projects = readJson(DEMO_KEYS.projects, DEMO_PROJECTS as Project[]);
  const filtered = publishedOnly
    ? projects.filter((p) => p.status === "published")
    : projects;
  return sortByCreatedAt(filtered);
}

export function getLocalProjectById(id: string): Project | null {
  return getLocalProjects().find((p) => p.id === id) ?? null;
}

export function getLocalProjectBySlug(slug: string): Project | null {
  return getLocalProjects().find((p) => p.slug === slug) ?? null;
}

export function createLocalProject(input: CreateProjectInput): Project {
  const projects = readJson(DEMO_KEYS.projects, DEMO_PROJECTS as Project[]);
  const now = new Date().toISOString();
  const project: Project = { id: uuidv4(), ...input, createdAt: now, updatedAt: now };
  projects.push(project);
  writeJson(DEMO_KEYS.projects, projects);
  return project;
}

export function updateLocalProject(
  id: string,
  input: UpdateProjectInput,
): Project | null {
  const projects = readJson(DEMO_KEYS.projects, DEMO_PROJECTS as Project[]);
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  projects[index] = {
    ...projects[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  writeJson(DEMO_KEYS.projects, projects);
  return projects[index];
}

export function deleteLocalProject(id: string): boolean {
  const projects = readJson(DEMO_KEYS.projects, DEMO_PROJECTS as Project[]);
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return false;
  projects.splice(index, 1);
  writeJson(DEMO_KEYS.projects, projects);
  return true;
}

// ——— Banners ———

export function getLocalBanners(): Banner[] {
  return sortByCreatedAt(readJson(DEMO_KEYS.banners, DEMO_BANNERS as Banner[]));
}

export function getLocalActiveBanner(): Banner | null {
  const now = new Date();
  return (
    getLocalBanners().find((b) => {
      if (!b.active) return false;
      if (b.expiresAt && new Date(b.expiresAt) < now) return false;
      return true;
    }) ?? null
  );
}

export function createLocalBanner(input: CreateBannerInput): Banner {
  const banners = readJson(DEMO_KEYS.banners, DEMO_BANNERS as Banner[]);
  if (input.active) {
    banners.forEach((b) => (b.active = false));
  }
  const banner: Banner = {
    id: uuidv4(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  banners.push(banner);
  writeJson(DEMO_KEYS.banners, banners);
  return banner;
}

export function updateLocalBanner(
  id: string,
  input: Partial<CreateBannerInput>,
): Banner | null {
  const banners = readJson(DEMO_KEYS.banners, DEMO_BANNERS as Banner[]);
  const index = banners.findIndex((b) => b.id === id);
  if (index === -1) return null;
  if (input.active) {
    banners.forEach((b) => (b.active = false));
  }
  banners[index] = { ...banners[index], ...input };
  writeJson(DEMO_KEYS.banners, banners);
  return banners[index];
}

export function deleteLocalBanner(id: string): boolean {
  const banners = readJson(DEMO_KEYS.banners, DEMO_BANNERS as Banner[]);
  const index = banners.findIndex((b) => b.id === id);
  if (index === -1) return false;
  banners.splice(index, 1);
  writeJson(DEMO_KEYS.banners, banners);
  return true;
}

// ——— Inquiries ———

export function getLocalInquiries(): Inquiry[] {
  const inquiries = readJson(DEMO_KEYS.inquiries, [] as Inquiry[]).map(
    (inquiry) => ({
      ...inquiry,
      source: inquiry.source ?? "contact",
    }),
  );
  return sortByCreatedAt(inquiries);
}

export function createLocalInquiry(input: CreateInquiryInput): Inquiry {
  const inquiries = readJson(DEMO_KEYS.inquiries, [] as Inquiry[]);
  const inquiry: Inquiry = {
    id: uuidv4(),
    ...input,
    source: input.source ?? "contact",
    status: "new" as InquiryStatus,
    createdAt: new Date().toISOString(),
  };
  inquiries.push(inquiry);
  writeJson(DEMO_KEYS.inquiries, inquiries);
  return inquiry;
}

export function updateLocalInquiry(
  id: string,
  input: UpdateInquiryInput,
): Inquiry | null {
  const inquiries = readJson(DEMO_KEYS.inquiries, [] as Inquiry[]);
  const index = inquiries.findIndex((i) => i.id === id);
  if (index === -1) return null;
  inquiries[index] = { ...inquiries[index], ...input };
  writeJson(DEMO_KEYS.inquiries, inquiries);
  return inquiries[index];
}

export function deleteLocalInquiry(id: string): boolean {
  const inquiries = readJson(DEMO_KEYS.inquiries, [] as Inquiry[]);
  const index = inquiries.findIndex((i) => i.id === id);
  if (index === -1) return false;
  inquiries.splice(index, 1);
  writeJson(DEMO_KEYS.inquiries, inquiries);
  return true;
}

// ——— Pixels ———

export function getLocalPixels(): Pixel[] {
  return readJson(DEMO_KEYS.pixels, [] as Pixel[]);
}

export function getLocalEnabledPixels(): PublicPixel[] {
  return getLocalPixels()
    .filter((pixel) => pixel.enabled)
    .map(({ id, platform, label, pixelId, enabled }) => ({
      id,
      platform,
      label,
      pixelId,
      enabled,
    }));
}

export function createLocalPixel(input: CreatePixelInput): Pixel {
  const pixels = getLocalPixels();
  const pixel: Pixel = { id: uuidv4(), ...input };
  pixels.push(pixel);
  writeJson(DEMO_KEYS.pixels, pixels);
  return pixel;
}

export function updateLocalPixel(
  id: string,
  input: UpdatePixelInput,
): Pixel | null {
  const pixels = getLocalPixels();
  const index = pixels.findIndex((pixel) => pixel.id === id);
  if (index === -1) return null;
  pixels[index] = { ...pixels[index], ...input };
  writeJson(DEMO_KEYS.pixels, pixels);
  return pixels[index];
}

export function deleteLocalPixel(id: string): boolean {
  const pixels = getLocalPixels();
  const index = pixels.findIndex((pixel) => pixel.id === id);
  if (index === -1) return false;
  pixels.splice(index, 1);
  writeJson(DEMO_KEYS.pixels, pixels);
  return true;
}

// ——— Social links ———

export function getLocalSocialLinks(): SocialLink[] {
  return readJson(DEMO_KEYS.socialLinks, DEMO_SOCIAL_LINKS as SocialLink[]);
}

export function getLocalEnabledSocialLinks(): SocialLink[] {
  return getLocalSocialLinks().filter((link) => link.enabled);
}

export function createLocalSocialLink(input: CreateSocialLinkInput): SocialLink {
  const links = getLocalSocialLinks();
  const link: SocialLink = { id: uuidv4(), ...input };
  links.push(link);
  writeJson(DEMO_KEYS.socialLinks, links);
  return link;
}

export function updateLocalSocialLink(
  id: string,
  input: UpdateSocialLinkInput,
): SocialLink | null {
  const links = getLocalSocialLinks();
  const index = links.findIndex((link) => link.id === id);
  if (index === -1) return null;
  links[index] = { ...links[index], ...input };
  writeJson(DEMO_KEYS.socialLinks, links);
  return links[index];
}

export function deleteLocalSocialLink(id: string): boolean {
  const links = getLocalSocialLinks();
  const index = links.findIndex((link) => link.id === id);
  if (index === -1) return false;
  links.splice(index, 1);
  writeJson(DEMO_KEYS.socialLinks, links);
  return true;
}

// ——— Privacy policy ———

export function getLocalPrivacyPolicy(): PrivacyPolicy {
  return readJson(DEMO_KEYS.privacyPolicy, { ...DEMO_PRIVACY_POLICY });
}

export function getLocalPublishedPrivacyPolicy(): PrivacyPolicy | null {
  const policy = getLocalPrivacyPolicy();
  return policy.published ? policy : null;
}

export function updateLocalPrivacyPolicy(
  input: UpdatePrivacyPolicyInput,
): PrivacyPolicy {
  const current = getLocalPrivacyPolicy();
  const updated: PrivacyPolicy = {
    content: input.content ?? current.content,
    published: input.published ?? current.published,
    updatedAt: new Date().toISOString(),
  };
  writeJson(DEMO_KEYS.privacyPolicy, updated);
  return updated;
}
