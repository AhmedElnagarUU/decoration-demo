import { data } from "@/lib/data";
import { DeleteProjectButton } from "@/features/dashboard/projects/components/DeleteProjectButton";
import { ProjectCoverImage } from "@/shared/components/ProjectCoverImage";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await data.getProjects();

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-medium sm:text-2xl">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          data-tour="tour-add-project"
          className="bg-accent px-4 py-2.5 text-center text-sm text-white sm:py-2"
        >
          Add New Project
        </Link>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden" data-tour="tour-projects-list">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-sm border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex gap-3">
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded">
                <ProjectCoverImage
                  src={project.coverImage}
                  alt={project.title.en}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{project.title.en}</p>
                <p className="text-sm text-muted">{project.category}</p>
                <span
                  className={`mt-1 inline-block px-2 py-0.5 text-[10px] uppercase ${
                    project.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-xs text-muted">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <div className="flex gap-3">
                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="text-sm text-accent hover:underline"
                >
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div
        className="hidden overflow-hidden rounded-sm bg-card shadow-sm md:block"
        data-tour="tour-projects-list"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-6 py-3">Cover</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border">
                  <td className="px-6 py-3">
                    <div className="relative h-10 w-14 overflow-hidden rounded">
                      <ProjectCoverImage
                        src={project.coverImage}
                        alt={project.title.en}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3 font-medium">{project.title.en}</td>
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
                  <td className="px-6 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/projects/${project.id}/edit`}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProjectButton id={project.id} />
                    </div>
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
