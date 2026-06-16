import { connectDB } from "@/lib/db/connection";
import { SiteSettingsModel } from "@/lib/db/models/SiteSettings";
import type {
  LocalizedString,
  PrivacyPolicy,
  UpdatePrivacyPolicyInput,
} from "@/lib/data/types";
import { DEMO_PRIVACY_POLICY } from "@/lib/privacy-policy/demo-seed";

function toPrivacyPolicy(entry: {
  content: LocalizedString;
  published: boolean;
  updatedAt: Date;
}): PrivacyPolicy {
  return {
    content: entry.content,
    published: entry.published,
    updatedAt: entry.updatedAt.toISOString(),
  };
}

function defaultPolicy(): PrivacyPolicy {
  return { ...DEMO_PRIVACY_POLICY };
}

async function getOrCreateSettings() {
  await connectDB();
  let doc = await SiteSettingsModel.findOne();
  if (!doc) {
    doc = await SiteSettingsModel.create({
      pixels: [],
      socialLinks: [],
      privacyPolicy: {
        content: DEMO_PRIVACY_POLICY.content,
        published: false,
        updatedAt: new Date(),
      },
    });
  }
  return doc;
}

export const productionPrivacyPolicy = {
  async getPrivacyPolicy(): Promise<PrivacyPolicy> {
    const doc = await getOrCreateSettings();
    if (!doc.privacyPolicy) {
      return defaultPolicy();
    }
    return toPrivacyPolicy(doc.privacyPolicy);
  },

  async getPublishedPrivacyPolicy(): Promise<PrivacyPolicy | null> {
    const policy = await this.getPrivacyPolicy();
    return policy.published ? policy : null;
  },

  async updatePrivacyPolicy(
    input: UpdatePrivacyPolicyInput,
  ): Promise<PrivacyPolicy> {
    const doc = await getOrCreateSettings();
    const current = doc.privacyPolicy
      ? toPrivacyPolicy(doc.privacyPolicy)
      : defaultPolicy();

    doc.privacyPolicy = {
      content: input.content ?? current.content,
      published: input.published ?? current.published,
      updatedAt: new Date(),
    };
    await doc.save();
    return toPrivacyPolicy(doc.privacyPolicy);
  },
};
