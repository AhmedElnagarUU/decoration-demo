"use client";

import { Button } from "@/shared/components/Button";
import { cn } from "@/lib/utils/cn";
import { MessageSquare, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface FeedbackContextValue {
  openFeedback: () => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider");
  }
  return context;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const openFeedback = useCallback(() => {
    setSubmitted(false);
    setError("");
    setOpen(true);
  }, []);

  function handleClose() {
    setOpen(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, page: pathname }),
      });

      if (!res.ok) {
        setError("Could not send feedback. Please try again.");
        return;
      }

      setSubmitted(true);
      setMessage("");
    } catch {
      setError("Could not send feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FeedbackContext.Provider value={{ openFeedback }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-label="Close feedback"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="relative w-full max-w-md rounded-sm bg-card p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="py-4 text-center">
                <p className="font-serif text-xl">Thank you!</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Your feedback has been sent. We appreciate you taking the time to
                  help us improve.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 bg-accent px-5 py-2.5 text-sm text-white transition-colors hover:bg-accent-hover"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 id="feedback-title" className="font-serif text-xl pr-8">
                  Send feedback
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Share your thoughts, report an issue, or suggest an improvement.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="feedback-message" className="mb-2 block text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="feedback-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      className="w-full resize-none border border-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none"
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="border border-border px-5 py-2.5 text-sm transition-colors hover:bg-background disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <Button type="submit" disabled={loading || !message.trim()}>
                      {loading ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export function FeedbackNavButton({
  compact,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { openFeedback } = useFeedback();

  return (
    <button
      type="button"
      onClick={() => {
        openFeedback();
        onNavigate?.();
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-muted transition-colors hover:bg-background hover:text-foreground",
        compact && "flex-col gap-1 px-2 py-2 text-[10px]",
      )}
    >
      <MessageSquare
        className={compact ? "h-5 w-5" : "h-4 w-4"}
        strokeWidth={1.75}
      />
      <span className={compact ? "leading-tight" : ""}>
        {compact ? "Feedback" : "Feedback"}
      </span>
    </button>
  );
}
