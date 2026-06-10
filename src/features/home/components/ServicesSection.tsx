"use client";

import { motion } from "framer-motion";
import { Armchair, Home, Lamp, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";

const services = [
  { key: "interiorDesign" as const, Icon: Home },
  { key: "furniture" as const, Icon: Armchair },
  { key: "lighting" as const, Icon: Lamp },
  { key: "consultation" as const, Icon: Ruler },
];

export function ServicesSection() {
  const t = useTranslations("services");
  const home = useTranslations("home");

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl">{home("services")}</h2>
          <p className="mt-3 text-muted">{home("servicesSubtitle")}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-sm bg-card p-8 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <service.Icon className="mx-auto h-8 w-8 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 font-serif text-lg">{t(service.key)}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
