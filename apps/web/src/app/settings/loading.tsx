import { ConsoleWorkspaceLoadingState } from "@/components/console-workspace-state";

export default function SettingsLoading() {
  return (
    <ConsoleWorkspaceLoadingState
      section="settings"
      eyebrow="Settings"
      title="Loading readiness workspace..."
      description="Checking provider state, runtime reachability, and deployment readiness before the system surface finishes rendering."
      variant="settings"
    />
  );
}