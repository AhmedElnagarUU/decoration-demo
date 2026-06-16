"use client";

import { IS_DEMO } from "@/lib/config";
import { syncDemoStoreFromServer } from "@/lib/data/demo-client-sync";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (IS_DEMO) {
        await syncDemoStoreFromServer();
      }
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className="text-red-500 hover:underline disabled:opacity-50"
      >
        Delete
      </button>

      <ConfirmDialog
        open={open}
        title="Delete project?"
        message="This will permanently remove the project and its images. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
