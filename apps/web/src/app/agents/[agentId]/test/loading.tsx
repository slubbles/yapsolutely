import { AgentWorkspaceLoadingState } from "@/components/agent-workspace-state";

export default function AgentTestLoading() {
  return (
    <AgentWorkspaceLoadingState
      eyebrow="Agent test"
      title="Loading test workspace..."
      description="Preparing launch-readiness checks, rehearsal notes, and recent evidence for this agent."
      stats={[
        { label: "Readiness", value: "Loading" },
        { label: "Opening", value: "Loading" },
        { label: "Routing", value: "Loading" },
        { label: "Evidence", value: "Loading" },
      ]}
    />
  );
}