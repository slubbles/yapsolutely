import { AuthFunnelShell } from "@/components/auth-funnel-shell";

export default function VerifyIdentityLoading() {
  return (
    <AuthFunnelShell
      step={2}
      totalSteps={3}
      eyebrow="Verify identity"
      title="Loading verification step..."
      description="Preparing the email verification screen before the setup funnel continues into onboarding."
      asideTitle="Verification should feel quick, not flimsy."
      asideBody="The identity step should stay calm and credible while the route finishes loading the verification surface."
    >
      <div className="space-y-6">
        <div className="rounded-[18px] bg-[var(--surface-subtle)] px-4 py-4">
          <div className="h-3 w-28 animate-pulse rounded bg-[var(--surface-panel)]/90" />
          <div className="mt-2 h-4 w-44 animate-pulse rounded bg-[var(--surface-panel)]/75" />
        </div>

        <div>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-xl bg-[var(--surface-subtle)]/85" />
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-[var(--surface-subtle)]" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--surface-subtle)]/85" />
          </div>
        </div>

        <div className="h-12 animate-pulse rounded-xl bg-[var(--surface-subtle)]" />

        <div className="flex items-center justify-between">
          <div className="h-4 w-12 animate-pulse rounded bg-[var(--surface-subtle)]/85" />
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface-subtle)]/85" />
        </div>
      </div>
    </AuthFunnelShell>
  );
}