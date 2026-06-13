import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import { DashboardTourProvider } from "@/features/dashboard/tour/DashboardTour";

export default function DashboardPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardTourProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardTourProvider>
  );
}
