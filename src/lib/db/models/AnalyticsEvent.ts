import mongoose, { Schema, type Model } from "mongoose";

export interface IAnalyticsEvent {
  page: string;
  referrer: string;
  visitorId: string;
  timestamp: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  page: { type: String, required: true },
  referrer: { type: String, default: "" },
  visitorId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
});

export const AnalyticsEventModel: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ??
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);
