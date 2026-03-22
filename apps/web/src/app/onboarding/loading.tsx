import { AuthFunnelShell } from "@/components/auth-funnel-shell";

export default function OnboardingLoading() {
  return (
    <AuthFunnelShell
      step={3}
      totalSteps={3}
      eyebrow="Onboarding"
      title="Loading onboarding survey..."
      description="Preparing the final setup questions before the user enters the operator workspace."
      asideTitle="The handoff into the workspace should feel deliberate."
      asideBody="This step sets tone and intent before the product opens up, so the route should feel polished even while it is still loading."
    >
      <div className="space-y-6">
        <div className="rounded-[18px] bg-[var(--surface-subtle)] px-4 py-4">
          <div className="h-3 w-28 animate-pulse rounded bg-[var(--surface-panel)]/90" />
          <div className="mt-2 h-4 w-40 animate-pulse rounded bg-[var(--surface-panel)]/75" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="h-4 w-52 animate-pulse rounded bg-[var(--surface-subtle)]" />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-[18px] bg-[var(--surface-subtle)]/85" />
              ))}
            </div>
          </div>

          <div>
            <div className="h-4 w-60 animate-pulse rounded bg-[var(--surface-subtle)]" />
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-9 w-20 animate-pulse rounded-full bg-[var(--surface-subtle)]/85" />
              ))}
            </div>
          </div>

          <div>
            <div className="h-4 w-56 animate-pulse rounded bg-[var(--surface-subtle)]" />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-14 animate-pulse rounded-[16px] bg-[var(--surface-subtle)]/85" />
              ))}
            </div>
          </div>

          <div className="h-12 animate-pulse rounded-xl bg-[var(--surface-subtle)]" />
        </div>

        <div className="mx-auto h-4 w-36 animate-pulse rounded bg-[var(--surface-subtle)]/85" />
      </div>
    </AuthFunnelShell>
  );
}