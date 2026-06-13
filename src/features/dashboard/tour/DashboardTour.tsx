"use client";

import { getTourPageKey, getTourSteps } from "@/features/dashboard/tour/tour-steps";
import {
  hasSeenTourPage,
  markTourPageSeen,
} from "@/features/dashboard/tour/tour-storage";
import type { TourPlacement } from "@/features/dashboard/tour/types";
import {
  findTourTarget,
  getPopoverPosition,
} from "@/features/dashboard/tour/tour-utils";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface TourRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface DashboardTourContextValue {
  startTour: () => void;
  isActive: boolean;
}

const DashboardTourContext = createContext<DashboardTourContextValue | null>(null);

export function useDashboardTour() {
  const context = useContext(DashboardTourContext);
  if (!context) {
    throw new Error("useDashboardTour must be used within DashboardTourProvider");
  }
  return context;
}

function TourOverlay({
  stepIndex,
  totalSteps,
  title,
  description,
  placement,
  targetRect,
  onNext,
  onBack,
  onClose,
}: {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
  placement: TourPlacement;
  targetRect: TourRect | null;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const popoverWidth = 320;
  const popoverHeight = 190;

  useEffect(() => {
    if (!targetRect) return;

    const position = getPopoverPosition(
      new DOMRect(targetRect.left, targetRect.top, targetRect.width, targetRect.height),
      placement,
      popoverWidth,
      popoverHeight,
    );
    setPopoverPosition(position);
  }, [targetRect, placement]);

  const isLastStep = stepIndex === totalSteps - 1;

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Dashboard guide">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close guide"
      />

      {targetRect && (
        <div
          className="pointer-events-none absolute rounded-md ring-4 ring-accent/90"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.58)",
          }}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${title}-${stepIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute w-[min(320px,calc(100vw-2rem))] rounded-sm border border-border bg-card p-4 shadow-xl"
          style={{
            top: targetRect ? popoverPosition.top : "50%",
            left: targetRect ? popoverPosition.left : "50%",
            transform: targetRect ? undefined : "translate(-50%, -50%)",
          }}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-accent uppercase">
                Step {stepIndex + 1} of {totalSteps}
              </p>
              <h3 className="mt-1 text-base font-medium">{title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-muted hover:bg-background hover:text-foreground"
              aria-label="Close guide"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-muted">{description}</p>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-muted hover:text-foreground"
            >
              Skip tour
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onBack}
                disabled={stepIndex === 0}
                className="border border-border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={onNext}
                className="bg-accent px-3 py-1.5 text-sm text-white hover:bg-accent-hover"
              >
                {isLastStep ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body,
  );
}

export function DashboardTourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const steps = useMemo(() => getTourSteps(pathname), [pathname]);
  const pageKey = useMemo(() => getTourPageKey(pathname), [pathname]);

  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TourRect | null>(null);

  const currentStep = steps[stepIndex];

  const updateTargetRect = useCallback(() => {
    if (!currentStep) {
      setTargetRect(null);
      return;
    }

    const target = findTourTarget(currentStep.target);
    if (!target) {
      setTargetRect(null);
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });

    const rect = target.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  }, [currentStep]);

  const closeTour = useCallback(() => {
    setIsActive(false);
    setStepIndex(0);
    setTargetRect(null);
    if (pageKey) {
      markTourPageSeen(pageKey);
    }
  }, [pageKey]);

  const startTour = useCallback(() => {
    if (steps.length === 0) return;
    setStepIndex(0);
    setIsActive(true);
  }, [steps]);

  const goNext = useCallback(() => {
    if (stepIndex >= steps.length - 1) {
      closeTour();
      return;
    }
    setStepIndex((index) => index + 1);
  }, [closeTour, stepIndex, steps.length]);

  const goBack = useCallback(() => {
    setStepIndex((index) => Math.max(0, index - 1));
  }, []);

  useEffect(() => {
    setIsActive(false);
    setStepIndex(0);
    setTargetRect(null);
  }, [pathname]);

  useEffect(() => {
    if (!pageKey || steps.length === 0) return;
    if (hasSeenTourPage(pageKey)) return;

    const timer = window.setTimeout(() => {
      setIsActive(true);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [pageKey, steps.length]);

  useEffect(() => {
    if (!isActive || !currentStep) return;

    updateTargetRect();

    const handleLayoutChange = () => updateTargetRect();
    window.addEventListener("resize", handleLayoutChange);
    window.addEventListener("scroll", handleLayoutChange, true);

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      window.removeEventListener("scroll", handleLayoutChange, true);
    };
  }, [isActive, currentStep, updateTargetRect]);

  return (
    <DashboardTourContext.Provider value={{ startTour, isActive }}>
      {children}
      {isActive && currentStep && (
        <TourOverlay
          stepIndex={stepIndex}
          totalSteps={steps.length}
          title={currentStep.title}
          description={currentStep.description}
          placement={currentStep.placement ?? "bottom"}
          targetRect={targetRect}
          onNext={goNext}
          onBack={goBack}
          onClose={closeTour}
        />
      )}
    </DashboardTourContext.Provider>
  );
}

export function DashboardTourButton() {
  const { startTour } = useDashboardTour();
  const pathname = usePathname();
  const hasTour = getTourSteps(pathname).length > 0;

  if (!hasTour) return null;

  return (
    <button
      type="button"
      data-tour="tour-help-button"
      onClick={startTour}
      className="flex w-full items-center gap-3 rounded px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
    >
      <HelpCircle className="h-4 w-4" strokeWidth={1.75} />
      How to use
    </button>
  );
}
