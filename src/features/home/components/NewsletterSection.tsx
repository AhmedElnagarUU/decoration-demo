"use client";

import { Button } from "@/shared/components/Button";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function NewsletterSection() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        const data = (await res.json()) as { error?: string | { message: string }[] };
        if (typeof data.error === "string") {
          setError(data.error);
        } else if (Array.isArray(data.error)) {
          setError(data.error.map((issue) => issue.message).join(", "));
        } else {
          setError(t("newsletterError"));
        }
      }
    } catch {
      setError(t("newsletterError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-card py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <h2 className="font-serif text-3xl md:text-4xl">{t("newsletterTitle")}</h2>
        <p className="mt-4 text-muted">{t("newsletterSubtitle")}</p>

        {submitted ? (
          <p className="mt-8 text-sm text-accent">{t("newsletterSuccess")}</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletterPlaceholder")}
              required
              className="min-w-0 flex-1 border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            <Button type="submit" disabled={loading}>
              {loading ? t("newsletterSubmitting") : t("newsletterButton")}
            </Button>
          </form>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </motion.div>
    </section>
  );
}
