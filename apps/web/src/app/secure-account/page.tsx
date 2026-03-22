import Link from "next/link";
import { AuthFunnelShell } from "@/components/auth-funnel-shell";
import { requireSession } from "@/lib/auth";

export default async function SecureAccountPage() {
  const session = await requireSession();

  return (
    <AuthFunnelShell
      step={1}
      totalSteps={3}
      eyebrow="Secure account"
      title="Confirm your work email for account security."
      description="This keeps the first-run flow aligned with the premium onboarding path before you reach the workspace."
      asideTitle="Serious product, calm trust signals."
      asideBody="We confirm your workspace email before entering the dashboard so the setup flow feels intentional, secure, and closer to a real operator product than a throwaway demo shell."
    >
      <div className="mb-5 rounded-[18px] bg-[var(--surface-subtle)] px-4 py-4">
        <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-subtle)]">Verification target</div>
        <div className="mt-1 text-[0.86rem] font-medium text-[var(--text-strong)]">{session.email}</div>
      </div>

      <form action="/verify-identity" className="space-y-5">
        <input type="hidden" name="email" value={session.email} />

        <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
          <div className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-subtle)]">What this unlocks</div>
          <ul className="mt-3 space-y-2 text-[0.8rem] leading-6 text-[var(--text-body)]">
            <li>• Confirms the workspace owner before onboarding continues.</li>
            <li>• Keeps future invite, recovery, and approval flows anchored to one verified inbox.</li>
            <li>• Matches the email-first setup pattern used by modern SaaS products.</li>
          </ul>
        </div>

        <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
          <p className="text-[0.76rem] leading-6 text-[var(--text-body)]">
            In this demo flow, verification is UI-only. We’re productizing the sequence now so real email delivery and validation can drop into place later without reworking the funnel.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[var(--text-strong)] px-4 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
        >
          Send verification code
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-[var(--text-subtle)]">
        Want to change accounts?{" "}
        <Link href="/sign-in" className="font-medium text-[var(--text-strong)] hover:underline hover:underline-offset-4">
          Back to sign in
        </Link>
      </div>
    </AuthFunnelShell>
  );
}