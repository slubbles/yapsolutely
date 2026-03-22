import { AgentWorkspaceLoadingState } from "@/components/agent-workspace-state";

export default function AgentDetailLoading() {
  return (
    <AgentWorkspaceLoadingState
      eyebrow="Agent detail"
      title="Loading agent workspace..."
      description="Pulling prompt, routing, recent calls, and voice settings into the per-agent console."
      stats={[
        { label: "Build", value: "Loading" },
        { label: "Deploy", value: "Loading" },
        { label: "Proof", value: "Loading" },
        { label: "Routing", value: "Loading" },
      ]}
    />
  );
}
