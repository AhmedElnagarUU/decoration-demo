import mongoose, { Schema, type Model } from "mongoose";

export interface IBanner {
  message: { en: string; ar: string };
  link?: string;
  active: boolean;
  expiresAt?: Date;
  createdAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    message: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    link: { type: String },
    active: { type: Boolean, default: false },
    expiresAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const BannerModel: Model<IBanner> =
  mongoose.models.Banner ?? mongoose.model<IBanner>("Banner", BannerSchema);
