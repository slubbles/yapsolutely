import { OperatorWorkspaceLoadingState } from "@/components/operator-workspace-state";

export default function BatchCallsLoading() {
  return (
    <OperatorWorkspaceLoadingState
      section="batch"
      eyebrow="Batch calls"
      title="Loading batch-call workspace..."
      description="Preparing campaign plans, rollout readiness, and follow-up audience context for the outbound planning surface."
      variant="deploy"
    />
  );
}