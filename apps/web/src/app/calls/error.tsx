"use client";

import { OperatorWorkspaceErrorState } from "@/components/operator-workspace-state";

type CallsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CallsError({ error, reset }: CallsErrorProps) {
  return (
    <OperatorWorkspaceErrorState
      section="calls"
      eyebrow="Calls"
      title="The calls workspace hit a snag."
      description="Something interrupted the call log view before it could finish loading the latest records."
      error={error}
      reset={reset}
      variant="monitor"
      cardTitle="Unable to load calls right now"
      message="Try reloading the route. If the problem persists, it is likely a temporary database or runtime connectivity issue rather than missing UI wiring."
      retryLabel="Retry calls view"
      fallbackHref="/dashboard"
      fallbackLabel="Back to dashboard"
    />
  );
}