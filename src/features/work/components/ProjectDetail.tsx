"use client";

import type { Project } from "@/lib/data/types";
import { ImageLightbox } from "@/shared/components/ImageLightbox";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function ProjectDetail({
  project,
  related,
}: {
  project: Project;
  related: Project[];
}) {
  const t = useTranslations("work");
  const locale = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const title = locale === "ar" ? project.title.ar : project.title.en;
  const description =
    locale === "ar" ? project.description.ar : project.description.en;

  return (
    <article>
      <div className="relative h-[50vh] md:h-[60vh]">
        <Image
          src={project.coverImage}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-4xl md:text-5xl">{title}</h1>

          <div className="mt-6 grid gap-4 text-sm text-muted sm:grid-cols-2 md:grid-cols-4">
            <div>
              <span className="block text-xs uppercase tracking-widest text-foreground">
                {t("location")}
              </span>
              {project.location}
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-foreground">
                {t("year")}
              </span>
              {project.year}
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-foreground">
                {t("area")}
              </span>
              {project.area} m&sup2;
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-foreground">
                {t("category")}
              </span>
              {project.category}
            </div>
          </div>

          <p className="mt-8 leading-relaxed text-muted">{description}</p>
        </motion.div>

        {project.gallery.length > 0 && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((img, i) => (
              <button
                key={img}
                onClick={() => setLightboxIndex(i)}
                className="relative aspect-[4/3] overflow-hidden rounded-sm"
              >
                <Image
                  src={img}
                  alt={`${title} ${i + 1}`}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="bg-card py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-8 font-serif text-2xl">{t("relatedProjects")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/work/${p.slug}`}
                  className="group overflow-hidden rounded-sm shadow-sm"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={p.coverImage}
                      alt={locale === "ar" ? p.title.ar : p.title.en}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="33vw"
                    />
                  </div>
                  <div className="bg-background p-4">
                    <h3 className="font-serif">
                      {locale === "ar" ? p.title.ar : p.title.en}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          images={project.gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </article>
  );
}
