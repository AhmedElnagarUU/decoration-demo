"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function AboutSection({ locale }: { locale: string }) {
  const t = useTranslations("about");

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-2xl uppercase tracking-wide md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-6 leading-relaxed text-muted">{t("description")}</p>

          <div className="mt-8">
            <h3 className="text-sm font-medium uppercase tracking-widest">
              {t("recentArticles")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="#" className="hover:text-accent">
                  {t("article1")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent">
                  {t("article2")}
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-md"
        >
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
            alt="Cozy interior"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
