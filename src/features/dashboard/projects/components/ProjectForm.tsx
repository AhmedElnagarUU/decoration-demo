"use client";

import { IS_DEMO } from "@/lib/config";
import { syncDemoStoreFromServer } from "@/lib/data/demo-client-sync";
import type { Project } from "@/lib/data/types";
import { formatApiError } from "@/lib/utils/api-error";
import { generateSlug } from "@/lib/utils/slug";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  "Living Room",
  "Kitchen",
  "Bedroom",
  "Office",
  "Full Villa",
  "Other",
] as const;

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [titleEn, setTitleEn] = useState(project?.title.en ?? "");
  const [titleAr, setTitleAr] = useState(project?.title.ar ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [descriptionEn, setDescriptionEn] = useState(project?.description.en ?? "");
  const [descriptionAr, setDescriptionAr] = useState(project?.description.ar ?? "");
  const [category, setCategory] = useState(project?.category ?? "Living Room");
  const [location, setLocation] = useState(project?.location ?? "");
  const [year, setYear] = useState(project?.year ?? new Date().getFullYear());
  const [area, setArea] = useState(project?.area ?? 0);
  const [status, setStatus] = useState<"draft" | "published">(
    project?.status ?? "draft",
  );
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [gallery, setGallery] = useState<string[]>(project?.gallery ?? []);
  const [tags, setTags] = useState(project?.tags.join(", ") ?? "");
  const [uploadWarning, setUploadWarning] = useState("");

  function handleTitleChange(value: string) {
    setTitleEn(value);
    if (!project) {
      setSlug(generateSlug(value));
    }
  }

  function getUploadWarnings(file: File): string[] {
    const warnings: string[] = [];
    const isWebp =
      file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp");

    if (!isWebp) {
      warnings.push(
        "This image is not WebP. Convert it to WebP before uploading for smaller file sizes and faster page loads.",
      );
    }

    if (IS_DEMO && file.size > 2 * 1024 * 1024) {
      warnings.push(
        "This image exceeds 2MB and may slow down demo mode storage.",
      );
    }

    return warnings;
  }

  async function uploadImage(file: File, currentSlug: string): Promise<string> {
    const warnings = getUploadWarnings(file);
    setUploadWarning(warnings.join(" "));

    if (IS_DEMO) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        slug: currentSlug,
      }),
    });

    const { uploadUrl, publicUrl } = await res.json();
    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    return publicUrl;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file, slug);
    setCoverImage(url);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file, slug);
      urls.push(url);
    }
    setGallery((prev) => [...prev, ...urls]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title: { en: titleEn, ar: titleAr },
      slug,
      description: { en: descriptionEn, ar: descriptionAr },
      category,
      location,
      year: Number(year),
      area: Number(area),
      status,
      coverImage,
      gallery,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const url = project ? `/api/projects/${project.id}` : "/api/projects";
      const method = project ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(formatApiError(data.error));
      }

      if (IS_DEMO) {
        await syncDemoStoreFromServer();
      }

      router.push("/dashboard/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-border px-4 py-2.5 text-sm focus:border-accent focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6"
      data-tour="tour-project-form"
    >
      {error && (
        <div className="rounded bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      {uploadWarning && (
        <div className="rounded bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {uploadWarning}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Title (EN)</label>
          <input
            value={titleEn}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Title (AR)</label>
          <input
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            required
            dir="rtl"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description (EN)</label>
        <textarea
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description (AR)</label>
        <textarea
          value={descriptionAr}
          onChange={(e) => setDescriptionAr(e.target.value)}
          rows={4}
          dir="rtl"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Area (m&sup2;)</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Tags (comma-separated)</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClass}
          placeholder="modern, minimalist"
        />
      </div>

      <div className="space-y-4 rounded border border-amber-200/80 bg-amber-50/40 px-4 py-4">
        <p className="text-xs text-amber-900">
          <span className="font-medium">Tip:</span> Convert photos to{" "}
          <strong>WebP</strong> before uploading. WebP keeps similar quality while
          reducing file size, which helps pages load faster.
        </p>

        <div>
          <label className="mb-1 block text-sm font-medium">Cover Image</label>
          <input
            type="file"
            accept="image/*,image/webp"
            onChange={handleCoverUpload}
          />
          {coverImage && (
            <img src={coverImage} alt="Cover" className="mt-2 h-32 object-cover" />
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Gallery Images</label>
          <input
            type="file"
            accept="image/*,image/webp"
            multiple
            onChange={handleGalleryUpload}
          />
          {IS_DEMO && (
            <p className="mt-1 text-xs text-muted">
              Demo mode: images stored as base64 in localStorage. Max 2MB recommended.
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {gallery.map((img, i) => (
              <img key={i} src={img} alt={`Gallery ${i}`} className="h-20 w-20 object-cover" />
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !coverImage}
        className="bg-accent px-8 py-3 text-sm font-medium tracking-wide text-white uppercase disabled:opacity-50"
      >
        {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}
