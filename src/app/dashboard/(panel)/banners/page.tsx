import { BannerManager } from "@/features/dashboard/banners/components/BannerManager";
import { data } from "@/lib/data";

export default async function BannersPage() {
  const banners = await data.getBanners();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-medium">Banners</h1>
      <BannerManager initialBanners={banners} />
    </div>
  );
}
