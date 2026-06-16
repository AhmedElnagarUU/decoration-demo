import { DashboardShell } from "@/features/dashboard/components/DashboardShell";
import { DemoStoreHydrator } from "@/features/dashboard/components/DemoStoreHydrator";
import { DashboardTourProvider } from "@/features/dashboard/tour/DashboardTour";

export default function DashboardPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardTourProvider>
      <DemoStoreHydrator />
      <DashboardShell>{children}</DashboardShell>
    </DashboardTourProvider>
  );
}
