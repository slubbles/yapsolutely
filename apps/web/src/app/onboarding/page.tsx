import Link from "next/link";
import { AuthFunnelShell } from "@/components/auth-funnel-shell";
import { FormSubmitButton } from "@/components/form-submit-button";
import { requireSession } from "@/lib/auth";

const useCases = [
  "Inbound sales",
  "Support triage",
  "Appointment booking",
  "Front desk automation",
];

const teamSizes = ["1–10", "11–50", "51–250", "250+"];
const implementationStyles = ["Hands-on setup", "Guided onboarding", "Need a live walkthrough"];

export default async function OnboardingPage() {
  const session = await requireSession();

  return (
    <AuthFunnelShell
      step={3}
      totalSteps={3}
      eyebrow="Onboarding"
      title="Tell us what you’re here to build."
      description="A lightweight survey helps the product feel intentional now and gives us a clear handoff point into the workspace."
      asideTitle="The setup should feel guided, not generic."
      asideBody="This survey is intentionally lightweight for the demo, but it creates the right product beat before the user lands in the operator workspace and starts building real voice flows."
    >
      <div className="mb-5 rounded-[18px] bg-[var(--surface-subtle)] px-4 py-4">
        <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-subtle)]">Workspace owner</div>
        <div className="mt-1 text-[0.86rem] font-medium text-[var(--text-strong)]">{session.name || session.email}</div>
      </div>

      <form action="/agents" className="space-y-6">
        <input type="hidden" name="onboarding" value="1" />

        <fieldset>
          <legend className="text-sm font-medium text-[var(--text-body)]">What do you want the agent to do first?</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {useCases.map((item, index) => (
              <label
                key={item}
                className="flex cursor-pointer items-start gap-3 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-4 transition hover:bg-[var(--surface-subtle)]"
              >
                <input
                  type="radio"
                  name="useCase"
                  value={item}
                  defaultChecked={index === 0}
                  className="mt-1 h-4 w-4 border-[var(--border-soft)]"
                />
                <span className="text-[0.82rem] text-[var(--text-body)]">{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-[var(--text-body)]">How many people will touch this workspace?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {teamSizes.map((item, index) => (
              <label
                key={item}
                className={`cursor-pointer rounded-full border px-3 py-2 text-[0.76rem] transition ${
                  index === 1
                    ? "border-[var(--text-strong)] bg-[var(--text-strong)] text-white"
                    : "border-[var(--border-soft)] bg-[var(--surface-subtle)] text-[var(--text-body)]"
                }`}
              >
                <input type="radio" name="teamSize" value={item} defaultChecked={index === 1} className="sr-only" />
                {item}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-[var(--text-body)]">How do you want to get started?</legend>
          <div className="mt-3 space-y-2">
            {implementationStyles.map((item, index) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-3 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-3 transition hover:bg-[var(--surface-subtle)]"
              >
                <input type="radio" name="implementationStyle" value={item} defaultChecked={index === 0} className="h-4 w-4 border-[var(--border-soft)]" />
                <span className="text-[0.8rem] text-[var(--text-body)]">{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <FormSubmitButton
          label="Enter workspace"
          pendingLabel="Opening workspace…"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[var(--text-strong)] px-4 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)] disabled:cursor-wait disabled:opacity-75"
        />
      </form>

      <div className="mt-5 text-center text-sm text-[var(--text-subtle)]">
        Prefer to skip for now?{" "}
        <Link href="/agents?onboarding=1" className="font-medium text-[var(--text-strong)] hover:underline hover:underline-offset-4">
          Go straight to agents
        </Link>
      </div>
    </AuthFunnelShell>
  );
}