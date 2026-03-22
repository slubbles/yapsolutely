import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { listAgentsForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";
import { listRecentCallsForUser } from "@/lib/call-data";

const attentionStatuses = new Set(["FAILED", "NO_ANSWER", "BUSY", "CANCELED"]);
const queueOptions = ["ALL", "ATTENTION", "COACHING", "VERIFIED"] as const;

type QaPageProps = {
  searchParams?: Promise<{
    q?: string;
    queue?: string;
  }>;
};

type ReviewLane = "attention" | "coaching" | "verified";
type Severity = "high" | "medium" | "low";

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

function laneBadge(lane: ReviewLane) {
  switch (lane) {
    case "attention":
      return { label: "Needs attention", className: "bg-[var(--warning-soft)] text-[#8d6336]" };
    case "coaching":
      return { label: "Coaching", className: "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]" };
    default:
      return { label: "Verified", className: "bg-[var(--success-soft)] text-[#2f6f49]" };
  }
}

function severityBadge(severity: Severity) {
  switch (severity) {
    case "high":
      return { label: "High", className: "bg-[var(--danger-soft)] text-[#8b4a4a]" };
    case "medium":
      return { label: "Medium", className: "bg-[var(--warning-soft)] text-[#8d6336]" };
    default:
      return { label: "Low", className: "bg-[var(--success-soft)] text-[#2f6f49]" };
  }
}

function deriveReviewItem(call: Awaited<ReturnType<typeof listRecentCallsForUser>>[number]) {
  let score = 12;
  const reasons: string[] = [];

  if (attentionStatuses.has(call.status)) {
    score += 58;
    reasons.push("Ended with a non-ideal call outcome.");
  }

  if (!call.transcriptPreview) {
    score += 18;
    reasons.push("Transcript evidence is missing or too thin.");
  }

  if (!call.agentName) {
    score += 12;
    reasons.push("Call is not clearly tied to a named agent.");
  }

  if ((call.durationSeconds ?? 0) < 45) {
    score += 10;
    reasons.push("Conversation was unusually short.");
  }

  const lane: ReviewLane = attentionStatuses.has(call.status)
    ? "attention"
    : !call.transcriptPreview || (call.durationSeconds ?? 0) < 60
      ? "coaching"
      : "verified";

  const severity: Severity = score >= 70 ? "high" : score >= 38 ? "medium" : "low";
  const nextStep =
    lane === "attention"
      ? "Review transcript and confirm whether this belongs in alerts."
      : lane === "coaching"
        ? "Check prompt clarity, transfer logic, and knowledge coverage."
        : "Mark as clean or sample for agent benchmarking.";

  return {
    ...call,
    lane,
    severity,
    score,
    reason: reasons[0] || "Healthy-looking call kept for spot-checking.",
    nextStep,
  };
}

function matchesQueue(lane: ReviewLane, queue: string) {
  if (queue === "ATTENTION") {
    return lane === "attention";
  }

  if (queue === "COACHING") {
    return lane === "coaching";
  }

  if (queue === "VERIFIED") {
    return lane === "verified";
  }

  return true;
}

export default async function QaPage({ searchParams }: QaPageProps) {
  const session = await requireSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() || "";
  const queue = resolvedSearchParams?.queue?.trim().toUpperCase() || "ALL";
  const normalizedQueue = queueOptions.includes(queue as (typeof queueOptions)[number]) ? queue : "ALL";

  const [calls, agents] = await Promise.all([
    listRecentCallsForUser(session.email, { query }),
    listAgentsForUser(session.email),
  ]);

  const reviewItems = calls.map(deriveReviewItem);
  const visibleItems = reviewItems.filter((item) => matchesQueue(item.lane, normalizedQueue));
  const highSeverityItems = visibleItems.filter((item) => item.severity === "high");
  const coachingItems = visibleItems.filter((item) => item.lane === "coaching");
  const verifiedItems = visibleItems.filter((item) => item.lane === "verified");
  const distinctAgentCount = new Set(visibleItems.map((item) => item.agentName || "Unassigned agent")).size;
  const hasFilters = Boolean(query || normalizedQueue !== "ALL");

  const rubricRows = [
    {
      title: "Accuracy and resolution",
      note: "Did the caller get a correct answer, a valid next step, or a clean handoff instead of polite nonsense?",
    },
    {
      title: "Tone and pacing",
      note: "Check whether the agent sounded controlled, helpful, and appropriately concise for the context.",
    },
    {
      title: "Operational compliance",
      note: "Make sure transfer behavior, lead capture, and route ownership worked the way the business actually expects.",
    },
  ];

  return (
    <ConsoleShell
      eyebrow="QA"
      section="monitor"
      title="Review the conversations that deserve a second look."
      description="Use a real review queue to triage risky calls, spot coaching opportunities, and keep quality work from living only inside transcript detail pages."
      userEmail={session.email}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
            Monitor surface
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] sm:text-[1.9rem]">
                QA should turn uneasy hunches into a repeatable review loop.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                This first pass uses persisted call records and explicit heuristics to build a review queue now, while leaving room for deeper rubric scoring and human sign-off later.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/calls"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Open calls
                </Link>
                <Link
                  href="/alerts"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Review alerts
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Queued reviews", value: visibleItems.length.toString() },
                { label: "High severity", value: highSeverityItems.length.toString() },
                { label: "Coaching calls", value: coachingItems.length.toString() },
                { label: "Verified clean", value: verifiedItems.length.toString() },
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
              <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Queue posture</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                What the current review set suggests before a human reviewer dives deeper.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              Heuristic triage
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Coverage",
                value: `${distinctAgentCount} agents in view`,
                note: "Distinct agents represented in the current QA queue.",
              },
              {
                label: "Likely escalations",
                value: `${visibleItems.filter((item) => item.lane === "attention").length} calls`,
                note: "Calls that probably deserve alert linkage or stronger follow-up.",
              },
              {
                label: "Sampling posture",
                value: verifiedItems.length > 0 ? `${verifiedItems.length} clean calls ready` : "No clean samples yet",
                note: "Healthy calls should still be sampled so good behavior becomes teachable, not accidental.",
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
            <span className="text-sm font-medium text-[var(--text-body)]">Search review queue</span>
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Caller, agent, transcript, or call ID..."
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Queue</span>
            <select
              name="queue"
              defaultValue={normalizedQueue}
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(32,36,43,0.2)]"
            >
              <option value="ALL">All reviews</option>
              <option value="ATTENTION">Needs attention</option>
              <option value="COACHING">Coaching</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </label>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
            >
              Apply queue
            </button>
            {hasFilters ? (
              <Link
                href="/qa"
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Visible reviews", value: String(visibleItems.length), note: "Items in the current QA filter set." },
            { label: "Tracked agents", value: String(distinctAgentCount), note: "How many agents are represented in the queue." },
            { label: "Workspace agents", value: String(agents.length), note: "Total agent records available for this user." },
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
          <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
              <div>
                <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Review queue</h3>
                <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                  A first-pass triage queue built from persisted calls. The rules are simple on purpose so the scoring stays legible.
                </p>
              </div>
              <Link href="/analytics" className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
                Open analytics →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px]">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    {[
                      "Call",
                      "Agent",
                      "Status",
                      "QA lane",
                      "Severity",
                      "Score",
                      "Next step",
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
                  {visibleItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10">
                        <h3 className="text-lg font-semibold text-[var(--text-strong)]">
                          {hasFilters ? "No review items matched those filters" : "No QA items yet"}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">
                          {hasFilters
                            ? "Try clearing the queue filter or broadening the search query. This view searches the same persisted call fields as the main calls table."
                            : "Once calls persist into the workspace, this queue turns them into triageable QA work instead of leaving quality review to memory and vibes."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    visibleItems.map((item) => {
                      const lane = laneBadge(item.lane);
                      const severity = severityBadge(item.severity);

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-[var(--border-soft)] transition-colors last:border-b-0 hover:bg-[var(--surface-subtle)]/55"
                        >
                          <td className="px-5 py-4">
                            <Link href={`/calls/${item.id}`} className="block hover:text-[var(--text-body)]">
                              <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{item.callerNumber || "Unknown caller"}</div>
                              <div className="mt-1 font-mono text-[0.7rem] text-[var(--text-subtle)]">
                                {item.externalCallId || item.id.slice(0, 8)} · {item.createdAt.toLocaleString()}
                              </div>
                              <div className="mt-1 text-[0.72rem] leading-6 text-[var(--text-body)]">{item.reason}</div>
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">{item.agentName || "Unassigned agent"}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${statusPillClassName(item.status)}`}>
                              {item.status.replaceAll("_", " ")}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${lane.className}`}>
                              {lane.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${severity.className}`}>
                              {severity.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-[0.76rem] text-[var(--text-subtle)]">{item.score}</td>
                          <td className="px-5 py-4 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.nextStep}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Rubric focus</h3>
            <div className="mt-4 space-y-3">
              {rubricRows.map((row) => (
                <div key={row.title} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                  <div className="text-[0.8rem] font-medium text-[var(--text-strong)]">{row.title}</div>
                  <p className="mt-2 text-[0.74rem] leading-6 text-[var(--text-body)]">{row.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Clean-call sampling</h3>
            </div>
            <div className="space-y-2 p-4">
              {verifiedItems.length > 0 ? (
                verifiedItems.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/calls/${item.id}`}
                    className="block rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded px-1.5 py-0.5 text-[0.6rem] bg-[var(--success-soft)] text-[#2f6f49]">Verified</span>
                      <span className="ml-auto text-[0.65rem] text-[var(--text-subtle)]">{item.createdAt.toLocaleString()}</span>
                    </div>
                    <div className="text-[0.74rem] font-medium text-[var(--text-strong)]">{item.callerNumber || "Unknown caller"}</div>
                    <p className="mt-1 text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">
                      {item.agentName || "Unassigned agent"} · {item.transcriptPreview || "Good outcome available for spot-checking."}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No clean-call samples in the current view yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Operator notes</h3>
            <div className="mt-4 space-y-3 text-[0.78rem] leading-6 text-[var(--text-body)]">
              <p>
                This queue is intentionally explicit about being heuristic. It is already better than hidden review debt, but it should evolve into human sign-off plus stored QA outcomes.
              </p>
              <p>
                The natural next layer is linking high-severity items into <Link href="/alerts" className="font-medium text-[var(--text-strong)] underline underline-offset-4">alerts</Link> and feeding recurring coaching patterns back into agents, prompts, and the <Link href="/knowledge-base" className="font-medium text-[var(--text-strong)] underline underline-offset-4">knowledge base</Link>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </ConsoleShell>
  );
}