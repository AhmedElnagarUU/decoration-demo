export type TourPlacement = "top" | "bottom" | "left" | "right";

export interface TourStep {
  id: string;
  target: string | string[];
  title: string;
  description: string;
  placement?: TourPlacement;
}
