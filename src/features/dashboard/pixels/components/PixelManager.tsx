"use client";

import type { Pixel, PixelPlatform } from "@/lib/data/types";
import { IS_DEMO } from "@/lib/config";
import { syncDemoStoreFromServer } from "@/lib/data/demo-client-sync";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLATFORMS: { value: PixelPlatform; label: string }[] = [
  { value: "meta", label: "Meta Pixel" },
  { value: "google_ga4", label: "Google GA4" },
  { value: "google_ads", label: "Google Ads" },
  { value: "tiktok", label: "TikTok Pixel" },
  { value: "snapchat", label: "Snapchat Pixel" },
  { value: "gtm", label: "Google Tag Manager" },
];

const PLATFORM_LABELS: Record<PixelPlatform, string> = {
  meta: "Meta Pixel",
  google_ga4: "Google GA4",
  google_ads: "Google Ads",
  tiktok: "TikTok Pixel",
  snapchat: "Snapchat Pixel",
  gtm: "Google Tag Manager",
};

function platformIdLabel(platform: PixelPlatform): string {
  if (platform === "gtm") return "Container ID";
  if (platform === "google_ga4") return "Measurement ID";
  if (platform === "google_ads") return "Conversion ID";
  return "Pixel ID";
}

export function PixelManager({ initialPixels }: { initialPixels: Pixel[] }) {
  const router = useRouter();
  const [pixelList, setPixelList] = useState(initialPixels);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [platform, setPlatform] = useState<PixelPlatform>("meta");
  const [label, setLabel] = useState("");
  const [pixelId, setPixelId] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [testEventCode, setTestEventCode] = useState("");

  async function refreshPixels() {
    const data = await fetch("/api/pixels").then((r) => r.json());
    setPixelList(data.pixels);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/pixels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        label,
        pixelId,
        enabled,
        accessToken: accessToken || undefined,
        testEventCode: testEventCode || undefined,
      }),
    });

    if (res.ok) {
      setShowForm(false);
      setPlatform("meta");
      setLabel("");
      setPixelId("");
      setEnabled(true);
      setAccessToken("");
      setTestEventCode("");
      if (IS_DEMO) await syncDemoStoreFromServer();
      router.refresh();
      await refreshPixels();
    }
  }

  async function toggleEnabled(id: string, currentEnabled: boolean) {
    await fetch(`/api/pixels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !currentEnabled }),
    });
    if (IS_DEMO) await syncDemoStoreFromServer();
    router.refresh();
    await refreshPixels();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/pixels/${deleteId}`, { method: "DELETE" });
      if (IS_DEMO) await syncDemoStoreFromServer();
      router.refresh();
      setPixelList((prev) => prev.filter((pixel) => pixel.id !== deleteId));
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
          data-tour="tour-add-pixel"
          className="w-full bg-accent px-4 py-2.5 text-sm text-white sm:w-auto sm:py-2"
        >
          {showForm ? "Cancel" : "Add Pixel"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 space-y-4 rounded-sm bg-card p-4 shadow-sm sm:mb-8 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as PixelPlatform)}
                className={inputClass}
              >
                {PLATFORMS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Label</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                placeholder="e.g. Main store pixel"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              {platformIdLabel(platform)}
            </label>
            <input
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          {platform === "meta" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Access Token (optional, for Conversion API)
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Test Event Code (optional)
                </label>
                <input
                  value={testEventCode}
                  onChange={(e) => setTestEventCode(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              id="pixel-enabled"
            />
            <label htmlFor="pixel-enabled" className="text-sm">
              Enable pixel
            </label>
          </div>
          <button type="submit" className="bg-accent px-6 py-2 text-sm text-white">
            Create Pixel
          </button>
        </form>
      )}

      {pixelList.length === 0 ? (
        <p className="text-sm text-muted" data-tour="tour-pixels-list">
          No tracking pixels configured yet. Add one to get started.
        </p>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden" data-tour="tour-pixels-list">
            {pixelList.map((pixel) => (
              <div
                key={pixel.id}
                className="rounded-sm border border-border bg-card p-4 shadow-sm"
              >
                <p className="font-medium">{pixel.label}</p>
                <p className="mt-1 text-sm text-muted">
                  {PLATFORM_LABELS[pixel.platform]}
                </p>
                <p className="mt-1 truncate text-xs text-muted">{pixel.pixelId}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => toggleEnabled(pixel.id, pixel.enabled)}
                    className={`px-2 py-0.5 text-[10px] uppercase ${
                      pixel.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {pixel.enabled ? "Enabled" : "Disabled"}
                  </button>
                  {pixel.accessToken && (
                    <span className="text-xs text-muted">CAPI configured</span>
                  )}
                </div>
                <button
                  onClick={() => setDeleteId(pixel.id)}
                  className="mt-3 text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-sm bg-card shadow-sm md:block" data-tour="tour-pixels-list">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="px-6 py-3">Label</th>
                  <th className="px-6 py-3">Platform</th>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pixelList.map((pixel) => (
                  <tr key={pixel.id} className="border-b border-border">
                    <td className="px-6 py-3">{pixel.label}</td>
                    <td className="px-6 py-3 text-muted">
                      {PLATFORM_LABELS[pixel.platform]}
                    </td>
                    <td className="px-6 py-3 font-mono text-xs">{pixel.pixelId}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => toggleEnabled(pixel.id, pixel.enabled)}
                        className={`inline-block px-2 py-0.5 text-xs uppercase ${
                          pixel.enabled
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {pixel.enabled ? "Enabled" : "Disabled"}
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setDeleteId(pixel.id)}
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
        </>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete pixel?"
        message="This tracking pixel will be permanently removed from your site configuration."
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
