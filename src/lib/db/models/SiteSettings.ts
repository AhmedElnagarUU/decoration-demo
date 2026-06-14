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

export interface ISiteSettings {
  pixels: IPixelEntry[];
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

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    pixels: { type: [PixelEntrySchema], default: [] },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
);

export const SiteSettingsModel: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
