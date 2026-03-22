"use client";

import { OperatorWorkspaceErrorState } from "@/components/operator-workspace-state";

type QaErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function QaError({ error, reset }: QaErrorProps) {
  return (
    <OperatorWorkspaceErrorState
      section="monitor"
      eyebrow="QA"
      title="The QA workspace hit a snag."
      description="Something interrupted the monitoring surface before it could finish loading review queues, scorecard scaffolds, and quality context."
      error={error}
      reset={reset}
      variant="qa"
      cardTitle="Unable to load QA right now"
      message="Retry the route first. If it keeps failing, review flagged calls directly while the QA surface recovers."
      retryLabel="Retry QA"
      fallbackHref="/calls?status=FAILED"
      fallbackLabel="Open flagged calls"
    />
  );
}