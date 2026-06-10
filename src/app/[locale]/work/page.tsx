import { ProjectGrid } from "@/features/work/components/ProjectGrid";
import { data } from "@/lib/data";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");

  const projects = await data.getProjects(true);

  return (
    <div className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-muted">{t("subtitle")}</p>
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse bg-card" />}>
          <ProjectGrid projects={projects} />
        </Suspense>
      </div>
    </div>
  );
}
