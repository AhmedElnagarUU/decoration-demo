import { IS_DEMO } from "@/lib/config";
import { demoPixels } from "./demo";
import { productionPixels } from "./production";

const pixelsService = IS_DEMO ? demoPixels : productionPixels;

export const pixels = pixelsService;
