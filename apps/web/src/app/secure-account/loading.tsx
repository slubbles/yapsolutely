import { AuthFunnelShell } from "@/components/auth-funnel-shell";

export default function SecureAccountLoading() {
  return (
    <AuthFunnelShell
      step={1}
      totalSteps={3}
      eyebrow="Secure account"
      title="Loading account security step..."
      description="Preparing the email verification step before the setup funnel continues into identity confirmation."
      asideTitle="Trust signals should arrive smoothly."
      asideBody="Even this early funnel step should feel polished: clear, calm, and deliberate while the account security surface finishes loading."
    >
      <div className="space-y-5">
        <div className="rounded-[18px] bg-[var(--surface-subtle)] px-4 py-4">
          <div className="h-3 w-16 animate-pulse rounded bg-[var(--surface-panel)]/90" />
          <div className="mt-2 h-4 w-48 animate-pulse rounded bg-[var(--surface-panel)]/75" />
        </div>

        <div className="space-y-5">
          <div>
            <div className="h-4 w-28 animate-pulse rounded bg-[var(--surface-subtle)]" />
            <div className="mt-3 h-12 animate-pulse rounded-xl bg-[var(--surface-subtle)]/85" />
          </div>

          <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
            <div className="space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-[var(--surface-panel)]/80" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-[var(--surface-panel)]/70" />
            </div>
          </div>

          <div className="h-12 animate-pulse rounded-xl bg-[var(--surface-subtle)]" />
        </div>

        <div className="mx-auto h-4 w-40 animate-pulse rounded bg-[var(--surface-subtle)]/85" />
      </div>
    </AuthFunnelShell>
  );
}