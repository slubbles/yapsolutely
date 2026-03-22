"use client";

import type { ConsoleShellSection } from "@/components/console-shell-context";
import { ConsoleShell } from "@/components/console-shell";
import { WorkspacePlaceholderLoading } from "@/components/workspace-placeholder-loading";
import { WorkspaceRouteError } from "@/components/workspace-route-error";

type OperatorWorkspaceVariant = "knowledge" | "monitor" | "qa" | "alerts" | "billing" | "deploy";

type OperatorWorkspaceLoadingStateProps = {
  section: ConsoleShellSection;
  eyebrow: string;
  title: string;
  description: string;
  variant: OperatorWorkspaceVariant;
};

type OperatorWorkspaceErrorStateProps = {
  section: ConsoleShellSection;
  eyebrow: string;
  title: string;
  description: string;
  error: Error & { digest?: string };
  reset: () => void;
  variant: OperatorWorkspaceVariant;
  cardTitle: string;
  message: string;
  retryLabel: string;
  fallbackHref: string;
  fallbackLabel: string;
};

export function OperatorWorkspaceLoadingState({
  section,
  eyebrow,
  title,
  description,
  variant,
}: OperatorWorkspaceLoadingStateProps) {
  return (
    <ConsoleShell
      section={section}
      eyebrow={eyebrow}
      title={title}
      description={description}
      userEmail="Loading session..."
    >
      <WorkspacePlaceholderLoading variant={variant} />
    </ConsoleShell>
  );
}

export function OperatorWorkspaceErrorState({
  section,
  eyebrow,
  title,
  description,
  error,
  reset,
  variant,
  cardTitle,
  message,
  retryLabel,
  fallbackHref,
  fallbackLabel,
}: OperatorWorkspaceErrorStateProps) {
  return (
    <ConsoleShell
      section={section}
      eyebrow={eyebrow}
      title={title}
      description={description}
      userEmail="Workspace session"
    >
      <WorkspaceRouteError
        error={error}
        reset={reset}
        variant={variant}
        title={cardTitle}
        message={message}
        retryLabel={retryLabel}
        fallbackHref={fallbackHref}
        fallbackLabel={fallbackLabel}
      />
    </ConsoleShell>
  );
}