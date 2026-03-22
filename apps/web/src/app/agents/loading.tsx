import { ConsoleWorkspaceLoadingState } from "@/components/console-workspace-state";

export default function AgentsLoading() {
  return (
    <ConsoleWorkspaceLoadingState
      section="agents"
      eyebrow="Agents"
      title="Loading agent workspace..."
      description="Fetching your agents, routing context, and the starting state for the operator home."
      variant="agents"
    />
  );
}
