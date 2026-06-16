"use client";

import type { PrivacyPolicy } from "@/lib/data/types";
import { useDemoPublishedPrivacyPolicy } from "@/lib/demo/hooks";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";

function renderParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function DemoPrivacyPageClient({
  locale,
  seedPolicy,
}: {
  locale: string;
  seedPolicy: PrivacyPolicy | null;
}) {
  const t = useTranslations("privacyPage");
  const policy = useDemoPublishedPrivacyPolicy(seedPolicy);

  if (!policy) {
    notFound();
  }

  const content = locale === "ar" ? policy.content.ar : policy.content.en;
  const paragraphs = renderParagraphs(content);

  return (
    <div className="bg-background">
      <section className="bg-card py-20 text-center lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-sm text-muted">
            {t("lastUpdated")}:{" "}
            {new Date(policy.updatedAt).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-US",
              { year: "numeric", month: "long", day: "numeric" },
            )}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="space-y-6 text-muted leading-relaxed">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
