import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { listAgentsForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";
import { listRecentCallsForUser } from "@/lib/call-data";
import { listPhoneNumbersWithAssignments } from "@/lib/phone-number-data";
import { getSettingsReadiness } from "@/lib/settings-data";

const stageOptions = ["ALL", "READY", "DRAFT", "FOLLOW_UP"] as const;
const attentionStatuses = new Set(["FAILED", "NO_ANSWER", "BUSY", "CANCELED"]);

type BatchCallsPageProps = {
  searchParams?: Promise<{
    q?: string;
    stage?: string;
  }>;
};

type CampaignStage = "ready" | "draft" | "follow_up";

type CampaignItem = {
  id: string;
  title: string;
  stage: CampaignStage;
  sourceNumber: string;
  agentName: string;
  audience: number;
  retryPolicy: string;
  note: string;
};

type BlockerItem = {
  title: string;
  level: "warning" | "info";
  detail: string;
};

function stageBadge(stage: CampaignStage) {
  switch (stage) {
    case "ready":
      return { label: "Ready", className: "bg-[var(--success-soft)] text-[#2f6f49]" };
    case "follow_up":
      return { label: "Follow-up", className: "bg-[var(--warning-soft)] text-[#8d6336]" };
    default:
      return { label: "Draft", className: "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]" };
  }
}

function checklistTone(ready: boolean) {
  return ready
    ? "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]"
    : "border-[color:rgba(160,91,65,0.18)] bg-[var(--warning-soft)] text-[#8d6336]";
}

function blockerTone(level: "warning" | "info") {
  return level === "warning"
    ? "border-[color:rgba(160,91,65,0.18)] bg-[var(--warning-soft)] text-[#8d6336]"
    : "border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 text-[var(--text-body)]";
}

function matchesStage(stage: CampaignStage, filter: string) {
  if (filter === "READY") {
    return stage === "ready";
  }

  if (filter === "DRAFT") {
    return stage === "draft";
  }

  if (filter === "FOLLOW_UP") {
    return stage === "follow_up";
  }

  return true;
}

export default async function BatchCallsPage({ searchParams }: BatchCallsPageProps) {
  const session = await requireSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim().toLowerCase() || "";
  const stage = resolvedSearchParams?.stage?.trim().toUpperCase() || "ALL";
  const normalizedStage = stageOptions.includes(stage as (typeof stageOptions)[number]) ? stage : "ALL";

  const [agents, numbers, calls, readiness] = await Promise.all([
    listAgentsForUser(session.email),
    listPhoneNumbersWithAssignments(session.email),
    listRecentCallsForUser(session.email),
    getSettingsReadiness(),
  ]);

  const assignedNumbers = numbers.filter((number) => number.assignedAgentName);
  const fallbackNumber = assignedNumbers[0]?.phoneNumber || numbers[0]?.phoneNumber || "+15551234567";
  const followUpCandidates = calls.filter((call) => attentionStatuses.has(call.status));
  const callbackCandidates = calls.filter((call) => call.status === "COMPLETED" && (call.durationSeconds ?? 0) > 180);
  const activeAgentLabels = agents.slice(0, 4).map((agent) => agent.name);
  const fallbackAgents = activeAgentLabels.length > 0 ? activeAgentLabels : ["Outbound Concierge", "Retention Desk", "Callback Assistant"];

  const campaigns: CampaignItem[] = [
    {
      id: "cmp-follow-up",
      title: "Missed inbound follow-up",
      stage: followUpCandidates.length > 0 ? "ready" : "draft",
      sourceNumber: assignedNumbers[0]?.phoneNumber || fallbackNumber,
      agentName: assignedNumbers[0]?.assignedAgentName || fallbackAgents[0],
      audience: followUpCandidates.length,
      retryPolicy: "3 attempts over 48 hours",
      note: "Calls back failed, busy, or no-answer conversations so inbound demand does not quietly disappear.",
    },
    {
      id: "cmp-post-call",
      title: "High-intent callback queue",
      stage: callbackCandidates.length > 0 ? "follow_up" : "draft",
      sourceNumber: assignedNumbers[1]?.phoneNumber || fallbackNumber,
      agentName: assignedNumbers[1]?.assignedAgentName || fallbackAgents[1] || fallbackAgents[0],
      audience: callbackCandidates.length,
      retryPolicy: "1 attempt same day",
      note: "Re-engages longer completed calls that likely ended with unresolved next steps or warm sales intent.",
    },
    {
      id: "cmp-reactivation",
      title: "Dormant lead reactivation",
      stage: assignedNumbers.length > 0 ? "draft" : "follow_up",
      sourceNumber: assignedNumbers[2]?.phoneNumber || fallbackNumber,
      agentName: assignedNumbers[2]?.assignedAgentName || fallbackAgents[2] || fallbackAgents[0],
      audience: Math.max(Math.min(calls.length, 18), 6),
      retryPolicy: "2 attempts over 7 days",
      note: "Reserved for CSV-imported audiences once outbound work is officially in play.",
    },
  ];

  const visibleCampaigns = campaigns.filter((campaign) => {
    const matchesQuery =
      !query ||
      campaign.title.toLowerCase().includes(query) ||
      campaign.agentName.toLowerCase().includes(query) ||
      campaign.sourceNumber.toLowerCase().includes(query);

    return matchesQuery && matchesStage(campaign.stage, normalizedStage);
  });

  const hasFilters = Boolean(query || normalizedStage !== "ALL");
  const readyCampaigns = campaigns.filter((campaign) => campaign.stage === "ready");
  const followUpCampaigns = campaigns.filter((campaign) => campaign.stage === "follow_up");
  const draftCampaigns = campaigns.filter((campaign) => campaign.stage === "draft");
  const sourceCoverageRate = agents.length > 0 ? Math.round((assignedNumbers.length / agents.length) * 100) : 0;

  const primaryRecommendation = !assignedNumbers.length
    ? {
        title: "Assign a source number before staging outbound work",
        note: "Outbound planning becomes real only when at least one number is clearly mapped to an agent and can eventually act as an approved source line.",
        nextStep: "Finish routing in Numbers, then return here to promote the first callback brief.",
      }
    : followUpCandidates.length > 0
      ? {
          title: "Launch missed inbound follow-up first",
          note: `${followUpCandidates.length} recent calls already ended as failed, busy, canceled, or no-answer, which makes this the most honest first outbound use case in the workspace.`,
          nextStep: "Use the best-routed assigned number, keep the audience tight, and review transcript context before any callback policy graduates into automation.",
        }
      : callbackCandidates.length > 0
        ? {
            title: "Prepare a same-day callback lane for warm calls",
            note: `${callbackCandidates.length} longer completed conversations suggest unresolved next steps or high intent worth revisiting while the context is still warm.`,
            nextStep: "Stage a single callback brief with one agent-owner before adding broader reactivation motion.",
          }
        : {
            title: "Keep outbound in planning mode for now",
            note: "The current workspace has routing structure, but not enough live follow-up signal yet to justify turning outbound into a busy distraction.",
            nextStep: "Let inbound proof accumulate, then promote the first audience once real follow-up demand is visible.",
          };

  const audienceLanes = [
    {
      title: "Missed inbound recovery",
      count: followUpCandidates.length,
      stage: followUpCandidates.length > 0 ? "ready" : "draft",
      note: "Best first campaign because it protects existing inbound demand instead of inventing a new growth motion too early.",
      detail:
        followUpCandidates.length > 0
          ? "Based on real calls that ended with no answer, busy, canceled, or failed outcomes."
          : "No non-ideal inbound outcomes are visible right now, so this lane stays prepared rather than active.",
    },
    {
      title: "Warm callback queue",
      count: callbackCandidates.length,
      stage: callbackCandidates.length > 0 ? "follow_up" : "draft",
      note: "Longer completed calls often mean somebody cared enough to talk, but still may need a cleaner close or follow-up touch.",
      detail:
        callbackCandidates.length > 0
          ? "Use this lane for same-day callbacks, handoff confirmation, or next-step nudges."
          : "No strong warm-callback pool is visible in the current call set yet.",
    },
    {
      title: "Imported reactivation list",
      count: 0,
      stage: "draft",
      note: "This stays intentionally parked until CSV import, consent rules, and campaign persistence are promoted into scope.",
      detail: "Useful for future revenue plays, but still lower-value than cleaning up live inbound demand first.",
    },
  ] as const;

  const rolloutChecklist = [
    {
      label: "Source numbers are mapped",
      ready: assignedNumbers.length > 0,
      detail:
        assignedNumbers.length > 0
          ? `${assignedNumbers.length} routed number${assignedNumbers.length === 1 ? " is" : "s are"} available for future outbound ownership.`
          : "No assigned numbers yet, so batch planning still lacks a credible source line.",
    },
    {
      label: "An agent can own the motion",
      ready: agents.length > 0,
      detail:
        agents.length > 0
          ? `${agents.length} agent${agents.length === 1 ? " is" : "s are"} available to own callback scripting or reactivation logic.`
          : "No agents exist yet, so outbound would just be orchestration without an operator brain behind it.",
    },
    {
      label: "A real audience already exists",
      ready: followUpCandidates.length > 0 || callbackCandidates.length > 0,
      detail:
        followUpCandidates.length > 0 || callbackCandidates.length > 0
          ? `${followUpCandidates.length + callbackCandidates.length} live candidates can already seed the first campaign brief.`
          : "No obvious callback audience is visible yet, so the page should stay in planning mode rather than pretending to launch something.",
    },
    {
      label: "Environment posture is honest",
      ready: readiness.readyForLiveValidation,
      detail: readiness.readyForLiveValidation
        ? "The environment contract is configured well enough that execution planning can be treated as real operations work."
        : `Live validation is still blocked by ${readiness.missingKeys.length} missing configuration value${readiness.missingKeys.length === 1 ? "" : "s"}.`,
    },
  ];

  const blockers: BlockerItem[] = [
    !assignedNumbers.length
      ? {
          title: "No approved source line yet",
          level: "warning" as const,
          detail: "Map at least one number to an agent before presenting outbound as operationally credible.",
        }
      : null,
    !readiness.readyForLiveValidation
      ? {
          title: "Environment is still pre-live",
          level: "warning" as const,
          detail:
            readiness.missingKeys.length > 0
              ? `Missing keys still include ${readiness.missingKeys.slice(0, 3).join(", ")}${readiness.missingKeys.length > 3 ? ", and more" : ""}.`
              : "Provider and runtime wiring still need final validation before batch execution should ever feel official.",
        }
      : null,
    !followUpCandidates.length && !callbackCandidates.length
      ? {
          title: "No strong first audience yet",
          level: "info" as const,
          detail: "Let inbound traffic create clearer callback demand before outbound becomes more than a staged concept.",
        }
      : null,
    {
      title: "CSV import is intentionally later",
      level: "info" as const,
      detail: "Audience upload, deduping, consent checks, and execution logs still belong to the later outbound phase — not the MVP demo path.",
    },
  ].filter((item): item is BlockerItem => Boolean(item));

  return (
    <ConsoleShell
      eyebrow="Batch calls"
      section="batch"
      title="Stage outbound and follow-up campaigns without turning planning into fantasy."
      description="Use real agents, routed numbers, readiness signals, and recent call evidence to decide what outbound motion should exist next — and what should stay parked for later."
      userEmail={session.email}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
            Deploy surface
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] sm:text-[1.9rem]">
                Outbound should launch from clear evidence, clear ownership, and one respectable first motion.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                This planner now uses real workspace ingredients — assigned numbers, active agents, live follow-up candidates, and deployment posture — so it behaves like a decision surface instead of a concept sketch.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/numbers"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Review numbers
                </Link>
                <Link
                  href="/calls"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Open calls
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Campaign briefs", value: String(campaigns.length) },
                { label: "Ready to stage", value: String(readyCampaigns.length) },
                { label: "Follow-up candidates", value: String(followUpCandidates.length) },
                { label: "Assigned source numbers", value: String(assignedNumbers.length) },
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
              <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">What should launch first</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                A practical recommendation based on today’s actual workspace state.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              Website-first planning
            </span>
          </div>
          <div className="mt-4 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
            <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{primaryRecommendation.title}</div>
            <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{primaryRecommendation.note}</p>
            <p className="mt-3 text-[0.72rem] leading-6 text-[var(--text-subtle)]">{primaryRecommendation.nextStep}</p>
          </div>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Routing coverage",
                value: `${assignedNumbers.length} numbers / ${agents.length || 0} agents`,
                note: sourceCoverageRate > 0 ? `${sourceCoverageRate}% source-line coverage across visible agents.` : "No routed source-line coverage yet.",
              },
              {
                label: "Execution posture",
                value: readiness.readyForLiveValidation ? "Ready for honest staging" : "Pre-live planning mode",
                note: readiness.readyForLiveValidation
                  ? "Environment readiness supports more serious deployment planning."
                  : "This page should stay focused on planning until provider wiring is truly ready.",
              },
              {
                label: "Campaign mix",
                value: `${readyCampaigns.length} ready · ${followUpCampaigns.length} follow-up · ${draftCampaigns.length} draft`,
                note: "A healthy first outbound surface should make sequencing legible before automation exists.",
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
            <span className="text-sm font-medium text-[var(--text-body)]">Search campaign briefs</span>
            <input
              type="search"
              name="q"
              defaultValue={resolvedSearchParams?.q || ""}
              placeholder="Campaign, agent, or source number..."
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Stage</span>
            <select
              name="stage"
              defaultValue={normalizedStage}
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(32,36,43,0.2)]"
            >
              <option value="ALL">All stages</option>
              <option value="READY">Ready</option>
              <option value="DRAFT">Draft</option>
              <option value="FOLLOW_UP">Follow-up</option>
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
                href="/batch-calls"
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Visible briefs", value: String(visibleCampaigns.length), note: "Campaign concepts visible in the current filter set." },
            { label: "Warm callback pool", value: String(callbackCandidates.length), note: "Longer completed calls that may deserve a same-day next-step touch." },
            { label: "Launch blockers", value: String(blockers.length), note: "Constraints worth resolving before outbound planning becomes execution pressure." },
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
          <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
              <div>
                <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Campaign briefs</h3>
                <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                  Structured outbound concepts based on real workspace state, sequenced so the team can see what is worth promoting next.
                </p>
              </div>
              <Link href="/numbers" className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
                Open numbers →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    {["Campaign", "Stage", "Source number", "Agent", "Audience", "Retry policy"].map((column) => (
                      <th key={column} className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10">
                        <h3 className="text-lg font-semibold text-[var(--text-strong)]">No campaign briefs matched those filters</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">
                          Try clearing the stage filter or broadening the search query. This view matches campaign names, assigned agents, and source numbers.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    visibleCampaigns.map((campaign) => {
                      const badge = stageBadge(campaign.stage);

                      return (
                        <tr key={campaign.id} className="border-b border-[var(--border-soft)] transition-colors last:border-b-0 hover:bg-[var(--surface-subtle)]/55">
                          <td className="px-5 py-4">
                            <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{campaign.title}</div>
                            <div className="mt-1 max-w-[34rem] text-[0.74rem] leading-6 text-[var(--text-body)]">{campaign.note}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-[0.76rem] text-[var(--text-subtle)]">{campaign.sourceNumber}</td>
                          <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">{campaign.agentName}</td>
                          <td className="px-5 py-4 font-mono text-[0.76rem] text-[var(--text-subtle)]">{campaign.audience}</td>
                          <td className="px-5 py-4 text-[0.76rem] text-[var(--text-body)]">{campaign.retryPolicy}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Audience lanes</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
                  The first outbound layer should classify audiences by operational intent, not just by whoever happened to be dumped into a spreadsheet.
                </p>
              </div>
              <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                route → audience → stage → review
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {audienceLanes.map((lane) => {
                const badge = stageBadge(lane.stage);

                return (
                  <div key={lane.title} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{lane.title}</div>
                      <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.66rem] font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-[var(--text-strong)]">{lane.count}</div>
                    <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{lane.note}</p>
                    <p className="mt-3 text-[0.72rem] leading-6 text-[var(--text-subtle)]">{lane.detail}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Audience import contract</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
                  CSV uploads still belong to the later outbound phase, but the contract should already be visible so uploads, deduping, retries, and disposition exports have a calm place to land later.
                </p>
              </div>
              <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                upload → review → schedule → monitor
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                "CSV imports should validate phone formatting, source ownership, and duplicate rows before queueing anything.",
                "Every audience needs an assigned source number and a clearly named agent or flow before scheduling.",
                "Completed campaigns should feed results back into calls, QA, and exportable follow-up evidence.",
              ].map((item) => (
                <div key={item} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 text-[0.78rem] leading-6 text-[var(--text-body)]">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Campaign launch checklist</h3>
              <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                {rolloutChecklist.filter((item) => item.ready).length}/{rolloutChecklist.length}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {rolloutChecklist.map((item) => (
                <div key={item.label} className={["rounded-[18px] border px-4 py-4", checklistTone(item.ready)].join(" ")}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[0.82rem] font-medium">{item.label}</div>
                    <div className="text-[0.68rem] uppercase tracking-[0.14em]">{item.ready ? "Ready" : "Needs work"}</div>
                  </div>
                  <p className="mt-2 text-[0.76rem] leading-6 opacity-90">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Source number readiness</h3>
            </div>
            <div className="space-y-2 p-4">
              {assignedNumbers.length > 0 ? (
                assignedNumbers.slice(0, 4).map((number) => (
                  <div key={number.id} className="rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-mono text-[0.7rem] text-[var(--text-body)]">{number.phoneNumber}</span>
                      <span className="rounded px-1.5 py-0.5 text-[0.6rem] bg-[var(--success-soft)] text-[#2f6f49]">Ready</span>
                    </div>
                    <p className="text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">
                      {number.assignedAgentName || "Assigned agent missing"} · {number.friendlyName || "No friendly name yet"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No assigned numbers yet. Finish routing in <Link href="/numbers" className="font-medium text-[var(--text-strong)] underline underline-offset-4">numbers</Link> before outbound staging gets serious.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Launch blockers</h3>
            </div>
            <div className="space-y-3 p-4">
              {blockers.map((item) => (
                <div key={item.title} className={["rounded-[16px] border px-4 py-4", blockerTone(item.level)].join(" ")}>
                  <div className="text-[0.78rem] font-medium">{item.title}</div>
                  <p className="mt-2 text-[0.74rem] leading-6 opacity-90">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Follow-up candidates</h3>
            </div>
            <div className="space-y-2 p-4">
              {followUpCandidates.length > 0 ? (
                followUpCandidates.slice(0, 4).map((call) => (
                  <Link key={call.id} href={`/calls/${call.id}`} className="block rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded px-1.5 py-0.5 text-[0.6rem] bg-[var(--warning-soft)] text-[#8d6336]">{call.status.replaceAll("_", " ")}</span>
                      <span className="ml-auto text-[0.65rem] text-[var(--text-subtle)]">{call.createdAt.toLocaleString()}</span>
                    </div>
                    <div className="text-[0.74rem] font-medium text-[var(--text-strong)]">{call.callerNumber || "Unknown caller"}</div>
                    <p className="mt-1 text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">
                      {call.agentName || "Unassigned agent"} · {call.transcriptPreview || "Transcript detail can guide callback scripting."}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No immediate follow-up candidates in the current call set.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Operator notes</h3>
            <div className="mt-4 space-y-3 text-[0.78rem] leading-6 text-[var(--text-body)]">
              <p>
                This planner is now grounded in real workspace evidence, but actual dial scheduling, CSV import, and persistent run-state history still sit outside the MVP inbound critical path.
              </p>
              <p>
                The right next layer is campaign persistence plus results that flow back into <Link href="/calls" className="font-medium text-[var(--text-strong)] underline underline-offset-4">calls</Link>, <Link href="/analytics" className="font-medium text-[var(--text-strong)] underline underline-offset-4">analytics</Link>, and <Link href="/alerts" className="font-medium text-[var(--text-strong)] underline underline-offset-4">alerts</Link> once outbound work is officially promoted.
              </p>
            </div>
          </section>
        </div>
      </div>
    </ConsoleShell>
  );
}