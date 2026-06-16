import { SocialLinksManager } from "@/features/dashboard/social/components/SocialLinksManager";
import { socialLinks } from "@/lib/social-links/service";

export const dynamic = "force-dynamic";

export default async function SocialLinksPage() {
  const links = await socialLinks.getSocialLinks();

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium sm:mb-8 sm:text-2xl">Social Links</h1>
      <p className="mb-6 text-sm text-muted">
        Manage the social links shown in your site footer — one place for all platforms.
      </p>
      <SocialLinksManager initialLinks={links} />
    </div>
  );
}
