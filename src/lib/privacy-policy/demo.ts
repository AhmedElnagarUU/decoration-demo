import { DEMO_PRIVACY_POLICY } from "@/lib/privacy-policy/demo-seed";
import type {
  PrivacyPolicy,
  UpdatePrivacyPolicyInput,
} from "@/lib/data/types";

/** Demo server reads return seed data only. Client uses localStorage via local-store.ts. */
export const demoPrivacyPolicy = {
  async getPrivacyPolicy(): Promise<PrivacyPolicy> {
    return { ...DEMO_PRIVACY_POLICY };
  },

  async getPublishedPrivacyPolicy(): Promise<PrivacyPolicy | null> {
    return DEMO_PRIVACY_POLICY.published ? { ...DEMO_PRIVACY_POLICY } : null;
  },

  async updatePrivacyPolicy(input: UpdatePrivacyPolicyInput): Promise<PrivacyPolicy> {
    return {
      content: input.content ?? DEMO_PRIVACY_POLICY.content,
      published: input.published ?? DEMO_PRIVACY_POLICY.published,
      updatedAt: new Date().toISOString(),
    };
  },
};

export function getDemoPrivacyPolicySnapshot(): PrivacyPolicy {
  return { ...DEMO_PRIVACY_POLICY };
}

export function hydrateDemoPrivacyPolicy(_policy: PrivacyPolicy): void {
  // no-op: demo data is localStorage-only
}
