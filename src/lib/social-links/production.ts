import { connectDB } from "@/lib/db/connection";
import { SiteSettingsModel } from "@/lib/db/models/SiteSettings";
import type {
  CreateSocialLinkInput,
  SocialLink,
  SocialPlatform,
  UpdateSocialLinkInput,
} from "@/lib/data/types";
import { v4 as uuidv4 } from "uuid";

function toSocialLink(entry: {
  id: string;
  platform: string;
  label: string;
  url: string;
  enabled: boolean;
}): SocialLink {
  return {
    id: entry.id,
    platform: entry.platform as SocialPlatform,
    label: entry.label,
    url: entry.url,
    enabled: entry.enabled,
  };
}

async function getOrCreateSettings() {
  await connectDB();
  let doc = await SiteSettingsModel.findOne();
  if (!doc) {
    doc = await SiteSettingsModel.create({ pixels: [], socialLinks: [] });
  }
  return doc;
}

export const productionSocialLinks = {
  async getSocialLinks(): Promise<SocialLink[]> {
    const doc = await getOrCreateSettings();
    return doc.socialLinks.map(toSocialLink);
  },

  async getEnabledSocialLinks(): Promise<SocialLink[]> {
    const doc = await getOrCreateSettings();
    return doc.socialLinks
      .filter((entry) => entry.enabled)
      .map((entry) => toSocialLink(entry));
  },

  async createSocialLink(input: CreateSocialLinkInput): Promise<SocialLink> {
    const doc = await getOrCreateSettings();
    const link = toSocialLink({ id: uuidv4(), ...input });
    doc.socialLinks.push(link);
    await doc.save();
    return link;
  },

  async updateSocialLink(
    id: string,
    input: UpdateSocialLinkInput,
  ): Promise<SocialLink | null> {
    const doc = await getOrCreateSettings();
    const index = doc.socialLinks.findIndex((entry) => entry.id === id);
    if (index === -1) return null;

    const current = doc.socialLinks[index];
    doc.socialLinks[index] = {
      id: current.id,
      platform: input.platform ?? current.platform,
      label: input.label ?? current.label,
      url: input.url ?? current.url,
      enabled: input.enabled ?? current.enabled,
    };
    await doc.save();
    return toSocialLink(doc.socialLinks[index]);
  },

  async deleteSocialLink(id: string): Promise<boolean> {
    const doc = await getOrCreateSettings();
    const index = doc.socialLinks.findIndex((entry) => entry.id === id);
    if (index === -1) return false;
    doc.socialLinks.splice(index, 1);
    await doc.save();
    return true;
  },
};
