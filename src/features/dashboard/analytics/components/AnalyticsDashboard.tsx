"use client";

import type { AnalyticsSummary } from "@/lib/data/types";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#8b6d4d", "#a08968", "#b8a384", "#d0c4a0", "#e8dcc0"];

export function AnalyticsDashboard({ summary }: { summary: AnalyticsSummary }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
        data-tour="tour-analytics-stats"
      >
        <div className="rounded-sm bg-card p-4 shadow-sm sm:p-6">
          <p className="text-xs text-muted sm:text-sm">Total Page Views</p>
          <p className="mt-1 text-2xl font-medium sm:mt-2 sm:text-3xl">
            {summary.totalPageViews}
          </p>
        </div>
        <div className="rounded-sm bg-card p-4 shadow-sm sm:p-6">
          <p className="text-xs text-muted sm:text-sm">Unique Visitors</p>
          <p className="mt-1 text-2xl font-medium sm:mt-2 sm:text-3xl">
            {summary.uniqueVisitors}
          </p>
        </div>
        <div className="col-span-2 rounded-sm bg-card p-4 shadow-sm sm:p-6 lg:col-span-1">
          <p className="text-xs text-muted sm:text-sm">Most Visited Page</p>
          <p className="mt-1 truncate text-lg font-medium sm:mt-2 sm:text-xl">
            {summary.mostVisitedPage}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8" data-tour="tour-analytics-charts">
        <div className="rounded-sm bg-card p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 font-medium">Page Views</h2>
          {summary.pageViews.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={summary.pageViews.slice(0, 10)}>
                <XAxis dataKey="page" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b6d4d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-muted">No data yet</p>
          )}
        </div>

        <div className="rounded-sm bg-card p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 font-medium">Referrer Sources</h2>
          {summary.referrers.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={summary.referrers}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {summary.referrers.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-muted">No data yet</p>
          )}
        </div>
      </div>

      <div className="rounded-sm bg-card shadow-sm">
        <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="font-medium">Top Pages</h2>
        </div>

        <div className="divide-y divide-border md:hidden">
          {summary.pageViews.length > 0 ? (
            summary.pageViews.map((page) => (
              <div
                key={page.page}
                className="flex items-center justify-between px-4 py-3"
              >
                <p className="truncate font-medium">{page.page}</p>
                <span className="ml-3 shrink-0 text-sm font-medium">{page.count}</span>
              </div>
            ))
          ) : (
            <p className="px-4 py-8 text-center text-muted">No page view data yet</p>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-6 py-3">Page</th>
                <th className="px-6 py-3">Views</th>
              </tr>
            </thead>
            <tbody>
              {summary.pageViews.length > 0 ? (
                summary.pageViews.map((page) => (
                  <tr key={page.page} className="border-b border-border">
                    <td className="px-6 py-3">{page.page}</td>
                    <td className="px-6 py-3">{page.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-muted">
                    No page view data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
