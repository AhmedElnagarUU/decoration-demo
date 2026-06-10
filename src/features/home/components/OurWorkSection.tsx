"use client";

import type { Project } from "@/lib/data/types";
import { Button } from "@/shared/components/Button";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function OurWorkSection({ projects }: { projects: Project[] }) {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="bg-card py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl">{t("ourWork")}</h2>
          <p className="mt-3 text-muted">{t("ourWorkSubtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link
                href={`/${locale}/work/${project.slug}`}
                className="group block overflow-hidden rounded-sm shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={project.coverImage}
                    alt={locale === "ar" ? project.title.ar : project.title.en}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="bg-background p-4">
                  <h3 className="font-serif text-lg">
                    {locale === "ar" ? project.title.ar : project.title.en}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {project.location} &middot; {project.year}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href={`/${locale}/work`} variant="outline">
            {t("viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}
