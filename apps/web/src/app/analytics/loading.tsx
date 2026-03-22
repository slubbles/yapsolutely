import { OperatorWorkspaceLoadingState } from "@/components/operator-workspace-state";

export default function AnalyticsLoading() {
  return (
    <OperatorWorkspaceLoadingState
      section="monitor"
      eyebrow="Analytics"
      title="Loading analytics workspace..."
      description="Preparing performance summaries, trend scaffolds, and monitoring context for the analytics surface."
      variant="monitor"
    />
  );
}