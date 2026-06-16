"use client";

import { ProjectDetail } from "@/features/work/components/ProjectDetail";
import type { Project } from "@/lib/data/types";
import { useDemoProjectBySlug, useDemoProjects } from "@/lib/demo/hooks";
import { notFound } from "next/navigation";

export function DemoProjectPageClient({
  slug,
  seedProject,
}: {
  slug: string;
  seedProject: Project | null;
}) {
  const project = useDemoProjectBySlug(slug, seedProject);
  const allProjects = useDemoProjects([], true);

  if (!project || project.status !== "published") {
    notFound();
  }

  const related = allProjects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  return <ProjectDetail project={project} related={related} />;
}
