"use client";

import { AgentWorkspaceErrorState } from "@/components/agent-workspace-state";

type AgentTestErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AgentTestError({ error, reset }: AgentTestErrorProps) {
  return (
    <AgentWorkspaceErrorState
      eyebrow="Agent test"
      title="This test workspace ran into trouble."
      description="The product could not finish loading rehearsal checks or recent evidence for the requested agent."
      error={error}
      reset={reset}
      retryLabel="Retry test workspace"
      message="Retry first. If it keeps failing, the agent record or its recent call evidence may be temporarily unavailable."
    />
  );
}