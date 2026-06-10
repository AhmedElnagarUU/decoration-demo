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

  const projects = localStorage.getItem(KEYS.projects);
  const banners = localStorage.getItem(KEYS.banners);
  const analytics = localStorage.getItem(KEYS.analytics);

  return {
    projects: projects ? JSON.parse(projects) : DEMO_PROJECTS,
    banners: banners ? JSON.parse(banners) : DEMO_BANNERS,
    analytics: analytics ? JSON.parse(analytics) : [],
  };
}

function writeClientStore(store: DemoStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.projects, JSON.stringify(store.projects));
  localStorage.setItem(KEYS.banners, JSON.stringify(store.banners));
  localStorage.setItem(KEYS.analytics, JSON.stringify(store.analytics));
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

function categorizeReferrer(referrer: string): string {
  if (!referrer) return "Direct";
  const lower = referrer.toLowerCase();
  if (lower.includes("google") || lower.includes("bing")) return "Google";
  if (
    lower.includes("facebook") ||
    lower.includes("twitter") ||
    lower.includes("instagram") ||
    lower.includes("linkedin")
  )
    return "Social";
  return "Other";
}

function buildAnalyticsSummary(events: AnalyticsEvent[]): AnalyticsSummary {
  const pageMap = new Map<string, number>();
  const countryMap = new Map<string, { city: string; count: number }>();
  const referrerMap = new Map<string, number>();

  for (const event of events) {
    pageMap.set(event.page, (pageMap.get(event.page) ?? 0) + 1);

    const countryKey = event.country;
    const existing = countryMap.get(countryKey);
    if (existing) {
      existing.count++;
    } else {
      countryMap.set(countryKey, { city: event.city, count: 1 });
    }

    const source = categorizeReferrer(event.referrer);
    referrerMap.set(source, (referrerMap.get(source) ?? 0) + 1);
  }

  const pageViews = Array.from(pageMap.entries())
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count);

  const countries = Array.from(countryMap.entries())
    .map(([country, data]) => ({
      country,
      city: data.city,
      count: data.count,
    }))
    .sort((a, b) => b.count - a.count);

  const referrers = Array.from(referrerMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalPageViews: events.length,
    pageViews,
    countries,
    referrers,
    topCountry: countries[0]?.country ?? "N/A",
    mostVisitedPage: pageViews[0]?.page ?? "N/A",
  };
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
