import Link from "next/link";

const agents = [
  { name: "Inbound Sales", active: true },
  { name: "Support — Tier 1", active: true },
  { name: "Appointment Booking", active: false },
];

const calls = [
  { number: "+1 (415) 555-0142", duration: "4:23", status: "Completed" },
  { number: "+1 (212) 555-0198", duration: "2:17", status: "Completed" },
  { number: "+1 (310) 555-0067", duration: "6:51", status: "Flagged" },
];

export function LandingHero() {
  return (
    <section className="px-5 pb-16 pt-28 sm:px-6 sm:pb-28 sm:pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-end lg:gap-12">
          <div className="lg:pb-10">
            <div className="inline-flex rounded-full border border-black/6 bg-white/70 px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-subtle)] shadow-[var(--shadow-sm)] backdrop-blur-sm">
              Voice operations, art directed
            </div>

            <h1 className="mt-6 font-display text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--text-strong)] sm:text-[3.6rem] lg:text-[5.4rem]">
              Build the agent.
              <br />
              Route the number.
              <br />
              Prove every call.
            </h1>

            <p className="mt-6 max-w-xl text-[0.98rem] leading-8 text-[var(--text-body)] sm:text-[1.06rem]">
              Yapsolutely gives operators one calm system for configuring voice agents, mapping phone lines, and reviewing transcripts, outcomes, and runtime actions without wandering between tools.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-in"
                className="font-display rounded-full bg-[var(--text-strong)] px-6 py-3.5 text-center text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
              >
                Start building
              </Link>
              <a
                href="#workflow"
                className="font-body rounded-full border border-[var(--border-soft)] bg-[var(--surface-panel)] px-6 py-3.5 text-center text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--surface-subtle)]"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Build",
                  value: "Agents, prompts, tools",
                  note: "Shape exactly what the caller hears and what the runtime can do next.",
                },
                {
                  label: "Deploy",
                  value: "Numbers, routing, readiness",
                  note: "Map each line to a real operator path before the first live call arrives.",
                },
                {
                  label: "Monitor",
                  value: "Transcripts, QA, alerts",
                  note: "Review outcomes fast enough that the operation keeps getting sharper.",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-black/5 bg-white/72 px-4 py-4 shadow-[var(--shadow-sm)] backdrop-blur-sm">
                  <div className="text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-subtle)]">{item.label}</div>
                  <div className="mt-2 text-[0.86rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                  <p className="mt-2 text-[0.75rem] leading-6 text-[var(--text-subtle)]">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-8 hidden rounded-[24px] border border-black/5 bg-white/85 px-4 py-4 shadow-[var(--shadow-lg)] backdrop-blur-sm lg:block">
              <div className="text-[0.62rem] uppercase tracking-[0.16em] text-[var(--text-subtle)]">Today&apos;s posture</div>
              <div className="mt-2 text-[1.5rem] font-semibold tracking-[-0.03em] text-[var(--text-strong)]">91% resolved</div>
              <p className="mt-2 max-w-[13rem] text-[0.72rem] leading-6 text-[var(--text-subtle)]">
                Calls, tools, and follow-up proof living in one place instead of four nervous dashboards.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-[var(--surface-dark)] p-5 shadow-[var(--shadow-xl)] sm:rounded-[2.4rem] sm:p-8 md:p-10">
              <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_68%)]" />
              <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-[0.84fr_1.16fr] sm:gap-6">
                <div className="rounded-[1.5rem] bg-white/5 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-[0.65rem] uppercase tracking-[0.15em] text-white/30">Agents</div>
                    <div className="text-[0.68rem] text-white/20">3 live paths</div>
                  </div>
                  <div className="space-y-2">
                    {agents.map((agent, index) => (
                      <div
                        key={agent.name}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                          index === 0
                            ? "border-white/10 bg-white/10 text-white"
                            : "border-white/6 bg-white/[0.03] text-white/42"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${agent.active ? "bg-emerald-400" : "bg-white/15"}`} />
                        {agent.name}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-3 text-[0.72rem] leading-6 text-white/42">
                    Every line keeps its own voice, routing, and follow-up behavior.
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.5rem] bg-white/5 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-[0.65rem] uppercase tracking-[0.15em] text-white/30">Call review</div>
                      <div className="text-xs text-white/20">Mar 21</div>
                    </div>
                    <div className="space-y-1.5">
                      {calls.map((call) => (
                        <div key={call.number} className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3 text-sm">
                          <div className="flex items-center gap-3">
                            <span className="text-white/20">☎</span>
                            <span className="font-mono text-[0.65rem] text-white/52 sm:text-xs">{call.number}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="hidden text-xs text-white/20 sm:inline">{call.duration}</span>
                            <span className={`text-xs ${call.status === "Flagged" ? "text-amber-400/70" : "text-white/24"}`}>
                              {call.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[1.5rem] bg-white/5 p-4 sm:p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-white/20">💬</span>
                        <div className="text-[0.65rem] uppercase tracking-[0.15em] text-white/30">Transcript</div>
                      </div>
                      <div className="space-y-2 text-sm text-white/45">
                        <div className="flex gap-3">
                          <span className="shrink-0 font-mono text-xs text-white/20">Agent</span>
                          <span>Good afternoon, how can I help you today?</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="shrink-0 font-mono text-xs text-white/20">Caller</span>
                          <span>I&apos;d like to schedule a walkthrough of your enterprise plan.</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] bg-white/5 p-4 sm:p-5">
                      <div className="text-[0.65rem] uppercase tracking-[0.15em] text-white/30">Runtime actions</div>
                      <div className="mt-4 space-y-3">
                        {[
                          "Lead captured",
                          "Follow-up requested",
                          "QA flag raised",
                        ].map((item) => (
                          <div key={item} className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-3 text-[0.74rem] text-white/50">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}