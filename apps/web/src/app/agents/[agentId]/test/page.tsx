import Link from "next/link";
import { AgentStatus } from "@prisma/client";
import { ConsoleShell } from "@/components/console-shell";
import { AgentWorkspaceHeader } from "@/components/agent-workspace-header";
import { getAgentByIdForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";

type AgentTestPageProps = {
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

function readinessTone(ready: boolean) {
  return ready
    ? "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]"
    : "border-[color:rgba(160,91,65,0.18)] bg-[var(--warning-soft)] text-[#8d6336]";
}

export default async function AgentTestPage({ params }: AgentTestPageProps) {
  const session = await requireSession();
  const { agentId } = await params;
  const agent = await getAgentByIdForUser(session.email, agentId);

  const hasPrompt = Boolean(agent?.systemPrompt.trim());
  const hasFirstMessage = Boolean(agent?.firstMessage?.trim());
  const hasVoice = Boolean(agent?.voiceModel?.trim());
  const hasAssignedNumber = Boolean(agent?.phoneNumbers.length);
  const isCallable = agent?.status === AgentStatus.ACTIVE && agent.isActive;
  const hasLiveEvidence = Boolean(agent?.calls.length);
  const readyChecks = [hasPrompt, hasFirstMessage, hasVoice, hasAssignedNumber, isCallable];
  const readyCount = readyChecks.filter(Boolean).length;
  const launchReady = readyCount === readyChecks.length;
  const latestCall = agent?.calls[0] ?? null;

  const rehearsalChecklist = [
    {
      label: "Prompt",
      ready: hasPrompt,
      detail: hasPrompt
        ? "System behavior is configured and ready to guide the runtime."
        : "Add a focused system prompt in the build tab before testing tone or behavior.",
    },
    {
      label: "Opening line",
      ready: hasFirstMessage,
      detail: hasFirstMessage
        ? "The caller will hear a defined first message instead of a blank opening."
        : "Set a first message so the first impression sounds intentional.",
    },
    {
      label: "Voice",
      ready: hasVoice,
      detail: hasVoice
        ? `Current voice model: ${agent?.voiceModel}`
        : "Pick a voice model so the call does not rely on a vague default.",
    },
    {
      label: "Number routing",
      ready: hasAssignedNumber,
      detail: hasAssignedNumber
        ? `${agent?.phoneNumbers[0]?.phoneNumber} is currently assigned to this agent.`
        : "Assign a number in deploy before expecting inbound calls to resolve here.",
    },
    {
      label: "Callable status",
      ready: Boolean(isCallable),
      detail: isCallable
        ? "Lifecycle and active toggle both allow runtime assignment."
        : "Set the agent to ACTIVE and keep it marked callable before live validation.",
    },
  ];

  const callPath = [
    {
      label: "Inbound routing",
      body: hasAssignedNumber
        ? "Twilio can resolve the assigned number through the runtime lookup contract."
        : "No assigned number yet, so the call path will not route cleanly to this agent.",
    },
    {
      label: "Opening turn",
      body: hasFirstMessage
        ? `Caller hears: “${agent?.firstMessage}”`
        : "No defined first message yet. Add one in build before testing the opening turn.",
    },
    {
      label: "Conversation behavior",
      body: hasPrompt
        ? "Prompt and voice settings are in place for a focused agent rehearsal."
        : "Conversation behavior is underspecified until a system prompt is added.",
    },
    {
      label: "Proof loop",
      body: hasLiveEvidence
        ? "Recent call evidence already exists, so you can compare the next test against real outcomes."
        : "After the first live test, the monitor surfaces will become your proof loop.",
    },
  ];

  return (
    <ConsoleShell
      section="agents"
      eyebrow="Agent test"
      title={agent ? `Test ${agent.name}` : `Test agent ${agentId}`}
      description="Use this workspace as the practical preflight layer before a real inbound call: check launch readiness, rehearse the opening turn, and inspect recent evidence."
      userEmail={session.email}
    >
      {agent ? (
        <>
          <AgentWorkspaceHeader agent={agent} currentView="test" />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.85fr)]">
            <div className="space-y-5">
              <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
                    Agent preflight
                  </div>
                  <div
                    className={[
                      "inline-flex rounded-full px-3 py-1 text-[0.68rem] font-medium",
                      launchReady
                        ? "bg-[color:rgba(86,149,113,0.16)] text-[#bde2c7]"
                        : "bg-[color:rgba(238,189,142,0.16)] text-[#f1d4b4]",
                    ].join(" ")}
                  >
                    {launchReady ? `Ready for live call · ${readyCount}/${readyChecks.length}` : `Needs setup · ${readyCount}/${readyChecks.length}`}
                  </div>
                </div>

                <h2 className="mt-4 font-display text-[1.45rem] font-semibold tracking-[-0.04em]">
                  Rehearse the call path before you burn a real phone test.
                </h2>
                <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                  This page now acts like a practical test bench: it tells you whether the agent can actually receive a call, what the caller will hear first, and whether you already have live evidence to review.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Opening line", agent.firstMessage || "No first message set yet."],
                    ["Voice", agent.voiceModel || "Default voice still in play"],
                    ["Assigned number", agent.phoneNumbers[0]?.phoneNumber || "No number assigned"],
                    ["Runtime status", isCallable ? "Eligible for live assignment" : "Not launch-ready yet"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(229,226,225,0.48)]">{label}</div>
                      <div className="mt-2 text-[0.82rem] text-[var(--surface-dark-foreground)]">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Link href={`/agents/${agent.id}/build`} className="rounded-[16px] bg-white px-4 py-3 text-[0.8rem] font-medium text-[var(--text-strong)] transition hover:opacity-90">
                    Refine build settings
                  </Link>
                  <Link href={`/agents/${agent.id}/deploy`} className="rounded-[16px] border border-white/12 bg-white/5 px-4 py-3 text-[0.8rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10">
                    Fix deploy readiness
                  </Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Launch checklist</h3>
                    <p className="mt-1 text-[0.78rem] leading-6 text-[var(--text-subtle)]">
                      The fastest way to avoid a disappointing live test is to clear the obvious blockers first.
                    </p>
                  </div>
                  <div className="rounded-[16px] bg-[var(--surface-subtle)] px-3 py-2 text-[0.78rem] font-medium text-[var(--text-body)]">
                    {readyCount}/{readyChecks.length} ready
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {rehearsalChecklist.map((item) => (
                    <div
                      key={item.label}
                      className={[
                        "rounded-[18px] border px-4 py-3",
                        readinessTone(item.ready),
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-[0.82rem] font-medium">{item.label}</div>
                        <div className="text-[0.7rem] uppercase tracking-[0.14em]">{item.ready ? "Ready" : "Needs work"}</div>
                      </div>
                      <p className="mt-2 text-[0.78rem] leading-6 opacity-90">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">If you called this agent right now</h3>
                <div className="mt-4 grid gap-3">
                  {callPath.map((item, index) => (
                    <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--text-strong)] text-[0.72rem] font-semibold text-white">
                          {index + 1}
                        </div>
                        <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{item.label}</div>
                      </div>
                      <p className="mt-3 text-[0.78rem] leading-6 text-[var(--text-body)]">{item.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Current rehearsal snapshot</h3>
                <div className="mt-4 space-y-3">
                  {[
                    ["Lifecycle", agent.status],
                    ["Callable", isCallable ? "Yes" : "No"],
                    ["First message", agent.firstMessage || "Missing"],
                    ["Voice model", agent.voiceModel || "Missing"],
                    ["Recent call evidence", hasLiveEvidence ? `${agent.calls.length} recent calls` : "No call evidence yet"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-3">
                      <span className="text-[0.74rem] text-[var(--text-subtle)]">{label}</span>
                      <span className="max-w-[55%] text-right text-[0.78rem] font-medium text-[var(--text-strong)]">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Recent live evidence</h3>
                  <Link href={`/agents/${agent.id}/monitor`} className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
                    Open monitor →
                  </Link>
                </div>

                {agent.calls.length ? (
                  <div className="mt-4 space-y-3">
                    {agent.calls.map((call) => (
                      <Link
                        key={call.id}
                        href={`/calls/${call.id}`}
                        className="block rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 transition hover:bg-[var(--surface-subtle)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">
                              {call.callerNumber || call.toNumber || "Unknown caller"}
                            </div>
                            <div className="mt-1 text-[0.72rem] text-[var(--text-subtle)]">
                              {formatDateTime(call.startedAt || call.createdAt)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[0.74rem] font-medium text-[var(--text-body)]">{call.status}</div>
                            <div className="mt-1 font-mono text-[0.7rem] text-[var(--text-subtle)]">{formatDuration(call.durationSeconds)}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 text-[0.78rem] leading-6 text-[var(--text-body)]">
                    No live call evidence exists yet for this agent. The next real inbound call will create the first review loop.
                  </div>
                )}
              </section>

              <section className="rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
                <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.56)]">Operator note</div>
                <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.03em]">
                  The goal here is confidence, not fake simulation theatre.
                </h3>
                <p className="mt-3 text-[0.82rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                  Retell-style testing works because it helps you catch setup mistakes early. This version does the same practical job right now: confirm routing, prompt, opening behavior, and whether live evidence is already flowing back into the product.
                </p>

                {latestCall ? (
                  <div className="mt-4 rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                    <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.5)]">Latest proof point</div>
                    <div className="mt-2 text-[0.82rem] text-[var(--surface-dark-foreground)]">
                      Last call was {latestCall.status.toLowerCase().replaceAll("_", " ")} at {formatDateTime(latestCall.startedAt || latestCall.createdAt)}.
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </>
      ) : null}
    </ConsoleShell>
  );
}