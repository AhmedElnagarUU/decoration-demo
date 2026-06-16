"use client";

import { Button } from "@/shared/components/Button";
import { IS_DEMO } from "@/lib/config";
import { createLocalInquiry } from "@/lib/demo/local-store";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function ContactForm() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (IS_DEMO) {
        createLocalInquiry({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? "") || undefined,
          message: String(formData.get("message") ?? ""),
          source: "contact",
        });
        setSubmitted(true);
        form.reset();
        return;
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        form.reset();
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-sm bg-card p-8 text-center shadow-sm">
        <p className="text-lg text-accent">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full border border-border bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-border bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium">
          {t("phone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full border border-border bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border border-border bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "..." : t("submit")}
      </Button>
    </form>
  );
}
