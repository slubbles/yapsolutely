import Link from "next/link";
import { Suspense } from "react";
import { AgentStatus } from "@prisma/client";
import { ConsoleShell } from "@/components/console-shell";
import { AgentsOnboardingOverlay } from "@/components/agents-onboarding-overlay";
import { listAgentsForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";

type AgentsPageProps = {
  searchParams?: Promise<{
    onboarding?: string;
    q?: string;
    status?: string;
  }>;
};

const templates = [
  {
    name: "Sales qualifier",
    description: "Pre-qualify inbound leads before routing them to the right rep.",
  },
  {
    name: "Support triage",
    description: "Handle common support issues first and escalate cleanly when needed.",
  },
  {
    name: "Appointment setter",
    description: "Capture intent, gather context, and move callers into booked slots.",
  },
];

function statusClassName(status: string, isActive: boolean) {
  if (!isActive || status === "ARCHIVED") {
    return "bg-[var(--surface-subtle)] text-[var(--text-subtle)]";
  }

  if (status === "ACTIVE") {
    return "bg-[var(--success-soft)] text-[#2f6f49]";
  }

  if (status === "DRAFT") {
    return "bg-[var(--warning-soft)] text-[#8d6336]";
  }

  return "bg-[var(--surface-subtle)] text-[var(--text-subtle)]";
}

function readinessTone(ready: boolean) {
  return ready
    ? "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]"
    : "border-[color:rgba(160,91,65,0.18)] bg-[var(--warning-soft)] text-[#8d6336]";
}

function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const session = await requireSession();
  const query = resolvedSearchParams?.q?.trim() || "";
  const status = resolvedSearchParams?.status?.trim().toUpperCase() || "ALL";
  const agents = await listAgentsForUser(session.email, { query, status });
  const hasFilters = Boolean(query || (status && status !== "ALL"));
  const forceOnboarding = resolvedSearchParams?.onboarding === "1";
  const statusOptions = ["ALL", ...Object.values(AgentStatus)];
  const activeAgents = agents.filter((agent) => agent.status === AgentStatus.ACTIVE && agent.isActive).length;
  const draftAgents = agents.filter((agent) => agent.status === AgentStatus.DRAFT).length;
  const pausedAgents = agents.filter((agent) => agent.status === AgentStatus.PAUSED || !agent.isActive).length;
  const voiceConfiguredAgents = agents.filter((agent) => Boolean(agent.voiceModel?.trim())).length;
  const openingConfiguredAgents = agents.filter((agent) => Boolean(agent.firstMessage?.trim())).length;
  const readyDrafts = agents.filter(
    (agent) =>
      agent.status === AgentStatus.DRAFT && Boolean(agent.voiceModel?.trim()) && Boolean(agent.firstMessage?.trim()),
  ).length;
  const listChecks = [agents.length > 0, activeAgents > 0, voiceConfiguredAgents > 0, openingConfiguredAgents > 0];
  const listScore = listChecks.filter(Boolean).length;
  const newestAgent = agents[0] ?? null;
  const attentionRows = [
    {
      label: "Drafts needing finishing",
      value: String(Math.max(draftAgents - readyDrafts, 0)),
      note:
        draftAgents > readyDrafts
          ? "Some draft agents still lack a stronger opening experience or explicit voice selection."
          : "Draft agents are at least staged with basic caller-facing ingredients.",
    },
    {
      label: "Inactive or paused",
      value: String(pausedAgents),
      note:
        pausedAgents > 0
          ? "These agents should either be intentionally offline or promoted back into live rotation."
          : "No agents are quietly lurking offline in the current result set.",
    },
    {
      label: "Latest roster change",
      value: newestAgent ? newestAgent.name : "No agents yet",
      note: newestAgent
        ? `${formatStatusLabel(newestAgent.status)} · updated ${newestAgent.updatedAt.toLocaleDateString()}`
        : "Create the first agent to turn this list into a real operator roster.",
    },
  ];
  const workspaceCards = [
    {
      label: "Create",
      href: "/agents/new",
      value: agents.length === 0 ? "Start here" : "Add another",
      note:
        agents.length === 0
          ? "Create the first answering persona for the workspace."
          : "Spin up a new agent when the roster needs another role, not another hacky prompt variant.",
    },
    {
      label: "Build",
      href: newestAgent ? `/agents/${newestAgent.id}/build` : "/agents/new",
      value: `${voiceConfiguredAgents}/${agents.length || 0} voiced`,
      note:
        voiceConfiguredAgents > 0
          ? "Voice and opening behavior are already taking shape for part of the roster."
          : "No agents have an explicit voice yet, so build quality still feels provisional.",
    },
    {
      label: "Deploy",
      href: newestAgent ? `/agents/${newestAgent.id}/deploy` : "/numbers",
      value: `${activeAgents} live`,
      note:
        activeAgents > 0
          ? "At least part of the roster is already positioned for real runtime assignment."
          : "No active callable agents yet — the deploy path still needs attention.",
    },
    {
      label: "Monitor",
      href: newestAgent ? `/agents/${newestAgent.id}/monitor` : "/calls",
      value: newestAgent ? "Review latest" : "Needs proof",
      note:
        newestAgent
          ? "Jump directly from the list into the latest agent workspace when the roster changes."
          : "Once agents exist, this becomes the fast route into proof and iteration."
    },
  ];
  const listChecklist = [
    {
      label: "Roster exists",
      ready: agents.length > 0,
      detail:
        agents.length > 0
          ? `${agents.length} agents are visible in the current view.`
          : "The workspace still needs its first agent before the rest of the product loop can feel real.",
    },
    {
      label: "Someone is live",
      ready: activeAgents > 0,
      detail:
        activeAgents > 0
          ? `${activeAgents} agents are active and callable in the current result set.`
          : "No agents are currently active and callable from this filtered view.",
    },
    {
      label: "Caller experience is taking shape",
      ready: voiceConfiguredAgents > 0 && openingConfiguredAgents > 0,
      detail:
        voiceConfiguredAgents > 0 && openingConfiguredAgents > 0
          ? `${openingConfiguredAgents} agents have an opening line and ${voiceConfiguredAgents} have a selected voice.`
          : "The roster still needs more explicit first-message and voice choices before it feels launch-minded.",
    },
  ];

  return (
    <ConsoleShell
      eyebrow="Agents"
      section="agents"
      title="Define who answers the phone."
      description="Agents are the operational home now: create, tune, activate, and route them without losing sight of the real call path."
      userEmail={session.email}
    >
      {agents.length === 0 && !hasFilters ? (
        <>
          <Suspense fallback={null}>
            <AgentsOnboardingOverlay forceVisible={forceOnboarding} />
          </Suspense>

          <div className="rounded-[var(--radius-card)] border border-dashed border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-strong)]">No agents yet</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">
                  Create the first agent, shape the prompt, assign a number, and make this page the place your team actually starts from.
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-subtle)]">
                  Once your database-backed records exist, they will appear here automatically.
                </p>
              </div>
              <Link
                href="/agents/new"
                className="inline-flex items-center justify-center rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
              >
                Create first agent
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
                  Agent roster
                </div>
                <div
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-[0.68rem] font-medium",
                    listScore === listChecks.length
                      ? "bg-[color:rgba(86,149,113,0.16)] text-[#bde2c7]"
                      : "bg-[color:rgba(238,189,142,0.16)] text-[#f1d4b4]",
                  ].join(" ")}
                >
                  {listScore === listChecks.length
                    ? `Roster-ready basics · ${listScore}/${listChecks.length}`
                    : `Needs setup · ${listScore}/${listChecks.length}`}
                </div>
              </div>
              <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
                <div>
                  <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.04em] sm:text-[1.82rem]">
                    The agents page should feel like the roster desk for who can answer the phone next.
                  </h2>
                  <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                    Use this surface to see who is live, who is still draft-grade, and where to jump next for build, deploy, test, or monitor work. It now behaves more like a real operations roster and less like a lonely table auditioning for relevance.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    <Link
                      href="/agents/new"
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                    >
                      Create agent
                    </Link>
                    <Link
                      href={newestAgent ? `/agents/${newestAgent.id}` : "/agents/new"}
                      className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                    >
                      {newestAgent ? "Open latest workspace" : "Start first workspace"}
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Active", value: String(activeAgents) },
                    { label: "Draft", value: String(draftAgents) },
                    { label: "Voiced", value: String(voiceConfiguredAgents) },
                    { label: "Opening set", value: String(openingConfiguredAgents) },
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
                  <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Roster posture</h3>
                  <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                    A compact read on whether this agent list looks live, half-built, or worth immediate cleanup.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                  {listScore}/{listChecks.length}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {listChecklist.map((item) => (
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
          </div>

          <section className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

          <div className="mb-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <form className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)] md:grid-cols-[1fr_220px_auto]">
              <label>
                <span className="text-sm font-medium text-[var(--text-body)]">Search agents</span>
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Agent, role, voice, or first message..."
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
                  {statusOptions.map((value) => (
                    <option key={value} value={value}>
                      {value === "ALL" ? "All statuses" : value}
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
                    href="/agents"
                    className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
                  >
                    Clear
                  </Link>
                ) : null}
              </div>
            </form>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--text-subtle)]">Visible agents</p>
                <p className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">{agents.length}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                  {hasFilters
                    ? "Filtered to the agents that match the current search criteria."
                    : "Current agent records for this workspace session."}
                </p>
              </div>

              <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Attention queue</h3>
                <div className="mt-4 space-y-2">
                  {attentionRows.map((item) => (
                    <div key={item.label} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                      <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                      <div className="mt-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                      <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">
                      Agent
                    </th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">
                      Build posture
                    </th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">
                      Voice
                    </th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">
                      Runtime
                    </th>
                    <th className="px-5 py-3 text-right text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {agents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10">
                        <h2 className="text-lg font-semibold text-[var(--text-strong)]">No agents matched those filters</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">
                          Try clearing the filters or broadening the query. Search checks agent names, roles, voices, and opening-message copy.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3 text-sm">
                          <Link href="/agents" className="font-medium text-[var(--text-strong)] underline underline-offset-4">
                            Reset filters
                          </Link>
                          <Link href="/agents/new" className="font-medium text-[var(--text-strong)] underline underline-offset-4">
                            Create another agent
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    agents.map((agent) => (
                      <tr
                        key={agent.id}
                        className="border-b border-[var(--border-soft)] transition-colors last:border-b-0 hover:bg-[var(--surface-subtle)]/55"
                      >
                        <td className="px-5 py-4">
                          <Link href={`/agents/${agent.id}`} className="block">
                            <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">
                              {agent.name}
                            </div>
                            <div className="mt-1 max-w-[34rem] text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                              {agent.firstMessage || "No first message set yet."}
                            </div>
                            <div className="mt-2 text-[0.7rem] text-[var(--text-subtle)]">
                              Open workspace →
                            </div>
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${statusClassName(agent.status, agent.isActive)}`}
                          >
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">
                          <div>{agent.firstMessage ? "Opening set" : "Opening missing"}</div>
                          <div className="mt-1 text-[0.72rem] text-[var(--text-subtle)]">
                            {agent.voiceModel ? "Voice chosen" : "Voice still default / missing"}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">
                          {agent.voiceModel || "Default"}
                        </td>
                        <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">
                          <div>{agent.isActive ? "Callable" : "Inactive"}</div>
                          <div className="mt-1 text-[0.72rem] text-[var(--text-subtle)]">
                            {agent.status === AgentStatus.ACTIVE && agent.isActive
                              ? "Ready for deploy checks"
                              : "Needs lifecycle review"}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right text-[0.76rem] text-[var(--text-subtle)]">
                          {agent.updatedAt.toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Templates</h3>
              <span className="text-[0.72rem] text-[var(--text-subtle)]">Secondary for now</span>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-3">
              {templates.map((template) => (
                <div
                  key={template.name}
                  className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/65 p-4"
                >
                  <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{template.name}</div>
                  <p className="mt-2 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <section className="mt-6 rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
            <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.56)]">Roster note</div>
            <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.03em]">
              A good agent list should route operators into action, not just inventory.
            </h3>
            <p className="mt-3 text-[0.82rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
              Create expands the roster, build shapes the voice and opening, deploy decides who is truly callable, and monitor closes the review loop. This page now points toward that sequence instead of acting like a passive spreadsheet cosplay.
            </p>
          </section>
        </>
      )}
    </ConsoleShell>
  );
}
