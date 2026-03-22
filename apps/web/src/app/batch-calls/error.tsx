"use client";

import { OperatorWorkspaceErrorState } from "@/components/operator-workspace-state";

type BatchCallsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BatchCallsError({ error, reset }: BatchCallsErrorProps) {
  return (
    <OperatorWorkspaceErrorState
      section="batch"
      eyebrow="Batch calls"
      title="The batch-call workspace hit a snag."
      description="Something interrupted the deploy surface before it could finish loading campaign planning, rollout posture, and audience context."
      error={error}
      reset={reset}
      variant="deploy"
      cardTitle="Unable to load batch calls right now"
      message="Retry the route first. If it keeps failing, review numbers or calls while the campaign surface recovers."
      retryLabel="Retry batch calls"
      fallbackHref="/numbers"
      fallbackLabel="Review numbers"
    />
  );
}