"use client";

import { ProjectForm } from "@/features/dashboard/projects/components/ProjectForm";
import type { Project } from "@/lib/data/types";
import { useDemoProjectById } from "@/lib/demo/hooks";
import { notFound } from "next/navigation";

export function EditProjectPageClient({
  id,
  seedProject,
}: {
  id: string;
  seedProject: Project | null;
}) {
  const { data: project, ready } = useDemoProjectById(id, seedProject);

  if (!ready) {
    return (
      <div>
        <h1 className="mb-8 text-2xl font-medium">Edit Project</h1>
        <div className="h-96 max-w-2xl animate-pulse rounded bg-card" />
      </div>
    );
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
