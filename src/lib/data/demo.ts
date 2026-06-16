import { v4 as uuidv4 } from "uuid";
import { DEMO_BANNERS, DEMO_PROJECTS } from "./demo-seed";
import type {
  Banner,
  CreateBannerInput,
  CreateInquiryInput,
  CreateProjectInput,
  Inquiry,
  InquiryStatus,
  Project,
  UpdateInquiryInput,
  UpdateProjectInput,
} from "./types";

export interface DemoStore {
  projects: Project[];
  banners: Banner[];
  inquiries: Inquiry[];
}

function getSeedStore(): DemoStore {
  return {
    projects: [...DEMO_PROJECTS],
    banners: [...DEMO_BANNERS],
    inquiries: [],
  };
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function sortInquiries(inquiries: Inquiry[]): Inquiry[] {
  return [...inquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** Demo server reads always return seed data. Mutations are no-ops on the server. */
export const demoData = {
  async getProjects(publishedOnly = false): Promise<Project[]> {
    const projects = publishedOnly
      ? getSeedStore().projects.filter((p) => p.status === "published")
      : getSeedStore().projects;
    return sortProjects(projects);
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    return getSeedStore().projects.find((p) => p.slug === slug) ?? null;
  },

  async getProjectById(id: string): Promise<Project | null> {
    return getSeedStore().projects.find((p) => p.id === id) ?? null;
  },

  async createProject(input: CreateProjectInput): Promise<Project> {
    const now = new Date().toISOString();
    return { id: uuidv4(), ...input, createdAt: now, updatedAt: now };
  },

  async updateProject(id: string, input: UpdateProjectInput): Promise<Project | null> {
    const existing = getSeedStore().projects.find((p) => p.id === id);
    if (!existing) return null;
    return {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteProject(_id: string): Promise<boolean> {
    return true;
  },

  async getBanners(): Promise<Banner[]> {
    return [...getSeedStore().banners].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async getActiveBanner(): Promise<Banner | null> {
    const now = new Date();
    return (
      getSeedStore().banners.find((b) => {
        if (!b.active) return false;
        if (b.expiresAt && new Date(b.expiresAt) < now) return false;
        return true;
      }) ?? null
    );
  },

  async createBanner(input: CreateBannerInput): Promise<Banner> {
    return {
      id: uuidv4(),
      ...input,
      createdAt: new Date().toISOString(),
    };
  },

  async updateBanner(
    id: string,
    input: Partial<CreateBannerInput>,
  ): Promise<Banner | null> {
    const existing = getSeedStore().banners.find((b) => b.id === id);
    if (!existing) return null;
    return { ...existing, ...input };
  },

  async deleteBanner(_id: string): Promise<boolean> {
    return true;
  },

  async getInquiries(): Promise<Inquiry[]> {
    return sortInquiries(getSeedStore().inquiries);
  },

  async createInquiry(input: CreateInquiryInput): Promise<Inquiry> {
    return {
      id: uuidv4(),
      ...input,
      source: input.source ?? "contact",
      status: "new" as InquiryStatus,
      createdAt: new Date().toISOString(),
    };
  },

  async updateInquiry(
    id: string,
    input: UpdateInquiryInput,
  ): Promise<Inquiry | null> {
    const existing = getSeedStore().inquiries.find((i) => i.id === id);
    if (!existing) return null;
    return { ...existing, ...input };
  },

  async deleteInquiry(_id: string): Promise<boolean> {
    return true;
  },
};
