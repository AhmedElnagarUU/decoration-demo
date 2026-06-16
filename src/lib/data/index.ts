import { IS_DEMO } from "@/lib/config";
import { demoData } from "./demo";
import { productionData } from "./production";

const dataLayer = IS_DEMO ? demoData : productionData;

export const data = dataLayer;

export type {
  Project,
  Banner,
  Inquiry,
  InquiryStatus,
  InquirySource,
  SocialLink,
  SocialPlatform,
  Pixel,
  PublicPixel,
  PixelPlatform,
  PrivacyPolicy,
} from "./types";
