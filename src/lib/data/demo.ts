import { buildAnalyticsSummary } from "@/lib/analytics/summary";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/lib/local-storage";
import { v4 as uuidv4 } from "uuid";
import { DEMO_BANNERS, DEMO_PROJECTS } from "./demo-seed";
import type {
  AnalyticsEvent,
  AnalyticsSummary,
  Banner,
  CreateBannerInput,
  CreateProjectInput,
  Project,
  TrackAnalyticsInput,
  UpdateProjectInput,
} from "./types";

const KEYS = {
  projects: "dc_projects",
  banners: "dc_banners",
  analytics: "dc_analytics",
} as const;

interface DemoStore {
  projects: Project[];
  banners: Banner[];
  analytics: AnalyticsEvent[];
}

declare global {
  // eslint-disable-next-line no-var
  var demoStore: DemoStore | undefined;
}

function getServerStore(): DemoStore {
  if (!global.demoStore) {
    global.demoStore = {
      projects: [...DEMO_PROJECTS],
      banners: [...DEMO_BANNERS],
      analytics: [],
    };
  }
  return global.demoStore;
}

function readClientStore(): DemoStore {
  if (typeof window === "undefined") return getServerStore();

  const projects = getLocalStorageItem(KEYS.projects);
  const banners = getLocalStorageItem(KEYS.banners);
  const analytics = getLocalStorageItem(KEYS.analytics);

  return {
    projects: projects ? JSON.parse(projects) : DEMO_PROJECTS,
    banners: banners ? JSON.parse(banners) : DEMO_BANNERS,
    analytics: analytics ? JSON.parse(analytics) : [],
  };
}

function writeClientStore(store: DemoStore): void {
  if (typeof window === "undefined") return;
  setLocalStorageItem(KEYS.projects, JSON.stringify(store.projects));
  setLocalStorageItem(KEYS.banners, JSON.stringify(store.banners));
  setLocalStorageItem(KEYS.analytics, JSON.stringify(store.analytics));
}

function getStore(): DemoStore {
  if (typeof window !== "undefined") return readClientStore();
  return getServerStore();
}

function persistStore(store: DemoStore): void {
  if (typeof window !== "undefined") {
    writeClientStore(store);
  } else {
    global.demoStore = store;
  }
}

export const demoData = {
  async getProjects(publishedOnly = false): Promise<Project[]> {
    const store = getStore();
    const projects = publishedOnly
      ? store.projects.filter((p) => p.status === "published")
      : store.projects;
    return projects.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const store = getStore();
    return store.projects.find((p) => p.slug === slug) ?? null;
  },

  async getProjectById(id: string): Promise<Project | null> {
    const store = getStore();
    return store.projects.find((p) => p.id === id) ?? null;
  },

  async createProject(input: CreateProjectInput): Promise<Project> {
    const store = getStore();
    const now = new Date().toISOString();
    const project: Project = { id: uuidv4(), ...input, createdAt: now, updatedAt: now };
    store.projects.push(project);
    persistStore(store);
    return project;
  },

  async updateProject(id: string, input: UpdateProjectInput): Promise<Project | null> {
    const store = getStore();
    const index = store.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    store.projects[index] = {
      ...store.projects[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    persistStore(store);
    return store.projects[index];
  },

  async deleteProject(id: string): Promise<boolean> {
    const store = getStore();
    const index = store.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    store.projects.splice(index, 1);
    persistStore(store);
    return true;
  },

  async getBanners(): Promise<Banner[]> {
    return getStore().banners.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async getActiveBanner(): Promise<Banner | null> {
    const store = getStore();
    const now = new Date();
    return (
      store.banners.find((b) => {
        if (!b.active) return false;
        if (b.expiresAt && new Date(b.expiresAt) < now) return false;
        return true;
      }) ?? null
    );
  },

  async createBanner(input: CreateBannerInput): Promise<Banner> {
    const store = getStore();
    if (input.active) {
      store.banners.forEach((b) => (b.active = false));
    }
    const banner: Banner = {
      id: uuidv4(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    store.banners.push(banner);
    persistStore(store);
    return banner;
  },

  async updateBanner(
    id: string,
    input: Partial<CreateBannerInput>,
  ): Promise<Banner | null> {
    const store = getStore();
    const index = store.banners.findIndex((b) => b.id === id);
    if (index === -1) return null;
    if (input.active) {
      store.banners.forEach((b) => (b.active = false));
    }
    store.banners[index] = { ...store.banners[index], ...input };
    persistStore(store);
    return store.banners[index];
  },

  async deleteBanner(id: string): Promise<boolean> {
    const store = getStore();
    const index = store.banners.findIndex((b) => b.id === id);
    if (index === -1) return false;
    store.banners.splice(index, 1);
    persistStore(store);
    return true;
  },

  async trackAnalytics(input: TrackAnalyticsInput): Promise<AnalyticsEvent> {
    const store = getStore();
    const event: AnalyticsEvent = { id: uuidv4(), ...input };
    store.analytics.push(event);
    persistStore(store);
    return event;
  },

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return buildAnalyticsSummary(getStore().analytics);
  },
};
