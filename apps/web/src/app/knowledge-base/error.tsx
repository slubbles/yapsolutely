"use client";

import { OperatorWorkspaceErrorState } from "@/components/operator-workspace-state";

type KnowledgeBaseErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function KnowledgeBaseError({ error, reset }: KnowledgeBaseErrorProps) {
  return (
    <OperatorWorkspaceErrorState
      section="knowledge"
      eyebrow="Knowledge base"
      title="The knowledge workspace hit a snag."
      description="Something interrupted the build surface before it could finish loading source inventory, ingestion posture, and retrieval-planning context."
      error={error}
      reset={reset}
      variant="knowledge"
      cardTitle="Unable to load the knowledge base right now"
      message="Retry the route first. If it keeps failing, the issue is probably temporary session or data trouble rather than a missing build surface."
      retryLabel="Retry knowledge base"
      fallbackHref="/agents"
      fallbackLabel="Review agents"
    />
  );
}