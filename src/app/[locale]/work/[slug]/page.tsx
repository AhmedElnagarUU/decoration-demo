import { ProjectDetail } from "@/features/work/components/ProjectDetail";
import { data } from "@/lib/data";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await data.getProjectBySlug(slug);
  if (!project || project.status !== "published") {
    notFound();
  }

  const allProjects = await data.getProjects(true);
  const related = allProjects
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  return <ProjectDetail project={project} related={related} />;
}
