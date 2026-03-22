import { AgentWorkspaceLoadingState } from "@/components/agent-workspace-state";

export default function AgentBuildLoading() {
  return (
    <AgentWorkspaceLoadingState
      eyebrow="Agent build"
      title="Loading build workspace..."
      description="Preparing prompt, voice, and caller-experience controls for this agent."
      stats={[
        { label: "Prompt", value: "Loading" },
        { label: "Voice", value: "Loading" },
        { label: "Opening", value: "Loading" },
        { label: "Proof", value: "Loading" },
      ]}
    />
  );
}