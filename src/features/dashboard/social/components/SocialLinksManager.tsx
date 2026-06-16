"use client";

import type { SocialLink, SocialPlatform } from "@/lib/data/types";
import { IS_DEMO } from "@/lib/config";
import { useDemoAllSocialLinks } from "@/lib/demo/hooks";
import {
  createLocalSocialLink,
  deleteLocalSocialLink,
  updateLocalSocialLink,
} from "@/lib/demo/local-store";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "pinterest", label: "Pinterest" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X (Twitter)" },
  { value: "whatsapp", label: "WhatsApp" },
];

function emptyForm() {
  return {
    platform: "instagram" as SocialPlatform,
    label: "",
    url: "",
    enabled: true,
  };
}

export function SocialLinksManager({
  initialLinks,
}: {
  initialLinks: SocialLink[];
}) {
  const router = useRouter();
  const demoLinks = useDemoAllSocialLinks(initialLinks);
  const [prodLinks, setProdLinks] = useState(initialLinks);
  const links = IS_DEMO ? demoLinks : prodLinks;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [enabled, setEnabled] = useState(true);

  const inputClass =
    "w-full border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none";

  const isEditing = editingId !== null;

  function resetForm() {
    const defaults = emptyForm();
    setPlatform(defaults.platform);
    setLabel(defaults.label);
    setUrl(defaults.url);
    setEnabled(defaults.enabled);
    setEditingId(null);
    setShowForm(false);
  }

  function startCreate() {
    resetForm();
    setShowForm(true);
  }

  function startEdit(link: SocialLink) {
    setEditingId(link.id);
    setPlatform(link.platform);
    setLabel(link.label);
    setUrl(link.url);
    setEnabled(link.enabled);
    setShowForm(true);
  }

  async function refreshLinks() {
    router.refresh();
    const data = await fetch("/api/social-links").then((r) => r.json());
    setProdLinks(data.socialLinks);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = { platform, label, url, enabled };

    if (IS_DEMO) {
      if (isEditing) {
        updateLocalSocialLink(editingId!, payload);
      } else {
        createLocalSocialLink(payload);
      }
      resetForm();
      return;
    }

    const res = isEditing
      ? await fetch(`/api/social-links/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/social-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (res.ok) {
      resetForm();
      await refreshLinks();
    }
  }

  async function toggleEnabled(id: string, currentEnabled: boolean) {
    if (IS_DEMO) {
      updateLocalSocialLink(id, { enabled: !currentEnabled });
      return;
    }

    await fetch(`/api/social-links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !currentEnabled }),
    });
    await refreshLinks();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      if (IS_DEMO) {
        deleteLocalSocialLink(deleteId);
      } else {
        await fetch(`/api/social-links/${deleteId}`, { method: "DELETE" });
        await refreshLinks();
        setProdLinks((prev) => prev.filter((link) => link.id !== deleteId));
      }
      if (editingId === deleteId) resetForm();
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-stretch sm:mb-6 sm:justify-end">
        <button
          type="button"
          onClick={() => (showForm && !isEditing ? resetForm() : startCreate())}
          data-tour="tour-add-social-link"
          className="w-full bg-accent px-4 py-2.5 text-sm text-white sm:w-auto sm:py-2"
        >
          {showForm && !isEditing ? "Cancel" : "Add Social Link"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-4 rounded-sm bg-card p-4 shadow-sm sm:p-6"
        >
          <h2 className="font-medium">
            {isEditing ? "Edit Social Link" : "New Social Link"}
          </h2>
          <div>
            <label className="mb-1 block text-sm text-muted">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
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
            <label className="mb-1 block text-sm text-muted">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Instagram"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-muted">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://instagram.com/yourpage"
              required
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Show on site
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="bg-accent px-4 py-2.5 text-sm text-white sm:py-2"
            >
              {isEditing ? "Save Changes" : "Save Link"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-border px-4 py-2.5 text-sm sm:py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {links.length === 0 ? (
        <div
          className="rounded-sm bg-card p-8 text-center text-sm text-muted shadow-sm"
          data-tour="tour-social-links-list"
        >
          No social links yet. Add links to display them in the site footer.
        </div>
      ) : (
        <div className="space-y-3" data-tour="tour-social-links-list">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex flex-col gap-3 rounded-sm bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{link.label}</p>
                  <span className="text-xs uppercase text-muted">{link.platform}</span>
                  {!link.enabled && (
                    <span className="bg-gray-100 px-2 py-0.5 text-[10px] uppercase text-gray-600">
                      Hidden
                    </span>
                  )}
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block truncate text-sm text-accent hover:underline"
                >
                  {link.url}
                </a>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(link)}
                  className="border border-border px-3 py-1.5 text-xs sm:text-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => toggleEnabled(link.id, link.enabled)}
                  className="border border-border px-3 py-1.5 text-xs sm:text-sm"
                >
                  {link.enabled ? "Hide" : "Show"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(link.id)}
                  className="px-3 py-1.5 text-xs text-red-600 hover:underline sm:text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete social link"
        message="This link will be removed from the site footer."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
