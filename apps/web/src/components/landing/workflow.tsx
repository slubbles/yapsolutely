const steps = [
  {
    number: "01",
    label: "Build",
    title: "Define your agent's\nbehavior and script",
    body:
      "Set the voice, tone, routing logic, and fallback rules. Configure what your agent says, when it transfers, and how it handles edge cases.",
    featured: true,
  },
  {
    number: "02",
    label: "Deploy",
    title: "Assign a number and go live",
    body:
      "Provision a phone number, attach it to your agent, and start receiving inbound calls. Push updates without downtime.",
  },
  {
    number: "03",
    label: "Monitor",
    title: "Review every call in detail",
    body:
      "Read transcripts, flag conversations, and track agent performance. Full audit trail on every interaction.",
  },
];

export function LandingWorkflow() {
  return (
    <section id="workflow" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div className="max-w-xl">
            <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">How the product works</div>
          </div>

          <p className="max-w-2xl text-[0.96rem] leading-8 text-[var(--text-body)]">
            The point is not just getting an agent live — it is making the operating loop legible enough that build choices, routing choices, and call outcomes all connect back to one system.
          </p>
        </div>

        <div className="mb-20 max-w-xl">
          <h2 className="font-display text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--text-strong)] sm:text-[3.25rem]">
            Three steps to a
            <br />
            working phone agent
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex min-h-[340px] flex-col justify-between rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-10 sm:p-14 lg:col-span-7">
            <div>
              <span className="font-mono text-xs text-white/20">{steps[0].number}</span>
              <h3 className="font-display mb-5 mt-8 whitespace-pre-line text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.025em] text-[var(--surface-dark-foreground)] sm:text-[2.25rem]">
                {steps[0].title}
              </h3>
              <p className="max-w-md text-[0.9rem] leading-[1.7] text-[color:rgba(229,226,225,0.4)]">{steps[0].body}</p>
            </div>
            <div className="mt-10 text-[0.65rem] uppercase tracking-[0.2em] text-white/15">{steps[0].label}</div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            {steps.slice(1).map((step) => (
              <div key={step.number} className="flex-1 rounded-[var(--radius-panel)] border border-black/5 bg-[var(--surface-panel-muted)] p-8 shadow-[var(--shadow-sm)] sm:p-10">
                <span className="font-mono text-xs text-[color:rgba(124,129,139,0.5)]">{step.number}</span>
                <h3 className="font-display mb-2.5 mt-5 text-xl font-semibold leading-snug tracking-[-0.02em] text-[var(--text-strong)]">
                  {step.title}
                </h3>
                <p className="text-sm leading-[1.7] text-[var(--text-subtle)]">{step.body}</p>
                <div className="mt-7 text-[0.65rem] uppercase tracking-[0.2em] text-[color:rgba(124,129,139,0.3)]">{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}