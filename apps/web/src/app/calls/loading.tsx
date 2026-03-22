import { OperatorWorkspaceLoadingState } from "@/components/operator-workspace-state";

export default function CallsLoading() {
  return (
    <OperatorWorkspaceLoadingState
      section="calls"
      eyebrow="Calls"
      title="Loading call activity..."
      description="Fetching recent calls, transcript previews, and filter context for this workspace."
      variant="monitor"
    />
  );
}