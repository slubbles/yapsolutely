import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { AgentWorkspaceHeader } from "@/components/agent-workspace-header";
import { getAgentByIdForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";

type AgentMonitorPageProps = {
  params: Promise<{
    agentId: string;
  }>;
};

function formatDateTime(value: Date | null | undefined) {
  if (!value) {
    return "—";
  }

  return value.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number | null | undefined) {
  if (typeof seconds !== "number") {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function statusPillClassName(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-[var(--success-soft)] text-[#2f6f49]";
    case "IN_PROGRESS":
    case "RINGING":
    case "QUEUED":
      return "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]";
    case "BUSY":
    case "NO_ANSWER":
    case "CANCELED":
      return "bg-[var(--warning-soft)] text-[#8d6336]";
    default:
      return "bg-[var(--danger-soft)] text-[#8b4a4a]";
  }
}

function reviewTone(status: string) {
  if (["FAILED", "NO_ANSWER", "BUSY", "CANCELED"].includes(status)) {
    return {
      label: "Needs review",
      className: "bg-[var(--warning-soft)] text-[#8d6336]",
    };
  }

  if (["IN_PROGRESS", "RINGING", "QUEUED"].includes(status)) {
    return {
      label: "Live now",
      className: "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]",
    };
  }

  return {
    label: "Recorded",
    className: "bg-[var(--success-soft)] text-[#2f6f49]",
  };
}

export default async function AgentMonitorPage({ params }: AgentMonitorPageProps) {
  const session = await requireSession();
  const { agentId } = await params;
  const agent = await getAgentByIdForUser(session.email, agentId);

  const completedCalls = agent?.calls.filter((call) => call.status === "COMPLETED").length ?? 0;
  const problemCalls = agent?.calls.filter((call) => ["FAILED", "NO_ANSWER", "BUSY", "CANCELED"].includes(call.status)).length ?? 0;
  const activeCalls = agent?.calls.filter((call) => ["IN_PROGRESS", "RINGING", "QUEUED"].includes(call.status)).length ?? 0;
  const transcriptCalls = agent?.calls.filter((call) => Boolean(call.transcriptText?.trim())).length ?? 0;
  const avgDurationSeconds = agent?.calls.filter((call) => typeof call.durationSeconds === "number").length
    ? Math.round(
        (agent.calls
          .filter((call) => typeof call.durationSeconds === "number")
          .reduce((sum, call) => sum + (call.durationSeconds ?? 0), 0) ?? 0) /
          agent.calls.filter((call) => typeof call.durationSeconds === "number").length,
      )
    : 0;
  const transcriptCoverageRate = agent?.calls.length ? Math.round((transcriptCalls / agent.calls.length) * 100) : 0;
  const latestCall = agent?.calls[0] ?? null;
  const reviewChecklist = [
    {
      title: "Keep failed calls explainable",
      done: problemCalls === 0,
      note: "If something failed, busy-looped, or never connected, the operator should know where to inspect next.",
    },
    {
      title: "Preserve transcript proof",
      done: (agent?.calls.length ?? 0) > 0 && transcriptCalls === (agent?.calls.length ?? 0),
      note: "Transcript coverage keeps monitoring grounded in actual conversation evidence instead of vibes and status pills.",
    },
    {
      title: "Control live queue pressure",
      done: activeCalls < 2,
      note: "A small live queue is fine. A pile-up usually means the runtime deserves attention before the next demo call.",
    },
    {
      title: "Close the iteration loop",
      done: Boolean(latestCall),
      note: "This monitor tab should always point you back into build changes or call-detail review, not leave you guessing.",
    },
  ];
  const reviewFocus = [
    {
      label: "Completion ratio",
      value: `${completedCalls}/${agent?.calls.length || 0}`,
      note: "Completed calls are the cleanest signal that routing, runtime, and persistence all cooperated.",
    },
    {
      label: "Transcript coverage",
      value: `${transcriptCalls}/${agent?.calls.length || 0}`,
      note: "Higher coverage means less storytelling and more proof when reviewing agent behavior.",
    },
    {
      label: "Average duration",
      value: formatDuration(avgDurationSeconds),
      note: "Useful for spotting calls that end suspiciously early or drag longer than the prompt intends.",
    },
  ];

  return (
    <ConsoleShell
      section="agents"
      eyebrow="Agent monitor"
      title={agent ? `Monitor ${agent.name}` : `Monitor agent ${agentId}`}
      description="Use the agent-specific performance surface to review recent outcomes without losing the larger product context."
      userEmail={session.email}
    >
      {agent ? (
        <>
          <AgentWorkspaceHeader agent={agent} currentView="monitor" />

          <div className="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
                Agent monitor
              </div>
              <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
                <div>
                  <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.04em] sm:text-[1.82rem]">
                    Monitoring should tell you what to change next, not just remind you a call happened.
                  </h2>
                  <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                    Use this workspace to judge recent outcomes, spot calls that deserve a transcript review, and push the next improvement back into the build tab before weak behavior turns into a repeated pattern.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    <Link
                      href={`/agents/${agent.id}/build`}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                    >
                      Refine build settings
                    </Link>
                    <Link
                      href="/calls"
                      className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                    >
                      Open all calls
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Visible calls", value: String(agent.calls.length) },
                    { label: "Needs review", value: String(problemCalls) },
                    { label: "Live now", value: String(activeCalls) },
                    { label: "Transcript proof", value: `${transcriptCoverageRate}%` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(229,226,225,0.48)]">{item.label}</div>
                      <div className="mt-2 text-2xl font-semibold text-[var(--surface-dark-foreground)]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Review posture</h3>
                  <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                    A compact read on whether this agent looks healthy, active, or worth triaging right away.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                  Avg. {formatDuration(avgDurationSeconds)}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {reviewFocus.map((item) => (
                  <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                    <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                    <div className="mt-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                    <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.85fr)]">
            <div className="space-y-5">
              <section className="grid gap-4 md:grid-cols-3">
                {[
                  ["Completed", completedCalls.toString(), "Calls that ended cleanly for this agent."],
                  ["Needs review", problemCalls.toString(), "Failed, busy, canceled, or unanswered calls."],
                  ["Live / queued", activeCalls.toString(), "Calls still in flight or not fully settled yet."],
                ].map(([label, value, note]) => (
                  <article key={label} className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                    <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{label}</div>
                    <div className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">{value}</div>
                    <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-subtle)]">{note}</p>
                  </article>
                ))}
              </section>

              <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Recent calls</h3>
                  <Link href="/calls" className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
                    View all →
                  </Link>
                </div>

                {agent.calls.length ? (
                  <div className="divide-y divide-[var(--border-soft)]">
                    {agent.calls.map((call) => (
                      <Link
                        key={call.id}
                        href={`/calls/${call.id}`}
                        className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-[var(--surface-subtle)]/55"
                      >
                        <div>
                          <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">
                            {call.callerNumber || call.toNumber || "Unknown caller"}
                          </div>
                          <div className="mt-1 text-[0.72rem] text-[var(--text-subtle)]">
                            {formatDateTime(call.startedAt || call.createdAt)}
                          </div>
                          <div className="mt-2 max-w-[30rem] text-[0.74rem] leading-6 text-[var(--text-body)]">
                            {call.transcriptText?.slice(0, 110) || "No transcript preview yet — open detail to inspect the full runtime evidence."}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-[0.72rem] text-[var(--text-subtle)]">{formatDuration(call.durationSeconds)}</div>
                          <div className="mt-2 flex flex-col items-end gap-2">
                            <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${statusPillClassName(call.status)}`}>
                              {call.status.replaceAll("_", " ")}
                            </span>
                            <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.64rem] font-medium ${reviewTone(call.status).className}`}>
                              {reviewTone(call.status).label}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-6 text-[0.8rem] leading-6 text-[var(--text-subtle)]">
                    No calls have been logged for this agent yet.
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Latest proof signal</h3>
                <div className="mt-4 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                  {latestCall ? (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">
                          {latestCall.callerNumber || latestCall.toNumber || "Unknown caller"}
                        </div>
                        <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${statusPillClassName(latestCall.status)}`}>
                          {latestCall.status.replaceAll("_", " ")}
                        </span>
                      </div>
                      <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">
                        Last activity landed at {formatDateTime(latestCall.startedAt || latestCall.createdAt)} with a duration of {formatDuration(latestCall.durationSeconds)}.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2.5 text-sm">
                        <Link href={`/calls/${latestCall.id}`} className="rounded-[16px] bg-[var(--text-strong)] px-4 py-3 text-[0.78rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]">
                          Open call detail
                        </Link>
                        <Link href={`/agents/${agent.id}/build`} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-[0.78rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]">
                          Iterate prompt
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p className="text-[0.78rem] leading-6 text-[var(--text-body)]">
                      No call evidence yet for this agent. The first real inbound call will turn this from a quiet workspace into a real proof loop.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Review checklist</h3>
                <div className="mt-4 space-y-3">
                  {reviewChecklist.map((item) => (
                    <div key={item.title} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.72rem] font-semibold ${item.done ? "bg-[var(--success-soft)] text-[#2f6f49]" : "bg-[var(--warning-soft)] text-[#8d6336]"}`}>
                          {item.done ? "✓" : "!"}
                        </span>
                        <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{item.title}</div>
                      </div>
                      <p className="mt-3 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
                <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.56)]">Operator note</div>
                <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.03em]">
                  Monitoring should lead back into better agent behavior.
                </h3>
                <p className="mt-3 text-[0.82rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                  This route is the bridge between transcript proof and prompt iteration. In other words: fewer mysteries, fewer “why did it say that?” moments.
                </p>
              </section>
            </div>
          </div>
        </>
      ) : null}
    </ConsoleShell>
  );
}