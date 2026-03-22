"use client";

import { AgentWorkspaceErrorState } from "@/components/agent-workspace-state";

type AgentDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AgentDetailError({ error, reset }: AgentDetailErrorProps) {
  return (
    <AgentWorkspaceErrorState
      eyebrow="Agent detail"
      title="This agent workspace ran into trouble."
      description="The product could not finish loading prompt, routing, or recent-call data for the requested agent."
      error={error}
      reset={reset}
      retryLabel="Retry agent detail"
      message="Retry first. If it keeps failing, the agent may be missing for the current session user or the database may be temporarily unavailable."
    />
  );
}
