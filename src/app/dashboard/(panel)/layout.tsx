import { DashboardShell } from "@/features/dashboard/components/DashboardShell";

export default function DashboardPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
