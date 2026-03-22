import { ConsoleShell } from "@/components/console-shell";
import { requireSession } from "@/lib/auth";
import { listRecentCallsForUser } from "@/lib/call-data";
import Link from "next/link";

const statuses = ["ALL", "QUEUED", "RINGING", "IN_PROGRESS", "COMPLETED", "FAILED", "NO_ANSWER", "BUSY", "CANCELED"];
const activeStatuses = ["QUEUED", "RINGING", "IN_PROGRESS"];
const reviewStatuses = ["FAILED", "NO_ANSWER", "BUSY", "CANCELED"];

function formatClockTime(value: Date) {
  return value.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateTime(value: Date) {
  return value.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

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

function formatStatusLabel(value: string) {
  return value.replaceAll("_", " ");
}

function statusNarrative(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Conversation finished and persisted cleanly.";
    case "IN_PROGRESS":
    case "RINGING":
    case "QUEUED":
      return "Still moving through the live runtime path.";
    case "FAILED":
      return "Runtime or delivery failed before a clean finish.";
    case "NO_ANSWER":
      return "Caller never reached a real connected conversation.";
    case "BUSY":
      return "Carrier reported the line as busy during the attempt.";
    default:
      return "Call ended before the happy path could complete.";
  }
}

function reviewTone(status: string) {
  if (reviewStatuses.includes(status)) {
    return {
      label: "Needs review",
      className: "bg-[var(--warning-soft)] text-[#8d6336]",
    };
  }

  if (activeStatuses.includes(status)) {
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

type CallsPageProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
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

export default async function CallsPage({ searchParams }: CallsPageProps) {
  const session = await requireSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() || "";
  const requestedStatus = resolvedSearchParams?.status?.trim().toUpperCase() || "ALL";
  const status = statuses.includes(requestedStatus) ? requestedStatus : "ALL";
  const calls = await listRecentCallsForUser(session.email, {
    query,
    status: status === "ALL" ? "" : status,
  });
  const hasFilters = Boolean(query || (status && status !== "ALL"));
  const flaggedCalls = calls.filter((call) => reviewStatuses.includes(call.status)).slice(0, 4);
  const completedCount = calls.filter((call) => call.status === "COMPLETED").length;
  const activeCount = calls.filter((call) => activeStatuses.includes(call.status)).length;
  const reviewCount = calls.filter((call) => reviewStatuses.includes(call.status)).length;
  const transcriptCount = calls.filter((call) => Boolean(call.transcriptPreview)).length;
  const avgDurationSeconds = calls.filter((call) => typeof call.durationSeconds === "number").length
    ? Math.round(
        calls
          .filter((call) => typeof call.durationSeconds === "number")
          .reduce((sum, call) => sum + (call.durationSeconds ?? 0), 0) /
          calls.filter((call) => typeof call.durationSeconds === "number").length,
      )
    : 0;
  const transcriptCoverageRate = calls.length > 0 ? Math.round((transcriptCount / calls.length) * 100) : 0;
  const outcomeRows = [
    ["Completed", completedCount],
    ["Live now", activeCount],
    ["Needs review", reviewCount],
    ["With transcript", transcriptCount],
  ];
  const reviewChecklist = [
    {
      title: "Review failed or abandoned calls",
      done: reviewCount === 0,
      note: "Failed, busy, canceled, and no-answer outcomes should be explainable before the next demo loop.",
    },
    {
      title: "Keep transcript proof visible",
      done: calls.length === 0 ? false : transcriptCount === calls.length,
      note: "Transcript previews make the list feel like proof, not just call metadata with better lighting.",
    },
    {
      title: "Watch live queue pressure",
      done: activeCount < 3,
      note: "A small live queue is healthy. A crowded one usually deserves a closer runtime look.",
    },
    {
      title: "Preserve agent attribution",
      done: calls.every((call) => Boolean(call.agentName)),
      note: "Every visible conversation should make it obvious which agent owned the interaction.",
    },
  ];

  return (
    <ConsoleShell
      section="calls"
      eyebrow="Calls"
      title="Show the proof after every conversation."
      description="This is the review surface: search calls, scan outcomes, and jump into transcript detail when something needs attention."
      userEmail={session.email}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
            Monitor surface
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] sm:text-[1.9rem]">
                Call proof gets much calmer when outcomes, transcript signals, and follow-up risk live in one ledger.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                Use this monitor workspace to review every conversation, spot the ones that deserve operator eyes, and jump straight into transcript detail before a shaky runtime story turns into demo folklore.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/dashboard"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Back to dashboard
                </Link>
                <Link
                  href="/calls/demo-call"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Preview detail state
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Visible calls", value: String(calls.length) },
                { label: "Needs review", value: String(reviewCount) },
                { label: "Live now", value: String(activeCount) },
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
                A compact read on whether the visible call set looks healthy, live, or worth triaging right away.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              Avg. {formatDuration(avgDurationSeconds)}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Completion ratio",
                value: `${completedCount}/${calls.length || 0}`,
                note: "Completed calls are the fastest signal that routing, runtime, and persistence all behaved themselves together.",
              },
              {
                label: "Transcript coverage",
                value: `${transcriptCount}/${calls.length || 0}`,
                note: "Transcript previews keep the list rooted in actual evidence instead of status pills with vibes.",
              },
              {
                label: "Follow-up queue",
                value: `${reviewCount} calls`,
                note: "Anything failed, busy, canceled, or unanswered should be easy to explain before live validation gets louder.",
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

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)]">
        <form className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)] md:grid-cols-[1fr_180px_auto]">
          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Search calls</span>
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Caller, agent, transcript text, or external ID..."
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Status</span>
            <select
              name="status"
              defaultValue={status}
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(32,36,43,0.2)]"
            >
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {value === "ALL" ? "All statuses" : formatStatusLabel(value)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
            >
              Apply filters
            </button>
            {hasFilters ? (
              <Link
                href="/calls"
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Visible conversations",
              value: String(calls.length),
              note: "Rows in the current search and status view.",
            },
            {
              label: "Transcript previews",
              value: String(transcriptCount),
              note: "Calls already carrying enough transcript signal for fast triage.",
            },
            {
              label: "Avg. duration",
              value: formatDuration(avgDurationSeconds),
              note: "A quick sanity check on whether calls are ending too early or running strangely long.",
            },
          ].map((item) => (
            <div key={item.label} className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--text-subtle)]">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
              <div>
                <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Conversation ledger</h3>
                <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                  Searchable call proof with route context, transcript clues, and quick access into full detail.
                </p>
              </div>
              <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                {calls.length} visible rows
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    {[
                      "Call",
                      "Route",
                      "Agent",
                      "Transcript proof",
                      "Duration",
                      "Status",
                      "Started",
                    ].map((column) => (
                      <th key={column} className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calls.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10">
                        <h2 className="text-lg font-semibold text-[var(--text-strong)]">
                          {hasFilters ? "No calls matched those filters" : "No calls yet"}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">
                          {hasFilters
                            ? "Try broadening the query or clearing the filters. This view checks caller numbers, called numbers, agent names, transcript text, summaries, and external IDs."
                            : "Call records will land here once the runtime persists more real conversations. This list is ready to become the proof surface after every inbound call."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3 text-sm">
                          {hasFilters ? (
                            <Link href="/calls" className="font-medium text-[var(--text-strong)] underline underline-offset-4">
                              Reset filters
                            </Link>
                          ) : null}
                          <Link href="/calls/demo-call" className="font-medium text-[var(--text-strong)] underline underline-offset-4">
                            Preview call detail state
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    calls.map((call) => {
                      const reviewBadge = reviewTone(call.status);

                      return (
                        <tr key={call.id} className="border-b border-[var(--border-soft)] transition-colors last:border-b-0 hover:bg-[var(--surface-subtle)]/55">
                          <td className="px-5 py-4">
                            <Link href={`/calls/${call.id}`} className="block hover:text-[var(--text-body)]">
                              <div className="font-mono text-[0.76rem] text-[var(--text-subtle)]">{call.externalCallId || call.id.slice(0, 8)}</div>
                              <div className="mt-1 text-[0.8rem] font-medium text-[var(--text-strong)]">{call.callerNumber || "Unknown caller"}</div>
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">
                            <div>{call.toNumber || "Unknown route"}</div>
                            <div className="mt-1 text-[0.72rem] text-[var(--text-subtle)]">Inbound destination</div>
                          </td>
                          <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">
                            <div>{call.agentName || "Unassigned"}</div>
                            <div className="mt-1 text-[0.72rem] text-[var(--text-subtle)]">{statusNarrative(call.status)}</div>
                          </td>
                          <td className="px-5 py-4 text-[0.76rem] text-[var(--text-body)]">
                            <div className="max-w-[19rem] leading-6 text-[var(--text-body)]">
                              {call.transcriptPreview || "No transcript preview yet — open detail to inspect raw runtime evidence."}
                            </div>
                          </td>
                          <td className="px-5 py-4 font-mono text-[0.76rem] text-[var(--text-subtle)]">{formatDuration(call.durationSeconds)}</td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col items-start gap-2">
                              <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${statusPillClassName(call.status)}`}>
                                {formatStatusLabel(call.status)}
                              </span>
                              <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.64rem] font-medium ${reviewBadge.className}`}>
                                {reviewBadge.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right text-[0.75rem] text-[var(--text-subtle)]">
                            <div>{formatDateTime(call.createdAt)}</div>
                            <div className="mt-1">{formatClockTime(call.createdAt)}</div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Review checklist</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
                  A lightweight operator pass so the call log stays explainable before live validation, demo reviews, or runtime tuning sessions depend on it heavily.
                </p>
              </div>
              <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                search → inspect → explain → improve
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {reviewChecklist.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.72rem] font-semibold ${item.done ? "bg-[var(--success-soft)] text-[#2f6f49]" : "bg-[var(--warning-soft)] text-[#8d6336]"}`}
                    >
                      {item.done ? "✓" : "!"}
                    </span>
                    <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{item.title}</div>
                  </div>
                  <p className="mt-3 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Transcript review contract</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                  The list is intentionally only the fast triage layer. Full transcript, tool events, lead capture, and runtime metadata still live in the call detail workspace.
                </p>
              </div>
              <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                /calls/[callId] → transcript + tool proof
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                "Use search when the operator knows part of the caller number, agent name, transcript phrase, or external call ID.",
                "Treat status pills as the top-line signal, but always lean on transcript detail before deciding why a call went sideways.",
                "Open the detail route for any failed or surprising conversation so tool actions and runtime metadata stay reviewable, not mythical.",
              ].map((item) => (
                <div key={item} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 text-[0.78rem] leading-6 text-[var(--text-body)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Flagged conversations</h3>
            </div>
            <div className="space-y-2 p-4">
              {flaggedCalls.length > 0 ? (
                flaggedCalls.map((call) => (
                  <Link key={call.id} href={`/calls/${call.id}`} className="block rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-mono text-[0.65rem] text-[var(--text-subtle)]">{call.externalCallId || call.id.slice(0, 8)}</span>
                      <span className="rounded px-1.5 py-0.5 text-[0.65rem] text-[#8d6336] bg-[var(--warning-soft)]">Needs review</span>
                      <span className="ml-auto text-[0.65rem] text-[var(--text-subtle)]">{formatClockTime(call.createdAt)}</span>
                    </div>
                    <div className="mb-0.5 text-[0.72rem] text-[var(--text-body)]">{call.agentName || "Unassigned"}</div>
                    <p className="text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">
                      {call.transcriptPreview || `${formatStatusLabel(call.status)} call needs follow-up.`}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No flagged conversations in the current result set. Delightfully boring.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Outcome mix</h3>
            </div>
            <div className="space-y-2 p-4">
              {outcomeRows.map(([label, value]) => (
                <div key={String(label)} className="flex items-center justify-between px-1 py-1.5">
                  <span className="text-[0.78rem] text-[var(--text-body)]">{label}</span>
                  <span className="font-mono text-xs text-[var(--text-subtle)]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Proof signals</h3>
            </div>
            <div className="space-y-2 p-4">
              {[
                {
                  label: "Transcript coverage",
                  value: `${transcriptCoverageRate}%`,
                  note: "Higher coverage means less guessing during review.",
                },
                {
                  label: "Current filter",
                  value: status === "ALL" ? "All statuses" : formatStatusLabel(status),
                  note: "Useful when operators are triaging one outcome class at a time.",
                },
                {
                  label: "Search query",
                  value: query || "None",
                  note: "Searches numbers, agents, transcript text, summaries, and external IDs.",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface-subtle)]/35 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[0.74rem] font-medium text-[var(--text-strong)]">{item.label}</span>
                    <span className="font-mono text-[0.68rem] text-[var(--text-subtle)]">{item.value}</span>
                  </div>
                  <p className="mt-2 text-[0.72rem] leading-6 text-[var(--text-subtle)]">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}
