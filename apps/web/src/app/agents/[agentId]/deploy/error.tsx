"use client";

import { AgentWorkspaceErrorState } from "@/components/agent-workspace-state";

type AgentDeployErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AgentDeployError({ error, reset }: AgentDeployErrorProps) {
  return (
    <AgentWorkspaceErrorState
      eyebrow="Agent deploy"
      title="This deploy workspace ran into trouble."
      description="The product could not finish loading routing, runtime-health, or launch-readiness data for the requested agent."
      error={error}
      reset={reset}
      retryLabel="Retry deploy workspace"
      message="Retry first. If it keeps failing, the route may be missing agent data, number-assignment data, or readiness signals from the current environment."
    />
  );
}