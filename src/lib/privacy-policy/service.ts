import { IS_DEMO } from "@/lib/config";
import { demoPrivacyPolicy } from "./demo";
import { productionPrivacyPolicy } from "./production";

export const privacyPolicy = IS_DEMO
  ? demoPrivacyPolicy
  : productionPrivacyPolicy;
