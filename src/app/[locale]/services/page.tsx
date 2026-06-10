"use client";

import { motion } from "framer-motion";
import { Armchair, Home, Lamp, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";

const services = [
  {
    key: "interiorDesign",
    Icon: Home,
    description:
      "Full-service interior design for living rooms, kitchens, bedrooms, and complete villas.",
    categories: ["Living Room", "Kitchen", "Bedroom", "Full Villa"],
  },
  {
    key: "furniture",
    Icon: Armchair,
    description:
      "Curated furniture selection tailored to your space, style, and budget.",
    categories: ["Living Room", "Bedroom", "Office"],
  },
  {
    key: "lighting",
    Icon: Lamp,
    description:
      "Ambient, task, and accent lighting design to transform any room.",
    categories: ["Living Room", "Kitchen", "Office"],
  },
  {
    key: "consultation",
    Icon: Ruler,
    description:
      "Expert design consultation to guide your renovation or new build project.",
    categories: ["All Spaces"],
  },
] as const;

export default function ServicesPage() {
  const t = useTranslations("services");

  return (
    <div className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-muted">{t("subtitle")}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, i) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-sm bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <service.Icon className="h-9 w-9 text-accent" strokeWidth={1.5} />
              <h2 className="mt-4 font-serif text-2xl">{t(service.key)}</h2>
              <p className="mt-3 leading-relaxed text-muted">{service.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.categories.map((cat) => (
                  <span
                    key={cat}
                    className="bg-background px-3 py-1 text-xs uppercase tracking-wider text-muted"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
