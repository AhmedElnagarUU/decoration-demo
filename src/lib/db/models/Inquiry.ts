import mongoose, { Schema, type Model } from "mongoose";

export interface IInquiry {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: "contact" | "newsletter";
  status: "new" | "read" | "archived";
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    source: {
      type: String,
      enum: ["contact", "newsletter"],
      default: "contact",
    },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const InquiryModel: Model<IInquiry> =
  mongoose.models.Inquiry ?? mongoose.model<IInquiry>("Inquiry", InquirySchema);
