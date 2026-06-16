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

export type InquiryStatus = "new" | "read" | "archived";

export type InquirySource = "contact" | "newsletter";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: InquirySource;
  status: InquiryStatus;
  createdAt: string;
}

export type SocialPlatform =
  | "instagram"
  | "pinterest"
  | "linkedin"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "x"
  | "whatsapp";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  enabled: boolean;
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

export interface CreateInquiryInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: InquirySource;
}

export interface UpdateInquiryInput {
  status?: InquiryStatus;
}

export interface CreateSocialLinkInput {
  platform: SocialPlatform;
  label: string;
  url: string;
  enabled: boolean;
}

export interface UpdateSocialLinkInput extends Partial<CreateSocialLinkInput> {}

export type PixelPlatform =
  | "meta"
  | "google_ga4"
  | "google_ads"
  | "tiktok"
  | "snapchat"
  | "gtm";

export interface Pixel {
  id: string;
  platform: PixelPlatform;
  label: string;
  pixelId: string;
  enabled: boolean;
  accessToken?: string;
  testEventCode?: string;
}

/** Pixel data safe for client-side injection (no secrets). */
export type PublicPixel = Pick<
  Pixel,
  "id" | "platform" | "label" | "pixelId" | "enabled"
>;

export interface CreatePixelInput {
  platform: PixelPlatform;
  label: string;
  pixelId: string;
  enabled: boolean;
  accessToken?: string;
  testEventCode?: string;
}

export interface UpdatePixelInput extends Partial<CreatePixelInput> {}

export interface PrivacyPolicy {
  content: LocalizedString;
  published: boolean;
  updatedAt: string;
}

export interface UpdatePrivacyPolicyInput {
  content?: LocalizedString;
  published?: boolean;
}
