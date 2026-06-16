import { IS_PHONE_OTP_AVAILABLE } from "@/lib/config";
import type { TourStep } from "./types";

const overviewSteps: TourStep[] = [
  {
    id: "nav",
    target: ["tour-nav-sidebar", "tour-nav-mobile"],
    title: "Dashboard navigation",
    description:
      "Move between Overview, Projects, Banners, Inquiries, Social Links, and Pixels. On mobile, use the bottom bar or the menu button.",
    placement: "right",
  },
  {
    id: "stats",
    target: "tour-stats-panel",
    title: "Key metrics",
    description:
      "A quick snapshot of your portfolio size, published projects, and new contact inquiries.",
    placement: "bottom",
  },
  {
    id: "add-project",
    target: "tour-add-project",
    title: "Add a project",
    description:
      "Create new portfolio work with images, bilingual text, and publish it to the public site.",
    placement: "bottom",
  },
  {
    id: "banners",
    target: "tour-manage-banners",
    title: "Manage banners",
    description:
      "Post short announcements visitors see at the top of the site — great for promotions or alerts.",
    placement: "bottom",
  },
  {
    id: "recent",
    target: "tour-recent-projects",
    title: "Recent projects",
    description:
      "Jump back into projects you edited recently. Tap a row to open the editor.",
    placement: "top",
  },
  {
    id: "help",
    target: "tour-help-button",
    title: "Need help again?",
    description:
      "Open this guide any time. Each dashboard page has its own walkthrough.",
    placement: "right",
  },
];

const projectsSteps: TourStep[] = [
  {
    id: "add-project",
    target: "tour-add-project",
    title: "Add new project",
    description:
      "Start here to create portfolio work. You can save as draft or publish when ready.",
    placement: "bottom",
  },
  {
    id: "projects-list",
    target: "tour-projects-list",
    title: "Your project list",
    description:
      "Edit or delete projects from here. Published items appear on the live website.",
    placement: "top",
  },
];

const projectFormSteps: TourStep[] = [
  {
    id: "project-form",
    target: "tour-project-form",
    title: "Project editor",
    description:
      "Add English and Arabic titles, descriptions, images, and category. Set status to Published to make it live.",
    placement: "top",
  },
];

const bannersSteps: TourStep[] = [
  {
    id: "add-banner",
    target: "tour-add-banner",
    title: "Create a banner",
    description:
      "Write a message in English and Arabic, optionally add a link, and choose when it expires.",
    placement: "bottom",
  },
  {
    id: "banners-list",
    target: "tour-banners-list",
    title: "Banner list",
    description:
      "Toggle banners on or off, edit copy, or remove old announcements from this panel.",
    placement: "top",
  },
];

const inquiriesSteps: TourStep[] = [
  {
    id: "inquiries-filters",
    target: "tour-inquiries-filters",
    title: "Filter inquiries",
    description:
      "View all leads or filter by new, read, and archived status.",
    placement: "bottom",
  },
  {
    id: "inquiries-list",
    target: "tour-inquiries-list",
    title: "Lead inbox",
    description:
      "Contact form submissions and newsletter signups appear here. Tap a row to read the full message and update its status.",
    placement: "top",
  },
];

const socialSteps: TourStep[] = [
  {
    id: "add-social-link",
    target: "tour-add-social-link",
    title: "Add a social link",
    description:
      "Choose a platform, label, and URL. Enabled links appear in the site footer.",
    placement: "bottom",
  },
  {
    id: "social-links-list",
    target: "tour-social-links-list",
    title: "Manage links",
    description:
      "Show or hide links on the public site, edit details, or remove ones you no longer need.",
    placement: "top",
  },
];

const securitySteps: TourStep[] = [
  {
    id: "phone-security",
    target: "tour-phone-security",
    title: "Phone sign-in",
    description:
      "Link a verified phone number to sign in with a one-time code instead of your password.",
    placement: "top",
  },
];

const pixelsSteps: TourStep[] = [
  {
    id: "add-pixel",
    target: "tour-add-pixel",
    title: "Add a tracking pixel",
    description:
      "Click here to open the form. Choose a platform (Meta, Google GA4, Google Ads, TikTok, Snapchat, or GTM), add a label and pixel ID, then enable it.",
    placement: "bottom",
  },
  {
    id: "pixels-list",
    target: "tour-pixels-list",
    title: "Manage pixels",
    description:
      "Enable or disable tracking tags, review configured IDs, or remove pixels you no longer need.",
    placement: "top",
  },
];

const stepsByPath: Record<string, TourStep[]> = {
  "/dashboard": overviewSteps,
  "/dashboard/projects": projectsSteps,
  "/dashboard/projects/new": projectFormSteps,
  "/dashboard/banners": bannersSteps,
  "/dashboard/inquiries": inquiriesSteps,
  "/dashboard/social": socialSteps,
  "/dashboard/pixels": pixelsSteps,
  "/dashboard/security": securitySteps,
};

export function getTourSteps(pathname: string): TourStep[] {
  if (stepsByPath[pathname]) {
    return stepsByPath[pathname];
  }

  if (pathname.match(/^\/dashboard\/projects\/[^/]+\/edit$/)) {
    return projectFormSteps;
  }

  if (IS_PHONE_OTP_AVAILABLE && pathname === "/dashboard/security") {
    return securitySteps;
  }

  return [];
}

export function getTourPageKey(pathname: string): string | null {
  const steps = getTourSteps(pathname);
  if (steps.length === 0) return null;

  if (pathname.match(/^\/dashboard\/projects\/[^/]+\/edit$/)) {
    return "/dashboard/projects/edit";
  }

  return pathname;
}
