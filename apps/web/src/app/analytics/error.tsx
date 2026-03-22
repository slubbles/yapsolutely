"use client";

import { OperatorWorkspaceErrorState } from "@/components/operator-workspace-state";

type AnalyticsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AnalyticsError({ error, reset }: AnalyticsErrorProps) {
  return (
    <OperatorWorkspaceErrorState
      section="monitor"
      eyebrow="Analytics"
      title="The analytics workspace hit a snag."
      description="Something interrupted the monitoring surface before it could finish loading performance context and trend scaffolds."
      error={error}
      reset={reset}
      variant="monitor"
      cardTitle="Unable to load analytics right now"
      message="Retry the route first. If it keeps failing, head back to calls or QA while the analytics surface catches its breath."
      retryLabel="Retry analytics"
      fallbackHref="/calls"
      fallbackLabel="Open calls"
    />
  );
}