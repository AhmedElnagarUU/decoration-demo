import { EditProjectPageClient } from "@/features/dashboard/projects/components/EditProjectPageClient";
import { ProjectForm } from "@/features/dashboard/projects/components/ProjectForm";
import { IS_DEMO } from "@/lib/config";
import { data } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await data.getProjectById(id);

  if (IS_DEMO) {
    return <EditProjectPageClient id={id} seedProject={project} />;
  }

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-medium">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
