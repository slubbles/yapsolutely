import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { requireSession } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/dashboard-data";

function formatDuration(value: number | null) {
  if (!value) {
    return "—";
  }

  if (value < 60) {
    return `${value}s`;
  }

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
}

function readinessTone(ready: boolean) {
  return ready
    ? "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]"
    : "border-[color:rgba(160,91,65,0.18)] bg-[var(--warning-soft)] text-[#8d6336]";
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

export default async function DashboardPage() {
  const session = await requireSession();
  const metrics = await getDashboardMetrics(session.email);

  const latestCall = metrics.recentCalls[0] ?? null;
  const launchChecks = [
    metrics.activeAgents > 0,
    metrics.assignedNumbers > 0,
    metrics.recentCalls.length > 0,
    metrics.runtimeStatus === "Online",
  ];
  const launchScore = launchChecks.filter(Boolean).length;
  const needsAttentionNow = metrics.failedCalls > 0 || metrics.runtimeStatus !== "Online";

  const workspaceCards = [
    {
      label: "Agents",
      href: "/agents",
      value: `${metrics.activeAgents} active`,
      note:
        metrics.activeAgents > 0
          ? "Open the agent workspace to refine behavior, routing, and readiness."
          : "No active agents yet — the product still needs someone to answer the phone.",
    },
    {
      label: "Numbers",
      href: "/numbers",
      value: `${metrics.assignedNumbers} assigned`,
      note:
        metrics.assignedNumbers > 0
          ? "Inbound routing already has mapped lines to inspect and tighten."
          : "No assigned numbers yet, so inbound resolution is still soft.",
    },
    {
      label: "Calls",
      href: "/calls",
      value: `${metrics.callsToday} today`,
      note:
        metrics.recentCalls.length > 0
          ? "Review conversation proof, outcomes, and transcript-led follow-up."
          : "No recent call proof yet — the next live call will make this surface matter fast.",
    },
    {
      label: "Settings",
      href: "/settings",
      value: metrics.runtimeStatus,
      note:
        metrics.runtimeStatus === "Online"
          ? "Platform posture looks healthy enough to keep moving on the demo path."
          : "Credential or database setup still deserves operator attention before live validation.",
    },
  ];

  const operatorChecklist = [
    {
      label: "Someone can answer the phone",
      ready: metrics.activeAgents > 0,
      detail:
        metrics.activeAgents > 0
          ? `${metrics.activeAgents} active agents are currently eligible to carry real traffic.`
          : "No active agents yet, so the operator path still ends before a live conversation begins.",
    },
    {
      label: "Inbound routing exists",
      ready: metrics.assignedNumbers > 0,
      detail:
        metrics.assignedNumbers > 0
          ? `${metrics.assignedNumbers} numbers are already assigned to agents for runtime lookup.`
          : "Assign at least one number so the runtime has a real inbound route to resolve.",
    },
    {
      label: "Proof loop is active",
      ready: metrics.recentCalls.length > 0,
      detail:
        metrics.recentCalls.length > 0
          ? `${metrics.recentCalls.length} recent call records are available for outcome review and follow-up.`
          : "No recent calls are visible yet, so the proof loop still needs real traffic.",
    },
    {
      label: "Platform posture looks steady",
      ready: metrics.runtimeStatus === "Online",
      detail:
        metrics.runtimeStatus === "Online"
          ? metrics.runtimeNote
          : "The dashboard is still operating in fallback mode and should not be treated as fully live-ready.",
    },
  ];

  const attentionRows = [
    {
      label: "Calls needing review",
      value: String(metrics.failedCalls),
      note:
        metrics.failedCalls > 0
          ? "Open the calls ledger and explain every failed, busy, canceled, or unanswered outcome."
          : "No immediate call cleanup queue. Deliciously uneventful.",
    },
    {
      label: "Tool actions today",
      value: String(metrics.toolActionsToday),
      note:
        metrics.toolActionsToday > 0
          ? "Recent tool activity means the runtime is doing more than just talking — it is taking actions worth reviewing."
          : "No tool action proof yet, so runtime automation is still quiet in the current window.",
    },
    {
      label: "Latest proof point",
      value: latestCall ? latestCall.status.replaceAll("_", " ") : "No recent proof",
      note: latestCall
        ? `${latestCall.agentName || "Unknown agent"} handled the most recent visible call for ${formatDuration(latestCall.durationSeconds)}.`
        : "The next real inbound call will promote this dashboard from readiness theater to evidence-led ops.",
    },
  ];

  return (
    <ConsoleShell
      eyebrow="Dashboard"
      section="dashboard"
      title="A calmer home for the voice operation."
      description="See the current state of agents, call outcomes, runtime activity, and the next places that deserve operator attention."
      userEmail={session.email}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
              Operator home
            </div>
            <div
              className={[
                "inline-flex rounded-full px-3 py-1 text-[0.68rem] font-medium",
                launchScore === launchChecks.length
                  ? "bg-[color:rgba(86,149,113,0.16)] text-[#bde2c7]"
                  : "bg-[color:rgba(238,189,142,0.16)] text-[#f1d4b4]",
              ].join(" ")}
            >
              {launchScore === launchChecks.length
                ? `Operator-ready basics · ${launchScore}/${launchChecks.length}`
                : `Needs setup · ${launchScore}/${launchChecks.length}`}
            </div>
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] sm:text-[1.9rem]">
                The dashboard should tell the operator where to look first, not just dump polite numbers on the floor.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                This home now pulls together runtime posture, routing readiness, recent proof, and the fastest next moves into the rest of the workspace. In short: calmer triage, less wandering.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/calls"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Review call proof
                </Link>
                <Link
                  href="/agents"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Open agent workspace
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Active agents", value: metrics.activeAgents.toString() },
                { label: "Assigned numbers", value: metrics.assignedNumbers.toString() },
                { label: "Calls today", value: metrics.callsToday.toString() },
                { label: "Tool actions", value: metrics.toolActionsToday.toString() },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(229,226,225,0.48)]">
                    {item.label}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-[var(--surface-dark-foreground)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Runtime posture</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
              <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">Status</div>
              <div className="mt-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{metrics.runtimeStatus}</div>
              <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{metrics.runtimeNote}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Completed calls", value: metrics.completedCalls.toString() },
                { label: "Needs attention", value: metrics.failedCalls.toString() },
              ].map((item) => (
                <div key={item.label} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-3">
                  <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                  <div className="mt-1 text-[0.88rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">Immediate attention</div>
                <span className={`inline-flex rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${needsAttentionNow ? "border-[color:rgba(160,91,65,0.18)] bg-[var(--warning-soft)] text-[#8d6336]" : "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]"}`}>
                  {needsAttentionNow ? "Review now" : "Calm"}
                </span>
              </div>
              <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">
                {needsAttentionNow
                  ? "Either the call outcomes or platform posture suggest operator eyes are warranted before the next live demo loop."
                  : "Nothing obvious is on fire. A rare and beautiful operational mood."}
              </p>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workspaceCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:border-[color:rgba(22,24,29,0.12)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{card.label}</div>
            <div className="mt-2 text-[1rem] font-semibold text-[var(--text-strong)]">{card.value}</div>
            <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{card.note}</p>
            <div className="mt-4 text-[0.74rem] font-medium text-[var(--text-subtle)]">Open {card.label.toLowerCase()} →</div>
          </Link>
        ))}
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
            <div>
              <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Recent call proof</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                The freshest persisted call records, including status and runtime tool activity.
              </p>
            </div>
            <Link href="/calls" className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
              Open calls →
            </Link>
          </div>

          {metrics.recentCalls.length === 0 ? (
            <div className="px-5 py-6 text-[0.8rem] leading-6 text-[var(--text-subtle)]">
              No recent calls yet. Once the runtime persists more real activity, this area becomes the operator proof surface.
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-soft)]">
              {metrics.recentCalls.map((call) => (
                <Link
                  key={call.id}
                  href={`/calls/${call.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[var(--surface-subtle)]/55"
                >
                  <div>
                    <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{call.callerNumber || "Unknown caller"}</div>
                    <div className="mt-1 text-[0.74rem] text-[var(--text-subtle)]">
                      {call.agentName || "Unassigned agent"} · {call.createdAt.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[0.7rem] text-[var(--text-subtle)]">{formatDuration(call.durationSeconds)}</span>
                    <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${statusPillClassName(call.status)}`}>
                      {call.status.replaceAll("_", " ")}
                    </span>
                    <span className="text-[0.7rem] text-[var(--text-subtle)]">Tools: {call.toolEvents}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Operator checklist</h3>
                <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                  A fast read on whether the product is behaving like a real voice operation instead of a very stylish draft.
                </p>
              </div>
              <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                {launchScore}/{launchChecks.length}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {operatorChecklist.map((item) => (
                <div key={item.label} className={["rounded-[18px] border px-4 py-4", readinessTone(item.ready)].join(" ")}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[0.82rem] font-medium">{item.label}</div>
                    <div className="text-[0.68rem] uppercase tracking-[0.14em]">{item.ready ? "Ready" : "Needs work"}</div>
                  </div>
                  <p className="mt-2 text-[0.76rem] leading-6 opacity-90">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Attention queue</h3>
            <div className="mt-4 space-y-3">
              {attentionRows.map((item) => (
                <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                  <div className="mt-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                  <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Recent runtime actions</h3>
            <div className="mt-4 space-y-3">
              {metrics.recentToolEvents.length === 0 ? (
                <div className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 text-[0.78rem] leading-6 text-[var(--text-subtle)]">
                  No tool activity recorded yet.
                </div>
              ) : (
                metrics.recentToolEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/calls/${event.callId}`}
                    className="block rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 transition hover:bg-[var(--surface-subtle)]"
                  >
                    <div className="text-[0.78rem] font-medium text-[var(--text-strong)]">
                      {event.text || "Runtime tool action recorded"}
                    </div>
                    <div className="mt-2 text-[0.72rem] text-[var(--text-subtle)]">
                      {event.agentName || "Unknown agent"} · {event.callerNumber || "Unknown caller"}
                    </div>
                    <div className="mt-1 text-[0.68rem] text-[var(--text-subtle)]">{event.createdAt.toLocaleString()}</div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Next best actions</h3>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link href="/agents/new" className="rounded-[16px] bg-[var(--text-strong)] px-4 py-3 text-center text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]">
                Create agent
              </Link>
              <Link href="/numbers" className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-center text-[0.8rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]">
                Review number routing
              </Link>
              <Link href="/settings" className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-center text-[0.8rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]">
                Check readiness
              </Link>
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
            <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.56)]">Operator note</div>
            <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.03em]">
              A good dashboard reduces wandering before work begins.
            </h3>
            <p className="mt-3 text-[0.82rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
              Agents shape behavior, numbers own routing, calls preserve proof, and settings decide whether live validation is honest. This home now points toward that loop instead of acting like a decorative lobby.
            </p>
          </section>
        </div>
      </div>
    </ConsoleShell>
  );
}
