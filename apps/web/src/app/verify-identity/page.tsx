import Link from "next/link";
import { AuthFunnelShell } from "@/components/auth-funnel-shell";
import { requireSession } from "@/lib/auth";

type VerifyIdentityPageProps = {
  searchParams?: Promise<{
    email?: string;
  }>;
};

function maskEmail(email: string) {
  const [localPart, domainPart] = email.split("@");

  if (!localPart || !domainPart) {
    return email;
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? ""}•@${domainPart}`;
  }

  return `${localPart.slice(0, 2)}${"•".repeat(Math.max(localPart.length - 2, 1))}@${domainPart}`;
}

export default async function VerifyIdentityPage({ searchParams }: VerifyIdentityPageProps) {
  const session = await requireSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const email = resolvedSearchParams?.email?.trim() || session.email;

  return (
    <AuthFunnelShell
      step={2}
      totalSteps={3}
      eyebrow="Verify identity"
      title="Enter the 6-digit code we sent."
      description="The email-code step keeps the onboarding flow credible and gives the product a more polished trust handshake."
      asideTitle="Fast enough for onboarding, structured enough for trust."
      asideBody="This verification step is currently a UI scaffold, but the route and layout are now in place for real email delivery and validation logic when provider-backed auth is wired."
    >
      <div className="mb-6 rounded-[18px] bg-[var(--surface-subtle)] px-4 py-4">
        <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-subtle)]">Verification target</div>
        <div className="mt-1 text-[0.86rem] font-medium text-[var(--text-strong)]">{maskEmail(email)}</div>
      </div>

      <form action="/onboarding" className="space-y-6">
        <input type="hidden" name="email" value={email} />
        <div>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                placeholder="0"
                className="h-12 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-subtle)] text-center text-base font-medium text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.55)] focus:border-[color:rgba(32,36,43,0.2)]"
              />
            ))}
          </div>
          <p className="mt-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
            Demo mode: any 6 digits will move you forward. We’re staging the real UX before real email-code delivery lands.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[var(--text-strong)] px-4 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
        >
          Verify and continue
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm text-[var(--text-subtle)]">
        <Link href="/secure-account" className="font-medium text-[var(--text-strong)] hover:underline hover:underline-offset-4">
          Back
        </Link>
        <button type="button" className="transition hover:text-[var(--text-strong)]">
          Resend email
        </button>
      </div>
    </AuthFunnelShell>
  );
}