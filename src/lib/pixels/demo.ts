import { v4 as uuidv4 } from "uuid";
import type {
  CreatePixelInput,
  Pixel,
  PublicPixel,
  UpdatePixelInput,
} from "@/lib/data/types";

declare global {
  // eslint-disable-next-line no-var
  var demoPixelStore: Pixel[] | undefined;
}

function getStore(): Pixel[] {
  if (!global.demoPixelStore) {
    global.demoPixelStore = [];
  }
  return global.demoPixelStore;
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

export const demoPixels = {
  async getPixels(): Promise<Pixel[]> {
    return [...getStore()];
  },

  async getEnabledPixels(): Promise<PublicPixel[]> {
    return getStore()
      .filter((pixel) => pixel.enabled)
      .map(toPublicPixel);
  },

  async createPixel(input: CreatePixelInput): Promise<Pixel> {
    const pixel: Pixel = {
      id: uuidv4(),
      ...input,
    };
    getStore().push(pixel);
    return pixel;
  },

  async updatePixel(
    id: string,
    input: UpdatePixelInput,
  ): Promise<Pixel | null> {
    const store = getStore();
    const index = store.findIndex((pixel) => pixel.id === id);
    if (index === -1) return null;
    store[index] = { ...store[index], ...input };
    return store[index];
  },

  async deletePixel(id: string): Promise<boolean> {
    const store = getStore();
    const index = store.findIndex((pixel) => pixel.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  },
};
