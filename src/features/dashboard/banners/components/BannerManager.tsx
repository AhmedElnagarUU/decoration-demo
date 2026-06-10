"use client";

import type { Banner } from "@/lib/data/types";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BannerManager({ initialBanners }: { initialBanners: Banner[] }) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
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
    const res = await fetch("/api/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: { en: messageEn, ar: messageAr },
        link: link || undefined,
        active,
        expiresAt: expiresAt || undefined,
      }),
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
      setBanners(data.banners);
    }
  }

  async function toggleActive(id: string, currentActive: boolean) {
    await fetch(`/api/banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentActive }),
    });
    router.refresh();
    const data = await fetch("/api/banners").then((r) => r.json());
    setBanners(data.banners);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/banners/${deleteId}`, { method: "DELETE" });
      router.refresh();
      setBanners((prev) => prev.filter((b) => b.id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  const inputClass =
    "w-full border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none";

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent px-4 py-2 text-sm text-white"
        >
          {showForm ? "Cancel" : "Add Banner"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 space-y-4 rounded-sm bg-card p-6 shadow-sm">
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

      <div className="overflow-hidden rounded-sm bg-card shadow-sm">
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
