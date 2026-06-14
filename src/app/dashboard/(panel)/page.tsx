import { data } from "@/lib/data";
import Link from "next/link";

export default async function DashboardPage() {
  const [projects, summary] = await Promise.all([
    data.getProjects(),
    data.getAnalyticsSummary(),
  ]);

  const recent = projects.slice(0, 5);

  const stats = [
    { label: "Total Projects", value: projects.length },
    { label: "Page Views", value: summary.totalPageViews },
    { label: "Unique Visitors", value: summary.uniqueVisitors },
    { label: "Most Visited", value: summary.mostVisitedPage },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-medium sm:text-2xl">Dashboard Overview</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <Link
            href="/dashboard/projects/new"
            data-tour="tour-add-project"
            className="bg-accent px-4 py-2.5 text-center text-sm text-white sm:py-2"
          >
            Add Project
          </Link>
          <Link
            href="/dashboard/banners"
            data-tour="tour-manage-banners"
            className="border border-border px-4 py-2.5 text-center text-sm sm:py-2"
          >
            Manage Banners
          </Link>
        </div>
      </div>

      <div
        className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4"
        data-tour="tour-stats-panel"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-sm bg-card p-4 shadow-sm sm:p-6">
            <p className="text-xs text-muted sm:text-sm">{stat.label}</p>
            <p className="mt-1 truncate text-lg font-medium sm:mt-2 sm:text-2xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-sm bg-card shadow-sm" data-tour="tour-recent-projects">
        <div className="border-b border-border px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="font-medium">Recent Projects</h2>
        </div>

        {/* Mobile card list */}
        <div className="divide-y divide-border md:hidden">
          {recent.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}/edit`}
              className="block px-4 py-4 hover:bg-background"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{project.title.en}</p>
                <span
                  className={`shrink-0 px-2 py-0.5 text-[10px] uppercase ${
                    project.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{project.category}</p>
              <p className="mt-1 text-xs text-muted">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((project) => (
                <tr key={project.id} className="border-b border-border">
                  <td className="px-6 py-3">
                    <Link
                      href={`/dashboard/projects/${project.id}/edit`}
                      className="hover:text-accent"
                    >
                      {project.title.en}
                    </Link>
                  </td>
                  <td className="px-6 py-3">{project.category}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs uppercase ${
                        project.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
