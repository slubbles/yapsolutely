"use client";

import { OperatorWorkspaceErrorState } from "@/components/operator-workspace-state";

type NumbersErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function NumbersError({ error, reset }: NumbersErrorProps) {
  return (
    <OperatorWorkspaceErrorState
      section="numbers"
      eyebrow="Numbers"
      title="The number routing workspace hit a snag."
      description="Something interrupted the deploy surface before it could finish loading number inventory, assignment state, or runtime mapping details."
      error={error}
      reset={reset}
      variant="deploy"
      cardTitle="Unable to load numbers right now"
      message="Retry the route first. If it keeps failing, the issue is probably temporary database or readiness trouble rather than missing routing UI."
      retryLabel="Retry numbers view"
      fallbackHref="/agents"
      fallbackLabel="Review agents"
    />
  );
}