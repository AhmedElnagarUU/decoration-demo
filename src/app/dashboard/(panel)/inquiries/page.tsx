import { InquiryInbox } from "@/features/dashboard/inquiries/components/InquiryInbox";
import { data } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const inquiries = await data.getInquiries();

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium sm:mb-8 sm:text-2xl">Inquiries</h1>
      <p className="mb-6 text-sm text-muted">
        Contact form messages and homepage newsletter signups in one inbox.
      </p>
      <InquiryInbox initialInquiries={inquiries} />
    </div>
  );
}
