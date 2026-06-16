import { v4 as uuidv4 } from "uuid";
import type {
  CreatePixelInput,
  Pixel,
  PublicPixel,
  UpdatePixelInput,
} from "@/lib/data/types";

function toPublicPixel(pixel: Pixel): PublicPixel {
  return {
    id: pixel.id,
    platform: pixel.platform,
    label: pixel.label,
    pixelId: pixel.pixelId,
    enabled: pixel.enabled,
  };
}

/** Demo server reads return empty; client uses localStorage via local-store.ts. */
export const demoPixels = {
  async getPixels(): Promise<Pixel[]> {
    return [];
  },

  async getEnabledPixels(): Promise<PublicPixel[]> {
    return [];
  },

  async createPixel(input: CreatePixelInput): Promise<Pixel> {
    return { id: uuidv4(), ...input };
  },

  async updatePixel(id: string, input: UpdatePixelInput): Promise<Pixel | null> {
    return { id, platform: "meta", label: "", pixelId: "", enabled: false, ...input };
  },

  async deletePixel(_id: string): Promise<boolean> {
    return true;
  },
};

export function getDemoPixelsSnapshot(): Pixel[] {
  return [];
}

export function hydrateDemoPixels(_pixelList: Pixel[]): void {
  // no-op: demo data is localStorage-only
}
