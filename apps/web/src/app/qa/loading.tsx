import { OperatorWorkspaceLoadingState } from "@/components/operator-workspace-state";

export default function QaLoading() {
  return (
    <OperatorWorkspaceLoadingState
      section="monitor"
      eyebrow="QA"
      title="Loading QA workspace..."
      description="Preparing review queues, rubric scaffolds, and quality-loop context for the QA surface."
      variant="qa"
    />
  );
}