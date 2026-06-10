"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    key: "livingRoom" as const,
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    href: "Living Room",
  },
  {
    key: "lighting" as const,
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80",
    href: "Lighting",
  },
  {
    key: "workspace" as const,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    href: "Office",
  },
];

export function CategoryCards({ locale }: { locale: string }) {
  const t = useTranslations("categories");

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3 lg:px-8">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={`/${locale}/work?category=${encodeURIComponent(cat.href)}`}
              className="group block overflow-hidden rounded-sm bg-card shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={t(`${cat.key}.title`)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="relative p-6">
                <h3 className="font-serif text-xl">{t(`${cat.key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {t(`${cat.key}.description`)}
                </p>
                <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-muted transition-transform group-hover:translate-x-1 rtl:left-6 rtl:right-auto rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
