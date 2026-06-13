import type { TourPlacement } from "./types";

export function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;

  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
}

export function findTourTarget(target: string | string[]): HTMLElement | null {
  const ids = Array.isArray(target) ? target : [target];

  for (const id of ids) {
    const element = document.querySelector(`[data-tour="${id}"]`);
    if (element && isElementVisible(element)) {
      return element as HTMLElement;
    }
  }

  for (const id of ids) {
    const element = document.querySelector(`[data-tour="${id}"]`);
    if (element) return element as HTMLElement;
  }

  return null;
}

interface PopoverPosition {
  top: number;
  left: number;
}

export function getPopoverPosition(
  target: DOMRect,
  placement: TourPlacement,
  popoverWidth: number,
  popoverHeight: number,
): PopoverPosition {
  const gap = 12;
  const viewportPadding = 16;
  const maxLeft = window.innerWidth - popoverWidth - viewportPadding;
  const maxTop = window.innerHeight - popoverHeight - viewportPadding;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "left":
      top = target.top + target.height / 2 - popoverHeight / 2;
      left = target.left - popoverWidth - gap;
      break;
    case "right":
      top = target.top + target.height / 2 - popoverHeight / 2;
      left = target.right + gap;
      break;
    case "bottom":
      top = target.bottom + gap;
      left = target.left + target.width / 2 - popoverWidth / 2;
      break;
    default:
      top = target.top - popoverHeight - gap;
      left = target.left + target.width / 2 - popoverWidth / 2;
      break;
  }

  return {
    top: Math.min(Math.max(top, viewportPadding), maxTop),
    left: Math.min(Math.max(left, viewportPadding), maxLeft),
  };
}
