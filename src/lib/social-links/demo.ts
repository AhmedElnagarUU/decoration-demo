import { DEMO_SOCIAL_LINKS } from "@/lib/social-links/demo-seed";
import { v4 as uuidv4 } from "uuid";
import type {
  CreateSocialLinkInput,
  SocialLink,
  UpdateSocialLinkInput,
} from "@/lib/data/types";

/** Demo server reads return seed data only. Client uses localStorage via local-store.ts. */
export const demoSocialLinks = {
  async getSocialLinks(): Promise<SocialLink[]> {
    return [...DEMO_SOCIAL_LINKS];
  },

  async getEnabledSocialLinks(): Promise<SocialLink[]> {
    return DEMO_SOCIAL_LINKS.filter((link) => link.enabled);
  },

  async createSocialLink(input: CreateSocialLinkInput): Promise<SocialLink> {
    return { id: uuidv4(), ...input };
  },

  async updateSocialLink(
    id: string,
    input: UpdateSocialLinkInput,
  ): Promise<SocialLink | null> {
    const existing = DEMO_SOCIAL_LINKS.find((link) => link.id === id);
    if (!existing) return null;
    return { ...existing, ...input };
  },

  async deleteSocialLink(_id: string): Promise<boolean> {
    return true;
  },
};

export function getDemoSocialLinksSnapshot(): SocialLink[] {
  return [...DEMO_SOCIAL_LINKS];
}

export function hydrateDemoSocialLinks(_links: SocialLink[]): void {
  // no-op: demo data is localStorage-only
}
