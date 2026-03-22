import { OperatorWorkspaceLoadingState } from "@/components/operator-workspace-state";

export default function KnowledgeBaseLoading() {
  return (
    <OperatorWorkspaceLoadingState
      section="knowledge"
      eyebrow="Knowledge base"
      title="Loading knowledge workspace..."
      description="Preparing source inventory, launch blockers, and retrieval-planning context for the knowledge surface."
      variant="knowledge"
    />
  );
}