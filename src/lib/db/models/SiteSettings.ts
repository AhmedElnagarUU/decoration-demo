import mongoose, { Schema, type Model } from "mongoose";
import type { PixelPlatform } from "@/lib/data/types";

export interface IPixelEntry {
  id: string;
  platform: PixelPlatform;
  label: string;
  pixelId: string;
  enabled: boolean;
  accessToken?: string;
  testEventCode?: string;
}

export interface ISocialLinkEntry {
  id: string;
  platform: string;
  label: string;
  url: string;
  enabled: boolean;
}

export interface IPrivacyPolicyEntry {
  content: { en: string; ar: string };
  published: boolean;
  updatedAt: Date;
}

export interface ISiteSettings {
  pixels: IPixelEntry[];
  socialLinks: ISocialLinkEntry[];
  privacyPolicy?: IPrivacyPolicyEntry;
  updatedAt: Date;
}

const PixelEntrySchema = new Schema<IPixelEntry>(
  {
    id: { type: String, required: true },
    platform: {
      type: String,
      required: true,
      enum: ["meta", "google_ga4", "google_ads", "tiktok", "snapchat", "gtm"],
    },
    label: { type: String, required: true },
    pixelId: { type: String, required: true },
    enabled: { type: Boolean, default: false },
    accessToken: { type: String },
    testEventCode: { type: String },
  },
  { _id: false },
);

const SocialLinkEntrySchema = new Schema<ISocialLinkEntry>(
  {
    id: { type: String, required: true },
    platform: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    enabled: { type: Boolean, default: true },
  },
  { _id: false },
);

const PrivacyPolicyEntrySchema = new Schema<IPrivacyPolicyEntry>(
  {
    content: {
      en: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    published: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    pixels: { type: [PixelEntrySchema], default: [] },
    socialLinks: { type: [SocialLinkEntrySchema], default: [] },
    privacyPolicy: { type: PrivacyPolicyEntrySchema },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

export const SiteSettingsModel: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
