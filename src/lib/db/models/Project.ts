import mongoose, { Schema, type Model } from "mongoose";
import type { ProjectCategory, ProjectStatus } from "@/lib/data/types";

export interface IProject {
  title: { en: string; ar: string };
  slug: string;
  description: { en: string; ar: string };
  category: ProjectCategory;
  location: string;
  year: number;
  area: number;
  status: ProjectStatus;
  coverImage: string;
  gallery: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    slug: { type: String, required: true, unique: true },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    category: { type: String, required: true },
    location: { type: String, required: true },
    year: { type: Number, required: true },
    area: { type: Number, required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true },
);

export const ProjectModel: Model<IProject> =
  mongoose.models.Project ??
  mongoose.model<IProject>("Project", ProjectSchema);
