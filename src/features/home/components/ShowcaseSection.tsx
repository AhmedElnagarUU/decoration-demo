"use client";

import { Button } from "@/shared/components/Button";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const swatches = [
  {
    name: "Charcoal Gray",
    color: "#4a4a4a",
    image:
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=400&q=80",
  },
  {
    name: "Wheat",
    color: "#d4b896",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  },
  {
    name: "Misty Blue",
    color: "#a8b8c8",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80",
  },
];

export function ShowcaseSection({ locale }: { locale: string }) {
  const t = useTranslations("showcase");

  return (
    <section className="bg-card py-20 lg:py-24">
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
            <Button href={`/${locale}/work`}>{t("cta")}</Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {swatches.map((swatch, i) => (
            <motion.div
              key={swatch.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="overflow-hidden rounded-sm shadow-sm"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={swatch.image}
                  alt={swatch.name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="bg-background p-3">
                <p className="text-sm font-medium">{swatch.name}</p>
                <div className="mt-1 flex gap-0.5 text-accent">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-accent" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
