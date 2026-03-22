import Link from "next/link";
import { ReactNode } from "react";

type AuthEntryShellProps = {
  mode: "sign-in" | "sign-up";
  eyebrow: string;
  title: string;
  description: string;
  asideTitle: string;
  asideBody: string;
  stats: Array<{
    label: string;
    value: string;
    note: string;
  }>;
  children: ReactNode;
};

export function AuthEntryShell({
  mode,
  eyebrow,
  title,
  description,
  asideTitle,
  asideBody,
  stats,
  children,
}: AuthEntryShellProps) {
  return (
    <main className="flex min-h-screen bg-[var(--canvas)]">
      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-[500px]">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2 shadow-[var(--shadow-sm)]">
            <Link href="/" className="font-display text-sm font-semibold tracking-[-0.02em] text-[var(--text-strong)] transition-opacity hover:opacity-70">
              Yapsolutely
            </Link>
            <span className="h-1 w-1 rounded-full bg-[var(--text-subtle)]/45" />
            <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
              {eyebrow}
            </span>
          </div>

          <div className="mb-10">
            <div className="inline-flex rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
              {mode === "sign-in" ? "Welcome back" : "Email-first onboarding"}
            </div>
            <h1 className="font-display mt-4 text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--text-strong)] sm:text-[2.35rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-[0.96rem] leading-7 text-[var(--text-subtle)]">{description}</p>
          </div>

          {children}
        </div>
      </section>

      <aside className="hidden flex-1 items-center justify-center bg-[var(--surface-dark)] p-16 lg:flex">
        <div className="max-w-[30rem]">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
            Operator path
          </div>
          <p className="font-display mt-5 text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.035em] text-[var(--surface-dark-foreground)]">
            {asideTitle}
          </p>
          <p className="mt-4 max-w-xl text-[0.98rem] leading-8 text-[color:rgba(229,226,225,0.42)]">
            {asideBody}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-4">
                <div className="text-[0.62rem] uppercase tracking-[0.14em] text-[color:rgba(229,226,225,0.42)]">{item.label}</div>
                <div className="mt-2 text-[1.15rem] font-semibold text-[var(--surface-dark-foreground)]">{item.value}</div>
                <p className="mt-2 text-[0.72rem] leading-6 text-[color:rgba(229,226,225,0.45)]">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.5)]">Why the funnel exists</div>
            <p className="mt-3 text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
              The product should feel trustworthy before the dashboard ever appears: email first, verification second, onboarding third, then the operator workspace.
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}