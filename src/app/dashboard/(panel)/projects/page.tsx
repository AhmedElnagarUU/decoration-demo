import { data } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { DeleteProjectButton } from "@/features/dashboard/projects/components/DeleteProjectButton";

export default async function ProjectsPage() {
  const projects = await data.getProjects();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-medium">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="bg-accent px-4 py-2 text-sm text-white"
        >
          Add New Project
        </Link>
      </div>

      <div className="overflow-hidden rounded-sm bg-card shadow-sm">
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
                    <Image
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
  );
}
