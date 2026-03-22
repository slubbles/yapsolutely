import { OperatorWorkspaceLoadingState } from "@/components/operator-workspace-state";

export default function BillingLoading() {
  return (
    <OperatorWorkspaceLoadingState
      section="billing"
      eyebrow="Billing"
      title="Loading billing workspace..."
      description="Preparing cost drivers, billing blockers, and plan posture context for the billing surface."
      variant="billing"
    />
  );
}