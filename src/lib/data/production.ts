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
      country: doc.country,
      city: doc.city,
      timestamp: doc.timestamp.toISOString(),
    };
  },

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    await connectDB();
    const events = await AnalyticsEventModel.find();

    const pageMap = new Map<string, number>();
    const countryMap = new Map<string, { city: string; count: number }>();
    const referrerMap = new Map<string, number>();

    for (const event of events) {
      pageMap.set(event.page, (pageMap.get(event.page) ?? 0) + 1);

      const existing = countryMap.get(event.country);
      if (existing) {
        existing.count++;
      } else {
        countryMap.set(event.country, { city: event.city, count: 1 });
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
  },
};
