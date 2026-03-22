"use client";

import { ConsoleWorkspaceErrorState } from "@/components/console-workspace-state";

type SettingsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SettingsError({ error, reset }: SettingsErrorProps) {
  return (
    <ConsoleWorkspaceErrorState
      section="settings"
      eyebrow="Settings"
      title="The readiness workspace hit a snag."
      description="Something interrupted the system surface before it could finish checking provider state, runtime health, or deployment readiness."
      error={error}
      reset={reset}
      retryLabel="Retry settings view"
      fallbackHref="/dashboard"
      fallbackLabel="Back to dashboard"
      message="Retry the route first. If it keeps failing, the issue is probably temporary readiness or connectivity trouble rather than missing settings UI."
      cardTitle="Unable to load settings right now"
    />
  );
}