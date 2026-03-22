import { ConsoleWorkspaceLoadingState } from "@/components/console-workspace-state";

export default function NewAgentLoading() {
  return (
    <ConsoleWorkspaceLoadingState
      section="agents"
      eyebrow="Create agent"
      title="Loading create-agent workspace..."
      description="Preparing the draft-agent builder, prompt tooling, and setup guidance before the form becomes interactive."
      variant="builder"
    />
  );
}