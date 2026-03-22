import Link from "next/link";
import { signUpAction } from "@/app/_actions/auth";
import { AuthEntryShell } from "@/components/auth-entry-shell";
import { FormSubmitButton } from "@/components/form-submit-button";

type SignUpPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <AuthEntryShell
      mode="sign-up"
      eyebrow="Create account"
      title="Create the workspace account."
      description="Start with a work email, continue through verification, then enter a calmer operator setup flow before the dashboard opens up."
      asideTitle="The first-run path should feel premium before the user ever sees a table."
      asideBody="This onboarding flow is intentionally staged around trust and product readiness: create the account, confirm the email, answer a few setup questions, then land inside the operator workspace."
      stats={[
        { label: "Step 1", value: "Email", note: "Anchor the workspace to a clear work identity first." },
        { label: "Step 2", value: "Verify", note: "Confirm trust before the product opens wider." },
        { label: "Step 3", value: "Onboard", note: "Shape the handoff into agents and routing." },
      ]}
    >
      {resolvedSearchParams?.error ? (
        <div className="mb-5 rounded-[20px] border border-[color:rgba(210,120,80,0.18)] bg-[var(--warning-soft)] px-4 py-3 text-sm text-[var(--text-body)]">
          A work email is required to create a demo workspace.
        </div>
      ) : null}

      <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-md)] sm:p-7">
        <div className="mb-5 rounded-[18px] bg-[var(--surface-subtle)] px-4 py-4">
          <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-subtle)]">What happens next</div>
          <p className="mt-2 text-[0.8rem] leading-6 text-[var(--text-body)]">
            After account creation, the funnel continues into secure account, email verification, and a lightweight onboarding survey before the user reaches the workspace.
          </p>
        </div>

        <button
          type="button"
          disabled
          aria-disabled="true"
          className="flex h-12 w-full items-center justify-center rounded-xl border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-[0.98rem] font-medium tracking-[-0.01em] text-[var(--text-strong)] opacity-85"
          title="Google auth is not wired yet"
        >
          <svg className="mr-2 h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="mb-6 mt-3 text-center text-[0.72rem] text-[var(--text-subtle)]">
          Google sign-up is a visual placeholder until production auth is wired.
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--border-soft)]" />
          <span className="text-[0.68rem] uppercase text-[var(--text-subtle)]">or</span>
          <div className="h-px flex-1 bg-[var(--border-soft)]" />
        </div>

        <form action={signUpAction} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--text-body)]">Full name</span>
            <input
              type="text"
              name="name"
              placeholder="Jane Smith"
              className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--text-body)]">Work email</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-[var(--text-body)]">Password</span>
            <input
              type="password"
              name="password"
              disabled
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] opacity-60 outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)]"
            />
            <p className="text-[0.68rem] text-[color:rgba(124,129,139,0.6)]">Password auth remains staged behind the email-first demo flow.</p>
          </label>

          <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 text-[0.76rem] leading-6 text-[var(--text-body)]">
            This flow creates the demo workspace account first, then moves into secure account and 6-digit email verification before onboarding.
          </div>

          <FormSubmitButton
            label="Create account"
            pendingLabel="Creating workspace…"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--text-strong)] px-4 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)] disabled:cursor-wait disabled:opacity-75"
          />
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-subtle)]">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-[var(--text-strong)] transition-colors hover:underline hover:underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </AuthEntryShell>
  );
}
