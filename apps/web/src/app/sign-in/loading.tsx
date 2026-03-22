import { AuthEntryLoadingState } from "@/components/auth-entry-state";

export default function SignInLoading() {
  return (
    <AuthEntryLoadingState
      mode="sign-in"
      eyebrow="Sign in"
      title="Loading the operator sign-in flow..."
      description="Preparing the calmer workspace entry path, including demo auth posture and the email-first session handoff."
      asideTitle="The front door should feel as considered as the product behind it."
      asideBody="Even while loading, this route should read like a real operator entry, not a generic auth detour."
      stats={[
        { label: "Build", value: "Agents", note: "Prompt and voice controls wait on the other side." },
        { label: "Deploy", value: "Numbers", note: "Routing posture should stay one step away, not six." },
        { label: "Monitor", value: "Proof", note: "Transcripts and QA complete the loop after sign-in." },
      ]}
    />
  );
}