import { AgentWorkspaceLoadingState } from "@/components/agent-workspace-state";

export default function AgentDeployLoading() {
  return (
    <AgentWorkspaceLoadingState
      eyebrow="Agent deploy"
      title="Loading deploy workspace..."
      description="Preparing number routing, runtime posture, and launch-readiness controls for this agent."
      stats={[
        { label: "Routing", value: "Loading" },
        { label: "Lifecycle", value: "Loading" },
        { label: "Health", value: "Loading" },
        { label: "Readiness", value: "Loading" },
      ]}
    />
  );
}