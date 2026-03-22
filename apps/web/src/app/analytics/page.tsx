import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { requireSession } from "@/lib/auth";
import { listRecentCallsForUser } from "@/lib/call-data";
import { getDashboardMetrics } from "@/lib/dashboard-data";

const attentionStatuses = new Set(["FAILED", "NO_ANSWER", "BUSY", "CANCELED"]);
const activeStatuses = new Set(["QUEUED", "RINGING", "IN_PROGRESS"]);
const focusOptions = ["ALL", "RESOLVED", "ATTENTION", "ACTIVE"] as const;

type AnalyticsPageProps = {
  searchParams?: Promise<{
    q?: string;
    focus?: string;
  }>;
};

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

function formatDuration(seconds: number | null) {
  if (!seconds || seconds <= 0) {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${String(remainingSeconds).padStart(2, "0")}s`;
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${Math.round(value)}%`;
}

function matchesFocus(status: string, focus: string) {
  if (focus === "RESOLVED") {
    return status === "COMPLETED";
  }

  if (focus === "ATTENTION") {
    return attentionStatuses.has(status);
  }

  if (focus === "ACTIVE") {
    return activeStatuses.has(status);
  }

  return true;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const session = await requireSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() || "";
  const focus = resolvedSearchParams?.focus?.trim().toUpperCase() || "ALL";
  const normalizedFocus = focusOptions.includes(focus as (typeof focusOptions)[number]) ? focus : "ALL";

  const [metrics, recentCalls] = await Promise.all([
    getDashboardMetrics(session.email),
    listRecentCallsForUser(session.email, { query }),
  ]);

  const visibleCalls = recentCalls.filter((call) => matchesFocus(call.status, normalizedFocus));
  const completedCalls = visibleCalls.filter((call) => call.status === "COMPLETED");
  const attentionCalls = visibleCalls.filter((call) => attentionStatuses.has(call.status));
  const activeCalls = visibleCalls.filter((call) => activeStatuses.has(call.status));
  const resolvedCalls = visibleCalls.filter((call) => !activeStatuses.has(call.status));
  const totalDurationSeconds = visibleCalls.reduce((sum, call) => sum + (call.durationSeconds ?? 0), 0);
  const averageDurationSeconds = visibleCalls.length > 0 ? Math.round(totalDurationSeconds / visibleCalls.length) : 0;
  const completionRate = resolvedCalls.length > 0 ? (completedCalls.length / resolvedCalls.length) * 100 : 0;
  const attentionRate = visibleCalls.length > 0 ? (attentionCalls.length / visibleCalls.length) * 100 : 0;
  const toolActionRate = metrics.callsToday > 0 ? metrics.toolActionsToday / metrics.callsToday : 0;
  const hasFilters = Boolean(query || normalizedFocus !== "ALL");

  const dayBuckets = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));

    const count = visibleCalls.filter((call) => {
      const callDate = new Date(call.createdAt);
      callDate.setHours(0, 0, 0, 0);
      return callDate.getTime() === date.getTime();
    }).length;

    return {
      key: date.toISOString(),
      label: date.toLocaleDateString([], { weekday: "short" }),
      count,
    };
  });

  const maxBucketCount = Math.max(...dayBuckets.map((bucket) => bucket.count), 1);

  const agentRows = Array.from(
    visibleCalls.reduce(
      (map, call) => {
        const label = call.agentName || "Unassigned agent";
        const entry = map.get(label) ?? {
          agentName: label,
          calls: 0,
          completed: 0,
          attention: 0,
          totalDurationSeconds: 0,
        };

        entry.calls += 1;
        entry.totalDurationSeconds += call.durationSeconds ?? 0;

        if (call.status === "COMPLETED") {
          entry.completed += 1;
        }

        if (attentionStatuses.has(call.status)) {
          entry.attention += 1;
        }

        map.set(label, entry);
        return map;
      },
      new Map<
        string,
        {
          agentName: string;
          calls: number;
          completed: number;
          attention: number;
          totalDurationSeconds: number;
        }
      >(),
    ),
  )
    .map(([, entry]) => ({
      ...entry,
      averageDurationSeconds: entry.calls > 0 ? Math.round(entry.totalDurationSeconds / entry.calls) : 0,
      completionRate: entry.calls > 0 ? Math.round((entry.completed / entry.calls) * 100) : 0,
    }))
    .sort((left, right) => right.calls - left.calls)
    .slice(0, 5);

  const outcomeRows = [
    { label: "Resolved", count: completedCalls.length, tone: "bg-[var(--success-soft)] text-[#2f6f49]" },
    { label: "Needs attention", count: attentionCalls.length, tone: "bg-[var(--warning-soft)] text-[#8d6336]" },
    { label: "Active", count: activeCalls.length, tone: "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]" },
    {
      label: "Other ended",
      count: Math.max(resolvedCalls.length - completedCalls.length - attentionCalls.length, 0),
      tone: "bg-[var(--surface-subtle)] text-[var(--text-subtle)]",
    },
  ];

  return (
    <ConsoleShell
      eyebrow="Analytics"
      section="monitor"
      title="Track the call operation like a system, not a scrapbook."
      description="Use persisted call outcomes, duration signals, and tool activity to see where the runtime is healthy, noisy, or quietly leaking quality."
      userEmail={session.email}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.22fr)_minmax(320px,0.78fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
            Monitor surface
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] sm:text-[1.9rem]">
                Performance is only useful when it points to the next operational move.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                This view blends persisted call outcomes with runtime action activity so the team can see whether the system is resolving conversations cleanly, stalling midstream, or sending too much clean-up work downstream.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/calls"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Open call history
                </Link>
                <Link
                  href="/qa"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Review QA queue
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Calls today", value: metrics.callsToday.toString() },
                { label: "Tool actions today", value: metrics.toolActionsToday.toString() },
                { label: "Completion rate", value: formatPercent(completionRate) },
                { label: "Attention rate", value: formatPercent(attentionRate) },
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Signal summary</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                A compact read on what the current persisted call set is suggesting.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              {visibleCalls.length} calls in view
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Average duration",
                value: formatDuration(averageDurationSeconds),
                note: "Across the currently visible call set.",
              },
              {
                label: "Runtime posture",
                value: metrics.runtimeStatus,
                note: metrics.runtimeNote,
              },
              {
                label: "Tool density",
                value: metrics.callsToday > 0 ? `${toolActionRate.toFixed(1)} / call` : "0.0 / call",
                note: "Today’s runtime actions relative to today’s persisted calls.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                <div className="mt-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <form className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)] md:grid-cols-[1fr_180px_auto]">
          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Search calls</span>
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Caller, agent, transcript, or external ID..."
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Focus</span>
            <select
              name="focus"
              defaultValue={normalizedFocus}
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(32,36,43,0.2)]"
            >
              <option value="ALL">All calls</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ATTENTION">Needs attention</option>
              <option value="ACTIVE">Active now</option>
            </select>
          </label>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
            >
              Apply view
            </button>
            {hasFilters ? (
              <Link
                href="/analytics"
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Visible calls", value: String(visibleCalls.length), note: "Calls in the current search and focus window." },
            { label: "Resolved", value: String(completedCalls.length), note: "Completed conversations that ended cleanly." },
            { label: "Needs review", value: String(attentionCalls.length), note: "Calls whose outcomes likely deserve QA or operator follow-up." },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
            >
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--text-subtle)]">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Last 7-day volume rhythm</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                  A lightweight trend strip using persisted call timestamps. It is intentionally simple for now, but already useful enough to show whether activity is clumping, fading, or waking back up.
                </p>
              </div>
              <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                Recent persisted data
              </span>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-3">
              {dayBuckets.map((bucket) => (
                <div key={bucket.key} className="flex flex-col items-center gap-3">
                  <div className="flex h-36 w-full items-end rounded-[20px] bg-[var(--surface-subtle)]/55 px-3 py-3">
                    <div
                      className="w-full rounded-[14px] bg-[var(--text-strong)]/88 transition-all"
                      style={{ height: `${Math.max((bucket.count / maxBucketCount) * 100, bucket.count > 0 ? 18 : 6)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-[0.74rem] font-medium text-[var(--text-strong)]">{bucket.count}</div>
                    <div className="mt-1 text-[0.68rem] uppercase tracking-[0.08em] text-[var(--text-subtle)]">{bucket.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
              <div>
                <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Agent comparison</h3>
                <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                  Compare recent call quality by assigned agent so configuration differences stop hiding in transcript detail.
                </p>
              </div>
              <Link href="/agents" className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
                Open agents →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    {[
                      "Agent",
                      "Calls",
                      "Completion rate",
                      "Needs attention",
                      "Avg. duration",
                    ].map((column) => (
                      <th
                        key={column}
                        className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agentRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10">
                        <h3 className="text-lg font-semibold text-[var(--text-strong)]">No agent performance data yet</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">
                          As more persisted calls arrive, this table will compare which agents are resolving work cleanly and which ones are generating noise.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    agentRows.map((row) => (
                      <tr
                        key={row.agentName}
                        className="border-b border-[var(--border-soft)] transition-colors last:border-b-0 hover:bg-[var(--surface-subtle)]/55"
                      >
                        <td className="px-5 py-4 text-[0.84rem] font-medium text-[var(--text-strong)]">{row.agentName}</td>
                        <td className="px-5 py-4 font-mono text-[0.76rem] text-[var(--text-subtle)]">{row.calls}</td>
                        <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">{row.completionRate}%</td>
                        <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">{row.attention}</td>
                        <td className="px-5 py-4 font-mono text-[0.76rem] text-[var(--text-subtle)]">
                          {formatDuration(row.averageDurationSeconds)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Outcome mix</h3>
            <div className="mt-4 space-y-3">
              {outcomeRows.map((row) => {
                const width = visibleCalls.length > 0 ? Math.max((row.count / visibleCalls.length) * 100, row.count > 0 ? 8 : 0) : 0;

                return (
                  <div key={row.label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-[0.78rem] text-[var(--text-body)]">
                      <span>{row.label}</span>
                      <span className="font-mono text-[0.72rem] text-[var(--text-subtle)]">{row.count}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[var(--surface-subtle)]">
                      <div className={`h-2.5 rounded-full ${row.tone.split(" ")[0]}`} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Calls needing attention</h3>
            </div>
            <div className="space-y-2 p-4">
              {attentionCalls.length > 0 ? (
                attentionCalls.slice(0, 4).map((call) => (
                  <Link
                    key={call.id}
                    href={`/calls/${call.id}`}
                    className="block rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[0.6rem] ${statusPillClassName(call.status)}`}>
                        {call.status.replaceAll("_", " ")}
                      </span>
                      <span className="ml-auto text-[0.65rem] text-[var(--text-subtle)]">{call.createdAt.toLocaleString()}</span>
                    </div>
                    <div className="text-[0.74rem] font-medium text-[var(--text-strong)]">{call.callerNumber || "Unknown caller"}</div>
                    <p className="mt-1 text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">
                      {call.agentName || "Unassigned agent"} · {call.transcriptPreview || "Review the transcript to understand where the call went sideways."}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No attention calls in the current view. Delightfully boring, which is exactly what ops wants.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Recent runtime actions</h3>
            </div>
            <div className="space-y-2 p-4">
              {metrics.recentToolEvents.length > 0 ? (
                metrics.recentToolEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/calls/${event.callId}`}
                    className="block rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40"
                  >
                    <div className="text-[0.74rem] font-medium text-[var(--text-strong)]">
                      {event.text || "Runtime tool action recorded"}
                    </div>
                    <div className="mt-1 text-[0.7rem] text-[var(--text-subtle)]">
                      {event.agentName || "Unknown agent"} · {event.callerNumber || "Unknown caller"}
                    </div>
                    <div className="mt-1 text-[0.66rem] text-[var(--text-subtle)]">{event.createdAt.toLocaleString()}</div>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No recent runtime actions recorded yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Operator notes</h3>
            <div className="mt-4 space-y-3 text-[0.78rem] leading-6 text-[var(--text-body)]">
              <p>
                This scaffold already reflects real persisted calls and runtime tool events, but the trend model is still intentionally lightweight until broader historical aggregation lands.
              </p>
              <p>
                The next layer should connect anomalies here into the <Link href="/alerts" className="font-medium text-[var(--text-strong)] underline underline-offset-4">alerts</Link> and <Link href="/qa" className="font-medium text-[var(--text-strong)] underline underline-offset-4">QA</Link> workflows so this page becomes a decision surface instead of an observatory.
              </p>
            </div>
          </section>
        </div>
      </div>
    </ConsoleShell>
  );
}