import { AnalyticsDashboard } from "@/features/dashboard/analytics/components/AnalyticsDashboard";
import { data } from "@/lib/data";

export default async function AnalyticsPage() {
  const summary = await data.getAnalyticsSummary();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-medium">Analytics</h1>
      <AnalyticsDashboard summary={summary} />
    </div>
  );
}
