import { PrivacyPolicyManager } from "@/features/dashboard/privacy/components/PrivacyPolicyManager";
import { privacyPolicy } from "@/lib/privacy-policy/service";

export const dynamic = "force-dynamic";

export default async function PrivacyPolicyPage() {
  const policy = await privacyPolicy.getPrivacyPolicy();

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium sm:mb-8 sm:text-2xl">
        Privacy Policy
      </h1>
      <p className="mb-6 text-sm text-muted">
        Edit the bilingual privacy policy shown on your public site. Use blank
        lines between sections for readable paragraphs.
      </p>
      <PrivacyPolicyManager initialPolicy={policy} />
    </div>
  );
}
