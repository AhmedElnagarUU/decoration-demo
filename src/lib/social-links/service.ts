import { IS_DEMO } from "@/lib/config";
import { demoSocialLinks } from "./demo";
import { productionSocialLinks } from "./production";

export const socialLinks = IS_DEMO ? demoSocialLinks : productionSocialLinks;
