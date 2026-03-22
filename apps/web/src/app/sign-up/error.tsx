"use client";

import { AuthEntryErrorState } from "@/components/auth-entry-state";

type SignUpErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SignUpError({ error, reset }: SignUpErrorProps) {
  return (
    <AuthEntryErrorState
      mode="sign-up"
      eyebrow="Create account"
      title="Unable to load sign up right now"
      description="The first-run account creation route hit a snag before it could continue into verification and onboarding."
      asideTitle="The account-creation flow should fail politely when it fails at all."
      asideBody="Retry first. If the route still misbehaves, restart from the landing page and take the calmer scenic route back into setup."
      stats={[
        { label: "Step 1", value: "Paused", note: "Account creation is waiting on the route to steady itself." },
        { label: "Step 2", value: "Verify", note: "Trust can resume once the first step recovers." },
        { label: "Step 3", value: "Onboard", note: "The workspace handoff is still waiting on the other side." },
      ]}
      error={error}
      reset={reset}
      retryLabel="Retry sign up"
      fallbackHref="/"
      fallbackLabel="Back home"
      message="Retry the route first. If it keeps failing, return home and re-enter the account-creation flow from the landing page."
    />
  );
}