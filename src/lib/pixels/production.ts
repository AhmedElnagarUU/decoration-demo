import { connectDB } from "@/lib/db/connection";
import { SiteSettingsModel } from "@/lib/db/models/SiteSettings";
import type {
  CreatePixelInput,
  Pixel,
  PublicPixel,
  UpdatePixelInput,
} from "@/lib/data/types";
import { v4 as uuidv4 } from "uuid";

function toPixel(entry: {
  id: string;
  platform: Pixel["platform"];
  label: string;
  pixelId: string;
  enabled: boolean;
  accessToken?: string;
  testEventCode?: string;
}): Pixel {
  return {
    id: entry.id,
    platform: entry.platform,
    label: entry.label,
    pixelId: entry.pixelId,
    enabled: entry.enabled,
    accessToken: entry.accessToken,
    testEventCode: entry.testEventCode,
  };
}

function toPublicPixel(pixel: Pixel): PublicPixel {
  return {
    id: pixel.id,
    platform: pixel.platform,
    label: pixel.label,
    pixelId: pixel.pixelId,
    enabled: pixel.enabled,
  };
}

async function getOrCreateSettings() {
  await connectDB();
  let doc = await SiteSettingsModel.findOne();
  if (!doc) {
    doc = await SiteSettingsModel.create({ pixels: [], socialLinks: [] });
  }
  return doc;
}

export const productionPixels = {
  async getPixels(): Promise<Pixel[]> {
    const doc = await getOrCreateSettings();
    return doc.pixels.map(toPixel);
  },

  async getEnabledPixels(): Promise<PublicPixel[]> {
    const doc = await getOrCreateSettings();
    return doc.pixels
      .filter((entry) => entry.enabled)
      .map((entry) => toPublicPixel(toPixel(entry)));
  },

  async createPixel(input: CreatePixelInput): Promise<Pixel> {
    const doc = await getOrCreateSettings();
    const pixel = toPixel({ id: uuidv4(), ...input });
    doc.pixels.push(pixel);
    await doc.save();
    return pixel;
  },

  async updatePixel(
    id: string,
    input: UpdatePixelInput,
  ): Promise<Pixel | null> {
    const doc = await getOrCreateSettings();
    const index = doc.pixels.findIndex((entry) => entry.id === id);
    if (index === -1) return null;

    const current = doc.pixels[index];
    doc.pixels[index] = {
      id: current.id,
      platform: input.platform ?? current.platform,
      label: input.label ?? current.label,
      pixelId: input.pixelId ?? current.pixelId,
      enabled: input.enabled ?? current.enabled,
      accessToken:
        input.accessToken !== undefined
          ? input.accessToken
          : current.accessToken,
      testEventCode:
        input.testEventCode !== undefined
          ? input.testEventCode
          : current.testEventCode,
    };
    await doc.save();
    return toPixel(doc.pixels[index]);
  },

  async deletePixel(id: string): Promise<boolean> {
    const doc = await getOrCreateSettings();
    const index = doc.pixels.findIndex((entry) => entry.id === id);
    if (index === -1) return false;
    doc.pixels.splice(index, 1);
    await doc.save();
    return true;
  },
};
