import { AuthEntryLoadingState } from "@/components/auth-entry-state";

export default function SignUpLoading() {
  return (
    <AuthEntryLoadingState
      mode="sign-up"
      eyebrow="Create account"
      title="Loading the account creation flow..."
      description="Preparing the email-first setup path, including account creation posture and the handoff into verification and onboarding."
      asideTitle="The first-run path should feel deliberate before the first table ever appears."
      asideBody="Even in loading states, the funnel should preserve the premium rhythm that carries users from landing page confidence into workspace trust."
      stats={[
        { label: "Step 1", value: "Email", note: "Start with one clear workspace identity." },
        { label: "Step 2", value: "Verify", note: "Trust should arrive before the dashboard does." },
        { label: "Step 3", value: "Onboard", note: "A lighter setup beat frames the operator handoff." },
      ]}
    />
  );
}