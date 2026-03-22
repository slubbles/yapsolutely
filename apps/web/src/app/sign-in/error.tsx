"use client";

import { AuthEntryErrorState } from "@/components/auth-entry-state";

type SignInErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SignInError({ error, reset }: SignInErrorProps) {
  return (
    <AuthEntryErrorState
      mode="sign-in"
      eyebrow="Sign in"
      title="Unable to load sign in right now"
      description="The operator entry route hit a snag before it could hand the user into the workspace cleanly."
      asideTitle="The auth front door should recover gracefully, not theatrically."
      asideBody="Retry first. If the route still misbehaves, take the calmer path back through the landing page and re-enter the funnel cleanly."
      stats={[
        { label: "Build", value: "Paused", note: "Agent work can wait a moment; trust comes first." },
        { label: "Deploy", value: "Held", note: "Routing is still there once the session path recovers." },
        { label: "Monitor", value: "Safe", note: "Proof surfaces remain intact behind the auth step." },
      ]}
      error={error}
      reset={reset}
      retryLabel="Retry sign in"
      fallbackHref="/"
      fallbackLabel="Back home"
      message="Retry the route first. If it keeps failing, return home and re-enter the auth flow from a clean page load."
    />
  );
}