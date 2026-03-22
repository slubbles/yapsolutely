import { ReactNode } from "react";

type AuthFunnelShellProps = {
  step: number;
  totalSteps: number;
  eyebrow: string;
  title: string;
  description: string;
  asideTitle: string;
  asideBody: string;
  children: ReactNode;
};

export function AuthFunnelShell({
  step,
  totalSteps,
  eyebrow,
  title,
  description,
  asideTitle,
  asideBody,
  children,
}: AuthFunnelShellProps) {
  return (
    <main className="flex min-h-screen bg-[var(--canvas)]">
      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-[520px]">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2 shadow-[var(--shadow-sm)]">
            <span className="font-display text-sm font-semibold tracking-[-0.02em] text-[var(--text-strong)]">
              Yapsolutely
            </span>
            <span className="h-1 w-1 rounded-full bg-[var(--text-subtle)]/45" />
            <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
              Step {step} of {totalSteps}
            </span>
          </div>

          <div className="mb-10">
            <div className="inline-flex rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
              {eyebrow}
            </div>
            <h1 className="font-display mt-4 text-[1.95rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--text-strong)] sm:text-[2.35rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-7 text-[var(--text-subtle)]">{description}</p>
          </div>

          <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-md)] sm:p-7">
            {children}
          </div>
        </div>
      </section>

      <aside className="hidden flex-1 items-center justify-center bg-[var(--surface-dark)] p-16 lg:flex">
        <div className="max-w-sm">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
            Setup path
          </div>
          <p className="font-display mt-5 text-[1.55rem] font-semibold leading-[1.2] tracking-[-0.03em] text-[var(--surface-dark-foreground)]">
            {asideTitle}
          </p>
          <p className="mt-4 text-[0.96rem] leading-8 text-[color:rgba(229,226,225,0.42)]">
            {asideBody}
          </p>
        </div>
      </aside>
    </main>
  );
}