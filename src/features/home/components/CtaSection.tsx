"use client";

import { Button } from "@/shared/components/Button";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function CtaSection({ locale }: { locale: string }) {
  const t = useTranslations("home");

  return (
    <section className="bg-background py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <h2 className="font-serif text-3xl md:text-4xl">{t("ctaTitle")}</h2>
        <p className="mt-4 text-muted">{t("ctaSubtitle")}</p>
        <div className="mt-8">
          <Button href={`/${locale}/contact`}>{t("ctaButton")}</Button>
        </div>
      </motion.div>
    </section>
  );
}
