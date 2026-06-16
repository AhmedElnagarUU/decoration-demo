import { DEMO_PRIVACY_POLICY } from "@/lib/privacy-policy/demo-seed";
import type {
  PrivacyPolicy,
  UpdatePrivacyPolicyInput,
} from "@/lib/data/types";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/lib/local-storage";

const STORAGE_KEY = "dc_privacy_policy";

declare global {
  // eslint-disable-next-line no-var
  var demoPrivacyPolicyStore: PrivacyPolicy | undefined;
}

function getServerStore(): PrivacyPolicy {
  if (!global.demoPrivacyPolicyStore) {
    global.demoPrivacyPolicyStore = { ...DEMO_PRIVACY_POLICY };
  }
  return global.demoPrivacyPolicyStore;
}

function readClientStore(): PrivacyPolicy {
  if (typeof window === "undefined") return getServerStore();

  const stored = getLocalStorageItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : { ...DEMO_PRIVACY_POLICY };
}

function writeClientStore(policy: PrivacyPolicy): void {
  if (typeof window === "undefined") return;
  setLocalStorageItem(STORAGE_KEY, JSON.stringify(policy));
}

function getStore(): PrivacyPolicy {
  if (typeof window !== "undefined") return readClientStore();
  return getServerStore();
}

function persistStore(policy: PrivacyPolicy): void {
  if (typeof window !== "undefined") {
    writeClientStore(policy);
  } else {
    global.demoPrivacyPolicyStore = policy;
  }
}

export function getDemoPrivacyPolicySnapshot(): PrivacyPolicy {
  return { ...getServerStore() };
}

export function hydrateDemoPrivacyPolicy(policy: PrivacyPolicy): void {
  global.demoPrivacyPolicyStore = policy;
}

export const demoPrivacyPolicy = {
  async getPrivacyPolicy(): Promise<PrivacyPolicy> {
    return { ...getStore() };
  },

  async getPublishedPrivacyPolicy(): Promise<PrivacyPolicy | null> {
    const policy = getStore();
    return policy.published ? { ...policy } : null;
  },

  async updatePrivacyPolicy(
    input: UpdatePrivacyPolicyInput,
  ): Promise<PrivacyPolicy> {
    const current = getStore();
    const updated: PrivacyPolicy = {
      content: input.content ?? current.content,
      published: input.published ?? current.published,
      updatedAt: new Date().toISOString(),
    };
    persistStore(updated);
    return updated;
  },
};
