"use client";

import type { PrivacyPolicy } from "@/lib/data/types";
import { IS_DEMO } from "@/lib/config";
import { updateLocalPrivacyPolicy } from "@/lib/demo/local-store";
import { routing } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PrivacyPolicyManager({
  initialPolicy,
}: {
  initialPolicy: PrivacyPolicy;
}) {
  const router = useRouter();
  const [contentEn, setContentEn] = useState(initialPolicy.content.en);
  const [contentAr, setContentAr] = useState(initialPolicy.content.ar);
  const [published, setPublished] = useState(initialPolicy.published);
  const [updatedAt, setUpdatedAt] = useState(initialPolicy.updatedAt);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const inputClass =
    "w-full border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (IS_DEMO) {
        const updated = updateLocalPrivacyPolicy({
          content: { en: contentEn, ar: contentAr },
          published,
        });
        setUpdatedAt(updated.updatedAt);
        setMessage("Privacy policy saved.");
        return;
      }

      const res = await fetch("/api/privacy-policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { en: contentEn, ar: contentAr },
          published,
        }),
      });

      if (!res.ok) {
        setMessage("Failed to save. Please try again.");
        return;
      }

      const data = (await res.json()) as { privacyPolicy: PrivacyPolicy };
      setUpdatedAt(data.privacyPolicy.updatedAt);
      setMessage("Privacy policy saved.");
      router.refresh();
    } catch {
      setMessage("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Last updated: {new Date(updatedAt).toLocaleString()}
        </p>
        <a
          href={`/${routing.defaultLocale}/privacy`}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-border px-4 py-2.5 text-center text-sm hover:border-accent sm:py-2"
        >
          Preview page
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-sm bg-card p-4 shadow-sm sm:p-6"
      >
        <div>
          <label className="mb-1 block text-sm text-muted">
            Content (English)
          </label>
          <textarea
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
            rows={14}
            required
            className={inputClass}
            placeholder="Write your privacy policy in English..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">
            Content (Arabic)
          </label>
          <textarea
            value={contentAr}
            onChange={(e) => setContentAr(e.target.value)}
            rows={14}
            required
            dir="rtl"
            className={inputClass}
            placeholder="اكتب سياسة الخصوصية بالعربية..."
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Publish on site (shows in footer and privacy page)
        </label>

        {message && (
          <p
            className={`text-sm ${
              message.includes("saved") ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-accent px-4 py-2.5 text-sm text-white disabled:opacity-60 sm:py-2"
        >
          {saving ? "Saving..." : "Save Policy"}
        </button>
      </form>
    </div>
  );
}
