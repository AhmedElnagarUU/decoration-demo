export type ProjectStatus = "draft" | "published";

export type ProjectCategory =
  | "Living Room"
  | "Kitchen"
  | "Bedroom"
  | "Office"
  | "Full Villa"
  | "Other";

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Project {
  id: string;
  title: LocalizedString;
  slug: string;
  description: LocalizedString;
  category: ProjectCategory;
  location: string;
  year: number;
  area: number;
  status: ProjectStatus;
  coverImage: string;
  gallery: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  message: LocalizedString;
  link?: string;
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  page: string;
  referrer: string;
  visitorId: string;
  timestamp: string;
}

export interface CreateProjectInput {
  title: LocalizedString;
  slug: string;
  description: LocalizedString;
  category: ProjectCategory;
  location: string;
  year: number;
  area: number;
  status: ProjectStatus;
  coverImage: string;
  gallery: string[];
  tags: string[];
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface CreateBannerInput {
  message: LocalizedString;
  link?: string;
  active: boolean;
  expiresAt?: string;
}

export interface TrackAnalyticsInput {
  page: string;
  referrer: string;
  visitorId: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  pageViews: { page: string; count: number }[];
  referrers: { source: string; count: number }[];
  mostVisitedPage: string;
}
