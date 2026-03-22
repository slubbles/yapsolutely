"use client";

import { AgentWorkspaceErrorState } from "@/components/agent-workspace-state";

type AgentMonitorErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AgentMonitorError({ error, reset }: AgentMonitorErrorProps) {
  return (
    <AgentWorkspaceErrorState
      eyebrow="Agent monitor"
      title="This monitor workspace ran into trouble."
      description="The product could not finish loading recent outcomes or review signals for the requested agent."
      error={error}
      reset={reset}
      retryLabel="Retry monitor workspace"
      message="Retry first. If it keeps failing, the route may be missing recent call data or the current session may not be able to read the requested agent history."
    />
  );
}