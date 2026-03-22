"use client";

import { ConsoleWorkspaceErrorState } from "@/components/console-workspace-state";

type AgentsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AgentsError({ error, reset }: AgentsErrorProps) {
  return (
    <ConsoleWorkspaceErrorState
      section="agents"
      eyebrow="Agents"
      title="The agents workspace hit a snag."
      description="Something interrupted the operator home before it could finish loading your agent records."
      error={error}
      reset={reset}
      retryLabel="Retry agents view"
      fallbackHref="/settings"
      fallbackLabel="Review readiness"
      message="Retry the route first. If it keeps failing, the issue is likely temporary database or session trouble rather than a missing UI path."
      cardTitle="Unable to load agents right now"
    />
  );
}
