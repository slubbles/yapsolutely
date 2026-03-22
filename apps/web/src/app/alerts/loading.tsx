import { OperatorWorkspaceLoadingState } from "@/components/operator-workspace-state";

export default function AlertsLoading() {
  return (
    <OperatorWorkspaceLoadingState
      section="monitor"
      eyebrow="Alerts"
      title="Loading alerts workspace..."
      description="Preparing warning states, triage scaffolds, and operational issue context for the alerts surface."
      variant="alerts"
    />
  );
}