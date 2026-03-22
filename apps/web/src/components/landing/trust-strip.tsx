const capabilities = [
  "Dedicated phone numbers",
  "Full transcript review",
  "Sub-second latency",
  "Live call monitoring",
];

export function LandingTrustStrip() {
  return (
    <section className="px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 rounded-[var(--radius-panel)] border border-black/5 bg-[var(--surface-panel)] px-6 py-6 shadow-[var(--shadow-sm)] lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:px-8">
          <div>
            <div className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">Built for proof, not demo fog</div>
            <p className="mt-3 max-w-sm text-[0.88rem] leading-7 text-[var(--text-body)]">
              The product is designed to keep build, deploy, and call-review evidence visible enough that operators can trust what the system is actually doing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:justify-end">
            {capabilities.map((capability, index) => (
              <div key={capability} className="flex items-center gap-3 text-[0.8rem] tracking-wide text-[color:rgba(124,129,139,0.78)]">
                {index > 0 ? <span className="hidden h-3 w-px bg-black/10 sm:block" /> : null}
                {capability}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}