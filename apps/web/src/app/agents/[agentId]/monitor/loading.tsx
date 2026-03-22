import { AgentWorkspaceLoadingState } from "@/components/agent-workspace-state";

export default function AgentMonitorLoading() {
  return (
    <AgentWorkspaceLoadingState
      eyebrow="Agent monitor"
      title="Loading monitor workspace..."
      description="Preparing recent outcomes, transcript-proof context, and review signals for this agent."
      stats={[
        { label: "Calls", value: "Loading" },
        { label: "Review", value: "Loading" },
        { label: "Live", value: "Loading" },
        { label: "Coverage", value: "Loading" },
      ]}
    />
  );
}