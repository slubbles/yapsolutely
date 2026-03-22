"use client";

import { OperatorWorkspaceErrorState } from "@/components/operator-workspace-state";

type AlertsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AlertsError({ error, reset }: AlertsErrorProps) {
  return (
    <OperatorWorkspaceErrorState
      section="monitor"
      eyebrow="Alerts"
      title="The alerts workspace hit a snag."
      description="Something interrupted the monitoring surface before it could finish loading warnings, triage context, and issue-routing scaffolds."
      error={error}
      reset={reset}
      variant="alerts"
      cardTitle="Unable to load alerts right now"
      message="Retry the route first. If it keeps failing, review settings or QA while the alert center recovers."
      retryLabel="Retry alerts"
      fallbackHref="/settings"
      fallbackLabel="Review settings"
    />
  );
}