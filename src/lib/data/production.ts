import { buildAnalyticsSummary } from "@/lib/analytics/summary";
import { connectDB } from "@/lib/db/connection";
import { AnalyticsEventModel } from "@/lib/db/models/AnalyticsEvent";
import { BannerModel } from "@/lib/db/models/Banner";
import { ProjectModel } from "@/lib/db/models/Project";
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

function toProject(doc: {
  _id: { toString(): string };
  title: { en: string; ar: string };
  slug: string;
  description: { en: string; ar: string };
  category: string;
  location: string;
  year: number;
  area: number;
  status: "draft" | "published";
  coverImage: string;
  gallery: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}): Project {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    category: doc.category as Project["category"],
    location: doc.location,
    year: doc.year,
    area: doc.area,
    status: doc.status,
    coverImage: doc.coverImage,
    gallery: doc.gallery,
    tags: doc.tags,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function toBanner(doc: {
  _id: { toString(): string };
  message: { en: string; ar: string };
  link?: string;
  active: boolean;
  expiresAt?: Date;
  createdAt: Date;
}): Banner {
  return {
    id: doc._id.toString(),
    message: doc.message,
    link: doc.link,
    active: doc.active,
    expiresAt: doc.expiresAt?.toISOString(),
    createdAt: doc.createdAt.toISOString(),
  };
}

export const productionData = {
  async getProjects(publishedOnly = false): Promise<Project[]> {
    await connectDB();
    const docs = publishedOnly
      ? await ProjectModel.find({ status: "published" as const }).sort({ createdAt: -1 })
      : await ProjectModel.find().sort({ createdAt: -1 });
    return docs.map(toProject);
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    await connectDB();
    const doc = await ProjectModel.findOne({ slug });
    return doc ? toProject(doc) : null;
  },

  async getProjectById(id: string): Promise<Project | null> {
    await connectDB();
    const doc = await ProjectModel.findById(id);
    return doc ? toProject(doc) : null;
  },

  async createProject(input: CreateProjectInput): Promise<Project> {
    await connectDB();
    const doc = await ProjectModel.create(input);
    return toProject(doc);
  },

  async updateProject(
    id: string,
    input: UpdateProjectInput,
  ): Promise<Project | null> {
    await connectDB();
    const doc = await ProjectModel.findByIdAndUpdate(id, input, { new: true });
    return doc ? toProject(doc) : null;
  },

  async deleteProject(id: string): Promise<boolean> {
    await connectDB();
    const result = await ProjectModel.findByIdAndDelete(id);
    return !!result;
  },

  async getBanners(): Promise<Banner[]> {
    await connectDB();
    const docs = await BannerModel.find().sort({ createdAt: -1 });
    return docs.map(toBanner);
  },

  async getActiveBanner(): Promise<Banner | null> {
    await connectDB();
    const now = new Date();
    const doc = await BannerModel.findOne({
      active: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: now } }],
    });
    return doc ? toBanner(doc) : null;
  },

  async createBanner(input: CreateBannerInput): Promise<Banner> {
    await connectDB();
    if (input.active) {
      await BannerModel.updateMany({}, { active: false });
    }
    const doc = await BannerModel.create(input);
    return toBanner(doc);
  },

  async updateBanner(
    id: string,
    input: Partial<CreateBannerInput>,
  ): Promise<Banner | null> {
    await connectDB();
    if (input.active) {
      await BannerModel.updateMany({}, { active: false });
    }
    const doc = await BannerModel.findByIdAndUpdate(id, input, { new: true });
    return doc ? toBanner(doc) : null;
  },

  async deleteBanner(id: string): Promise<boolean> {
    await connectDB();
    const result = await BannerModel.findByIdAndDelete(id);
    return !!result;
  },

  async trackAnalytics(input: TrackAnalyticsInput): Promise<AnalyticsEvent> {
    await connectDB();
    const doc = await AnalyticsEventModel.create({
      ...input,
      timestamp: new Date(input.timestamp),
    });
    return {
      id: doc._id.toString(),
      page: doc.page,
      referrer: doc.referrer,
      visitorId: doc.visitorId,
      timestamp: doc.timestamp.toISOString(),
    };
  },

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    await connectDB();
    const events = await AnalyticsEventModel.find();
    return buildAnalyticsSummary(
      events.map((doc) => ({
        id: doc._id.toString(),
        page: doc.page,
        referrer: doc.referrer,
        visitorId: doc.visitorId ?? doc._id.toString(),
        timestamp: doc.timestamp.toISOString(),
      })),
    );
  },
};
