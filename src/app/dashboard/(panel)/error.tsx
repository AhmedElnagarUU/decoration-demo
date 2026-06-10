"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-xl font-medium">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 bg-accent px-6 py-2 text-sm text-white"
      >
        Try again
      </button>
    </div>
  );
}
