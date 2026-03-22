"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AuthFunnelShell } from "@/components/auth-funnel-shell";

type OnboardingErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function OnboardingError({ error, reset }: OnboardingErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AuthFunnelShell
      step={3}
      totalSteps={3}
      eyebrow="Onboarding"
      title="The onboarding survey hit a snag."
      description="Something interrupted the final setup step before the user could enter the workspace."
      asideTitle="The final handoff should not wobble."
      asideBody="Retrying should usually recover this step. If not, return to verification and walk back through the funnel without losing the premium setup flow."
    >
      <article className="rounded-[24px] border border-[color:rgba(160,91,65,0.18)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
        <div className="inline-flex rounded-full border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8d6336]">
          Route error
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-strong)]">Unable to load onboarding right now</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">
          Retry the step first. If it keeps failing, head back to verification and continue again from there.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
          >
            Retry onboarding
          </button>
          <Link
            href="/verify-identity"
            className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
          >
            Back to verification
          </Link>
        </div>
      </article>
    </AuthFunnelShell>
  );
}