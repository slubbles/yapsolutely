"use client";

import { ConsoleWorkspaceErrorState } from "@/components/console-workspace-state";

type NewAgentErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function NewAgentError({ error, reset }: NewAgentErrorProps) {
  return (
    <ConsoleWorkspaceErrorState
      section="agents"
      eyebrow="Create agent"
      title="The create-agent workspace hit a snag."
      description="Something interrupted the builder surface before it could finish loading the draft-agent form and prompt tooling."
      error={error}
      reset={reset}
      retryLabel="Retry create agent"
      fallbackHref="/agents"
      fallbackLabel="Back to agents"
      message="Retry the route first. If it keeps failing, head back to the agents list and reopen the builder from there."
      cardTitle="Unable to load create agent right now"
    />
  );
}