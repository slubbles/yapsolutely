"use client";

import { ConsoleWorkspaceErrorState } from "@/components/console-workspace-state";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <ConsoleWorkspaceErrorState
      section="dashboard"
      eyebrow="Dashboard"
      title="The workspace home hit a snag."
      description="Something interrupted the operator home before it could finish loading your latest metrics and recent proof."
      error={error}
      reset={reset}
      retryLabel="Retry dashboard"
      fallbackHref="/agents"
      fallbackLabel="Open agents"
      message="Retry the route first. If it keeps failing, the issue is probably temporary data or readiness trouble rather than missing navigation."
      cardTitle="Unable to load the dashboard right now"
    />
  );
}