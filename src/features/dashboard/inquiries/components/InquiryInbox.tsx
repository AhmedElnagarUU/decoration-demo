"use client";

import type { Inquiry, InquirySource, InquiryStatus } from "@/lib/data/types";
import { IS_DEMO } from "@/lib/config";
import { useDemoInquiries } from "@/lib/demo/hooks";
import {
  deleteLocalInquiry,
  updateLocalInquiry,
} from "@/lib/demo/local-store";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statusStyles: Record<InquiryStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-yellow-100 text-yellow-700",
  archived: "bg-gray-100 text-gray-600",
};

const sourceStyles: Record<InquirySource, string> = {
  contact: "bg-purple-100 text-purple-700",
  newsletter: "bg-green-100 text-green-700",
};

const sourceLabels: Record<InquirySource, string> = {
  contact: "Contact",
  newsletter: "Newsletter",
};

export function InquiryInbox({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const router = useRouter();
  const normalizedSeed = initialInquiries.map((inquiry) => ({
    ...inquiry,
    source: inquiry.source ?? "contact",
  }));
  const demoInquiries = useDemoInquiries(normalizedSeed);
  const [prodInquiries, setProdInquiries] = useState(normalizedSeed);
  const inquiries = IS_DEMO ? demoInquiries : prodInquiries;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<InquirySource | "all">("all");

  const filtered = inquiries.filter((inquiry) => {
    if (statusFilter !== "all" && inquiry.status !== statusFilter) return false;
    if (sourceFilter !== "all" && inquiry.source !== sourceFilter) return false;
    return true;
  });

  async function updateStatus(id: string, status: InquiryStatus) {
    if (IS_DEMO) {
      updateLocalInquiry(id, { status });
      return;
    }

    await fetch(`/api/inquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setProdInquiries((prev) =>
      prev.map((inquiry) => (inquiry.id === id ? { ...inquiry, status } : inquiry)),
    );
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      if (IS_DEMO) {
        deleteLocalInquiry(deleteId);
      } else {
        await fetch(`/api/inquiries/${deleteId}`, { method: "DELETE" });
        router.refresh();
        setProdInquiries((prev) => prev.filter((i) => i.id !== deleteId));
      }
      setDeleteId(null);
      if (expandedId === deleteId) setExpandedId(null);
    } finally {
      setDeleting(false);
    }
  }

  const filterBtn = <T extends string>(
    value: T,
    current: T,
    label: string,
    onSelect: (value: T) => void,
  ) => (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`px-3 py-1.5 text-xs sm:text-sm ${
        current === value
          ? "bg-accent text-white"
          : "border border-border text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div
        className="mb-3 flex flex-wrap gap-2 sm:mb-4"
        data-tour="tour-inquiries-filters"
      >
        {filterBtn("all", statusFilter, "All", setStatusFilter)}
        {filterBtn("new", statusFilter, "New", setStatusFilter)}
        {filterBtn("read", statusFilter, "Read", setStatusFilter)}
        {filterBtn("archived", statusFilter, "Archived", setStatusFilter)}
      </div>

      <div className="mb-4 flex flex-wrap gap-2 sm:mb-6">
        {filterBtn("all", sourceFilter, "All sources", setSourceFilter)}
        {filterBtn("contact", sourceFilter, "Contact", setSourceFilter)}
        {filterBtn("newsletter", sourceFilter, "Newsletter", setSourceFilter)}
      </div>

      {filtered.length === 0 ? (
        <div
          className="rounded-sm bg-card p-8 text-center text-sm text-muted shadow-sm"
          data-tour="tour-inquiries-list"
        >
          No inquiries yet. Contact form submissions and newsletter signups will appear here.
        </div>
      ) : (
        <div className="space-y-3" data-tour="tour-inquiries-list">
          {filtered.map((inquiry) => {
            const expanded = expandedId === inquiry.id;
            return (
              <div key={inquiry.id} className="rounded-sm bg-card shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setExpandedId(expanded ? null : inquiry.id);
                    if (!expanded && inquiry.status === "new") {
                      void updateStatus(inquiry.id, "read");
                    }
                  }}
                  className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{inquiry.name}</p>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase ${sourceStyles[inquiry.source]}`}
                      >
                        {sourceLabels[inquiry.source]}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase ${statusStyles[inquiry.status]}`}
                      >
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-muted">{inquiry.email}</p>
                    <p className="mt-1 line-clamp-1 text-sm">{inquiry.message}</p>
                  </div>
                  <p className="shrink-0 text-xs text-muted">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </button>

                {expanded && (
                  <div className="border-t border-border px-4 py-4 sm:px-6">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted">Source</p>
                        <p className="mt-1">{sourceLabels[inquiry.source]}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted">Email</p>
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-accent hover:underline"
                        >
                          {inquiry.email}
                        </a>
                      </div>
                      {inquiry.phone && (
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted">Phone</p>
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="text-accent hover:underline"
                          >
                            {inquiry.phone}
                          </a>
                        </div>
                      )}
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted">Message</p>
                        <p className="mt-1 whitespace-pre-wrap">{inquiry.message}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {inquiry.status !== "read" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(inquiry.id, "read")}
                          className="border border-border px-3 py-1.5 text-xs sm:text-sm"
                        >
                          Mark read
                        </button>
                      )}
                      {inquiry.status !== "archived" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(inquiry.id, "archived")}
                          className="border border-border px-3 py-1.5 text-xs sm:text-sm"
                        >
                          Archive
                        </button>
                      )}
                      {inquiry.status === "archived" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(inquiry.id, "new")}
                          className="border border-border px-3 py-1.5 text-xs sm:text-sm"
                        >
                          Restore
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteId(inquiry.id)}
                        className="px-3 py-1.5 text-xs text-red-600 hover:underline sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete inquiry"
        message="This inquiry will be permanently removed."
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
