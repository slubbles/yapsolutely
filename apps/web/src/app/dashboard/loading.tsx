import { ConsoleWorkspaceLoadingState } from "@/components/console-workspace-state";

export default function DashboardLoading() {
  return (
    <ConsoleWorkspaceLoadingState
      section="dashboard"
      eyebrow="Dashboard"
      title="Loading workspace home..."
      description="Pulling agent counts, call outcomes, runtime posture, and recent proof into the operator home."
      variant="dashboard"
    />
  );
}