"use client";

import { Button } from "@/shared/components/Button";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[85vh] items-center">
      <Image
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80"
        alt="Modern living room"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl font-serif text-4xl leading-tight text-white md:text-5xl lg:text-6xl"
        >
          {t("title")}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <Button href={`/${locale}/work`}>{t("cta")}</Button>
        </motion.div>
      </div>
    </section>
  );
}
