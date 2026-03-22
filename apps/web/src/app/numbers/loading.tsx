import { OperatorWorkspaceLoadingState } from "@/components/operator-workspace-state";

export default function NumbersLoading() {
  return (
    <OperatorWorkspaceLoadingState
      section="numbers"
      eyebrow="Numbers"
      title="Loading number routing..."
      description="Pulling number inventory, assignment state, and runtime mapping context into the deploy workspace."
      variant="deploy"
    />
  );
}