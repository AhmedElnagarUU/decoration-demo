import type { AnalyticsEvent, AnalyticsSummary } from "@/lib/data/types";

function categorizeReferrer(referrer: string): string {
  if (!referrer) return "Direct";
  const lower = referrer.toLowerCase();
  if (lower.includes("google") || lower.includes("bing")) return "Google";
  if (
    lower.includes("facebook") ||
    lower.includes("twitter") ||
    lower.includes("instagram") ||
    lower.includes("linkedin")
  ) {
    return "Social";
  }
  return "Other";
}

export function buildAnalyticsSummary(events: AnalyticsEvent[]): AnalyticsSummary {
  const pageMap = new Map<string, number>();
  const referrerMap = new Map<string, number>();
  const visitorIds = new Set<string>();

  for (const event of events) {
    pageMap.set(event.page, (pageMap.get(event.page) ?? 0) + 1);
    visitorIds.add(event.visitorId || event.id);

    const source = categorizeReferrer(event.referrer);
    referrerMap.set(source, (referrerMap.get(source) ?? 0) + 1);
  }

  const pageViews = Array.from(pageMap.entries())
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count);

  const referrers = Array.from(referrerMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalPageViews: events.length,
    uniqueVisitors: visitorIds.size,
    pageViews,
    referrers,
    mostVisitedPage: pageViews[0]?.page ?? "N/A",
  };
}
