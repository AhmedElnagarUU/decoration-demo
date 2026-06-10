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
    { label: "Top Country", value: summary.topCountry },
    { label: "Most Visited", value: summary.mostVisitedPage },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-medium">Dashboard Overview</h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/projects/new"
            className="bg-accent px-4 py-2 text-sm text-white"
          >
            Add Project
          </Link>
          <Link
            href="/dashboard/banners"
            className="border border-border px-4 py-2 text-sm"
          >
            Manage Banners
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-sm bg-card p-6 shadow-sm">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 text-2xl font-medium">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-sm bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-medium">Recent Projects</h2>
        </div>
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
  );
}
