import { DEMO_SOCIAL_LINKS } from "@/lib/social-links/demo-seed";
import { v4 as uuidv4 } from "uuid";
import type {
  CreateSocialLinkInput,
  SocialLink,
  UpdateSocialLinkInput,
} from "@/lib/data/types";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/lib/local-storage";

const STORAGE_KEY = "dc_social_links";

declare global {
  // eslint-disable-next-line no-var
  var demoSocialLinkStore: SocialLink[] | undefined;
}

function getServerStore(): SocialLink[] {
  if (!global.demoSocialLinkStore) {
    global.demoSocialLinkStore = [...DEMO_SOCIAL_LINKS];
  }
  return global.demoSocialLinkStore;
}

function readClientStore(): SocialLink[] {
  if (typeof window === "undefined") return getServerStore();

  const stored = getLocalStorageItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEMO_SOCIAL_LINKS;
}

function writeClientStore(links: SocialLink[]): void {
  if (typeof window === "undefined") return;
  setLocalStorageItem(STORAGE_KEY, JSON.stringify(links));
}

function getStore(): SocialLink[] {
  if (typeof window !== "undefined") return readClientStore();
  return getServerStore();
}

function persistStore(links: SocialLink[]): void {
  if (typeof window !== "undefined") {
    writeClientStore(links);
  } else {
    global.demoSocialLinkStore = links;
  }
}

export function getDemoSocialLinksSnapshot(): SocialLink[] {
  return [...getServerStore()];
}

export function hydrateDemoSocialLinks(links: SocialLink[]): void {
  global.demoSocialLinkStore = links;
}

export const demoSocialLinks = {
  async getSocialLinks(): Promise<SocialLink[]> {
    return [...getStore()];
  },

  async getEnabledSocialLinks(): Promise<SocialLink[]> {
    return getStore().filter((link) => link.enabled);
  },

  async createSocialLink(input: CreateSocialLinkInput): Promise<SocialLink> {
    const store = getStore();
    const link: SocialLink = { id: uuidv4(), ...input };
    store.push(link);
    persistStore(store);
    return link;
  },

  async updateSocialLink(
    id: string,
    input: UpdateSocialLinkInput,
  ): Promise<SocialLink | null> {
    const store = getStore();
    const index = store.findIndex((link) => link.id === id);
    if (index === -1) return null;
    store[index] = { ...store[index], ...input };
    persistStore(store);
    return store[index];
  },

  async deleteSocialLink(id: string): Promise<boolean> {
    const store = getStore();
    const index = store.findIndex((link) => link.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    persistStore(store);
    return true;
  },
};
