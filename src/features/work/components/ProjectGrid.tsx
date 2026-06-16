"use client";

import type { Project } from "@/lib/data/types";
import { IS_DEMO } from "@/lib/config";
import { useDemoProjects } from "@/lib/demo/hooks";
import { ProjectCoverImage } from "@/shared/components/ProjectCoverImage";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "All",
  "Living Room",
  "Kitchen",
  "Bedroom",
  "Office",
  "Full Villa",
  "Other",
] as const;

export function ProjectGrid({ projects: seedProjects }: { projects: Project[] }) {
  const t = useTranslations("work");
  const locale = useLocale();
  const demoProjects = useDemoProjects(seedProjects, true);
  const projects = IS_DEMO ? demoProjects : seedProjects;
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  const paginated = filtered.slice(0, page * perPage);
  const hasMore = paginated.length < filtered.length;

  return (
    <div>
      <div className="mb-10 flex flex-wrap gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm transition-colors ${
              activeCategory === cat
                ? "bg-accent text-white"
                : "bg-card text-muted hover:text-foreground"
            }`}
          >
            {cat === "All" ? t("filterAll") : cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link
              href={`/${locale}/work/${project.slug}`}
              className="group relative block overflow-hidden rounded-sm shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <ProjectCoverImage
                  src={project.coverImage}
                  alt={locale === "ar" ? project.title.ar : project.title.en}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                  <span className="text-sm font-medium tracking-widest text-white opacity-0 uppercase transition-opacity group-hover:opacity-100">
                    {t("viewProject")}
                  </span>
                </div>
              </div>
              <div className="bg-card p-4">
                <h3 className="font-serif text-lg">
                  {locale === "ar" ? project.title.ar : project.title.en}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                  <span>{project.location}</span>
                  <span>&middot;</span>
                  <span>{project.year}</span>
                </div>
                <span className="mt-2 inline-block text-xs uppercase tracking-wider text-accent">
                  {project.category}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="border border-foreground px-8 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-foreground hover:text-white"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
