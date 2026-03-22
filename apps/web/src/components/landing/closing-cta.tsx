import Link from "next/link";

export function LandingClosingCta() {
  return (
    <section id="pricing" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-8 shadow-[var(--shadow-xl)] sm:p-12 lg:p-16">
          <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
            <div>
              <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.42)]">Start with the proof path</div>
              <h2 className="mt-4 font-display text-[2rem] font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--surface-dark-foreground)] sm:text-[3.25rem]">
                Your first agent can be live in minutes,
                <br className="hidden sm:block" />
                but the real win is reviewing every call after.
              </h2>
              <p className="mt-5 max-w-xl text-[0.95rem] leading-[1.75] text-[color:rgba(229,226,225,0.42)]">
                Configure the agent, assign a number, and let the product keep the transcript, outcome, and follow-up trail visible enough that the operation actually improves.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Setup", "Agent + number + first message"],
                  ["Proof", "Transcript + QA + alerts"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-4">
                    <div className="text-[0.62rem] uppercase tracking-[0.16em] text-white/28">{label}</div>
                    <div className="mt-2 text-[0.84rem] text-[var(--surface-dark-foreground)]">{value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-in"
                  className="font-display rounded-full bg-[var(--surface-dark-foreground)] px-6 py-3.5 text-center text-sm font-medium text-[var(--surface-dark)] transition hover:bg-[color:rgba(229,226,225,0.9)]"
                >
                  Get started
                </Link>
                <button
                  type="button"
                  className="font-body rounded-full border border-white/10 bg-transparent px-6 py-3.5 text-sm font-medium text-[color:rgba(229,226,225,0.6)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Talk to us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}