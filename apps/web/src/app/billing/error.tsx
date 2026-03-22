"use client";

import { OperatorWorkspaceErrorState } from "@/components/operator-workspace-state";

type BillingErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BillingError({ error, reset }: BillingErrorProps) {
  return (
    <OperatorWorkspaceErrorState
      section="billing"
      eyebrow="Billing"
      title="The billing workspace hit a snag."
      description="Something interrupted the system surface before it could finish loading cost drivers, plan posture, and billing-risk context."
      error={error}
      reset={reset}
      variant="billing"
      cardTitle="Unable to load billing right now"
      message="Retry the route first. If it keeps failing, review settings or analytics while the billing surface recovers."
      retryLabel="Retry billing"
      fallbackHref="/settings"
      fallbackLabel="Review settings"
    />
  );
}