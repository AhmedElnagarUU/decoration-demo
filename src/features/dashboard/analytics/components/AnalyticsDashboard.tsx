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
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-sm bg-card p-6 shadow-sm">
          <p className="text-sm text-muted">Total Page Views</p>
          <p className="mt-2 text-3xl font-medium">{summary.totalPageViews}</p>
        </div>
        <div className="rounded-sm bg-card p-6 shadow-sm">
          <p className="text-sm text-muted">Top Country</p>
          <p className="mt-2 text-3xl font-medium">{summary.topCountry}</p>
        </div>
        <div className="rounded-sm bg-card p-6 shadow-sm sm:col-span-2">
          <p className="text-sm text-muted">Most Visited Page</p>
          <p className="mt-2 text-xl font-medium">{summary.mostVisitedPage}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-sm bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-medium">Page Views</h2>
          {summary.pageViews.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
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

        <div className="rounded-sm bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-medium">Referrer Sources</h2>
          {summary.referrers.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
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
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-medium">Visitors by Country</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-6 py-3">Country</th>
              <th className="px-6 py-3">City</th>
              <th className="px-6 py-3">Visits</th>
            </tr>
          </thead>
          <tbody>
            {summary.countries.length > 0 ? (
              summary.countries.map((c) => (
                <tr key={`${c.country}-${c.city}`} className="border-b border-border">
                  <td className="px-6 py-3">{c.country}</td>
                  <td className="px-6 py-3">{c.city}</td>
                  <td className="px-6 py-3">{c.count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-muted">
                  No visitor data yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
