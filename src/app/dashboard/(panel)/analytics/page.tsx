import { AnalyticsDashboard } from "@/features/dashboard/analytics/components/AnalyticsDashboard";
import { data } from "@/lib/data";

export default async function AnalyticsPage() {
  const summary = await data.getAnalyticsSummary();

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium sm:mb-8 sm:text-2xl">Analytics</h1>
      <AnalyticsDashboard summary={summary} />
    </div>
  );
}
