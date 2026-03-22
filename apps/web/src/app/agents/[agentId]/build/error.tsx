"use client";

import { AgentWorkspaceErrorState } from "@/components/agent-workspace-state";

type AgentBuildErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AgentBuildError({ error, reset }: AgentBuildErrorProps) {
  return (
    <AgentWorkspaceErrorState
      eyebrow="Agent build"
      title="This build workspace ran into trouble."
      description="The product could not finish loading prompt, voice, or caller-experience controls for the requested agent."
      error={error}
      reset={reset}
      retryLabel="Retry build workspace"
      message="Retry first. If it keeps failing, the agent record may be temporarily unavailable or the current session may have lost access to the requested data."
    />
  );
}