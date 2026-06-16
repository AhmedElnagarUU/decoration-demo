"use client";

import type { Banner } from "@/lib/data/types";
import { IS_DEMO } from "@/lib/config";
import { useDemoBanners } from "@/lib/demo/hooks";
import {
  createLocalBanner,
  deleteLocalBanner,
  updateLocalBanner,
} from "@/lib/demo/local-store";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BannerManager({ initialBanners }: { initialBanners: Banner[] }) {
  const router = useRouter();
  const demoBanners = useDemoBanners(initialBanners);
  const [prodBanners, setProdBanners] = useState(initialBanners);
  const banners = IS_DEMO ? demoBanners : prodBanners;
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [messageEn, setMessageEn] = useState("");
  const [messageAr, setMessageAr] = useState("");
  const [link, setLink] = useState("");
  const [active, setActive] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      message: { en: messageEn, ar: messageAr },
      link: link || undefined,
      active,
      expiresAt: expiresAt || undefined,
    };

    if (IS_DEMO) {
      createLocalBanner(payload);
      setShowForm(false);
      setMessageEn("");
      setMessageAr("");
      setLink("");
      setActive(false);
      setExpiresAt("");
      return;
    }

    const res = await fetch("/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      setMessageEn("");
      setMessageAr("");
      setLink("");
      setActive(false);
      setExpiresAt("");
      router.refresh();
      const data = await fetch("/api/banners").then((r) => r.json());
      setProdBanners(data.banners);
    }
  }

  async function toggleActive(id: string, currentActive: boolean) {
    if (IS_DEMO) {
      updateLocalBanner(id, { active: !currentActive });
      return;
    }

    await fetch(`/api/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentActive }),
    });
    router.refresh();
    const data = await fetch("/api/banners").then((r) => r.json());
    setProdBanners(data.banners);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      if (IS_DEMO) {
        deleteLocalBanner(deleteId);
      } else {
        await fetch(`/api/banners/${deleteId}`, { method: "DELETE" });
        router.refresh();
        setProdBanners((prev) => prev.filter((b) => b.id !== deleteId));
      }
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  const inputClass =
    "w-full border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none";

  return (
    <div>
      <div className="mb-4 flex justify-stretch sm:mb-6 sm:justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          data-tour="tour-add-banner"
          className="w-full bg-accent px-4 py-2.5 text-sm text-white sm:w-auto sm:py-2"
        >
          {showForm ? "Cancel" : "Add Banner"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-4 rounded-sm bg-card p-4 shadow-sm sm:mb-8 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Message (EN)</label>
              <input
                value={messageEn}
                onChange={(e) => setMessageEn(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Message (AR)</label>
              <input
                value={messageAr}
                onChange={(e) => setMessageAr(e.target.value)}
                required
                dir="rtl"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Link (optional)</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} className={inputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                id="active"
              />
              <label htmlFor="active" className="text-sm">
                Set as active banner
              </label>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Expiry Date</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <button type="submit" className="bg-accent px-6 py-2 text-sm text-white">
            Create Banner
          </button>
        </form>
      )}

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden" data-tour="tour-banners-list">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="rounded-sm border border-border bg-card p-4 shadow-sm"
          >
            <p className="font-medium">{banner.message.en}</p>
            {banner.link && (
              <p className="mt-1 truncate text-sm text-muted">{banner.link}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => toggleActive(banner.id, banner.active)}
                className={`px-2 py-0.5 text-[10px] uppercase ${
                  banner.active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {banner.active ? "Active" : "Inactive"}
              </button>
              {banner.expiresAt && (
                <span className="text-xs text-muted">
                  Expires {new Date(banner.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <button
              onClick={() => setDeleteId(banner.id)}
              className="mt-3 text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div
        className="hidden overflow-hidden rounded-sm bg-card shadow-sm md:block"
        data-tour="tour-banners-list"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Link</th>
              <th className="px-6 py-3">Active</th>
              <th className="px-6 py-3">Expires</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="border-b border-border">
                <td className="px-6 py-3">{banner.message.en}</td>
                <td className="px-6 py-3 text-muted">{banner.link ?? "—"}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => toggleActive(banner.id, banner.active)}
                    className={`inline-block px-2 py-0.5 text-xs uppercase ${
                      banner.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {banner.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-3 text-muted">
                  {banner.expiresAt
                    ? new Date(banner.expiresAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => setDeleteId(banner.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete banner?"
        message="This banner will be permanently removed. You can create a new one at any time."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
