const stats = [
  { label: "Today", value: "47" },
  { label: "Avg. duration", value: "3:42" },
  { label: "Resolved", value: "91%" },
];

export function LandingProductShowcase() {
  return (
    <section id="platform" className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-20 lg:grid-cols-2">
          <div className="lg:pt-4">
            <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">Inside the platform</div>
            <h2 className="font-display mb-10 text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--text-strong)] sm:text-[3.25rem]">
              One dashboard for
              <br />
              your entire voice operation
            </h2>

            <div className="space-y-10">
              {[
                {
                  title: "Agents & numbers",
                  body:
                    "Create agents, assign dedicated phone numbers, and configure routing — each agent operates independently with its own script and logic.",
                },
                {
                  title: "Transcripts & review",
                  body:
                    "Every conversation is transcribed and indexed. Search across calls, flag moments for follow-up, and export data when you need it.",
                },
                {
                  title: "Call logs & performance",
                  body:
                    "Track duration, disposition, and volume across all agents. See which calls were resolved, which were flagged, and where to improve.",
                },
              ].map((item, index) => (
                <div key={item.title}>
                  {index > 0 ? <div className="mb-10 h-px w-10 bg-black/10" /> : null}
                  <h3 className="font-display mb-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{item.title}</h3>
                  <p className="max-w-md text-sm leading-[1.7] text-[var(--text-subtle)]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[var(--radius-panel)] border border-black/5 bg-[var(--surface-panel-muted)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
              <div className="mb-6">
                <div className="mb-5 flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-display text-sm font-medium text-[var(--text-strong)]">Inbound Sales</span>
                  <span className="ml-auto font-mono text-xs text-[color:rgba(124,129,139,0.6)]">+1 (415) 555-0142</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white p-3.5 text-center shadow-[0_8px_20px_rgba(16,24,40,0.04)] ring-1 ring-black/[0.04]">
                      <div className="font-display text-lg font-semibold text-[var(--text-strong)]">{stat.value}</div>
                      <div className="mt-0.5 text-xs text-[var(--text-subtle)]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
                <div className="rounded-xl bg-white p-4 shadow-[0_8px_20px_rgba(16,24,40,0.04)] ring-1 ring-black/[0.04]">
                  <div className="mb-3 text-[0.65rem] uppercase tracking-[0.15em] text-[color:rgba(124,129,139,0.5)]">Latest transcript</div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="mr-2 font-mono text-xs text-[color:rgba(124,129,139,0.3)]">0:00</span>
                      <span className="text-xs font-medium text-[color:rgba(22,24,29,0.5)]">Agent</span>
                      <p className="mt-0.5 text-[var(--text-subtle)]">Good afternoon. How can I help you?</p>
                    </div>
                    <div>
                      <span className="mr-2 font-mono text-xs text-[color:rgba(124,129,139,0.3)]">0:04</span>
                      <span className="text-xs font-medium text-[color:rgba(22,24,29,0.5)]">Caller</span>
                      <p className="mt-0.5 text-[var(--text-subtle)]">We need something to handle after-hours calls for our practice.</p>
                    </div>
                    <div>
                      <span className="mr-2 font-mono text-xs text-[color:rgba(124,129,139,0.3)]">0:12</span>
                      <span className="text-xs font-medium text-[color:rgba(22,24,29,0.5)]">Agent</span>
                      <p className="mt-0.5 text-[var(--text-subtle)]">I can walk you through how that works. It takes about ten minutes to set up.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
                  <div className="text-[0.65rem] uppercase tracking-[0.15em] text-white/30">Operator loop</div>
                  <div className="mt-4 space-y-3">
                    {[
                      "Calls route into the right agent and number pair.",
                      "Transcripts and outcomes arrive back in the dashboard.",
                      "Flags, QA, and follow-up actions become visible fast.",
                    ].map((item) => (
                      <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[0.76rem] leading-6 text-white/60">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[var(--radius-card)] border border-black/5 bg-white px-5 py-5 shadow-[var(--shadow-sm)]">
                <div className="text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-subtle)]">Build · deploy · monitor</div>
                <p className="mt-3 text-[0.88rem] leading-7 text-[var(--text-body)]">
                  The product is designed so the same operator can configure the agent, ship the phone routing, and review proof without leaving the system.
                </p>
              </div>
              <div className="rounded-[var(--radius-card)] border border-black/5 bg-[var(--surface-panel-muted)] px-5 py-5 shadow-[var(--shadow-sm)]">
                <div className="text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-subtle)]">Why that matters</div>
                <p className="mt-3 text-[0.88rem] leading-7 text-[var(--text-body)]">
                  A voice platform stops feeling like a demo when configuration, routing, transcripts, and follow-up proof all belong to one calm operating loop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}