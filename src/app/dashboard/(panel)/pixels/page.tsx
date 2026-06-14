import { PixelManager } from "@/features/dashboard/pixels/components/PixelManager";
import { pixels } from "@/lib/pixels/service";

export default async function PixelsPage() {
  const pixelList = await pixels.getPixels();

  return (
    <div>
      <h1 className="mb-2 text-xl font-medium sm:text-2xl">Pixels & Tracking</h1>
      <p className="mb-6 text-sm text-muted sm:mb-8">
        Manage tracking pixels and conversion APIs for your storefront.
      </p>
      <PixelManager initialPixels={pixelList} />
    </div>
  );
}
