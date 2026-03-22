import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { AgentPromptField } from "@/components/agent-prompt-field";
import { AgentWorkspaceHeader } from "@/components/agent-workspace-header";
import { FormSubmitButton } from "@/components/form-submit-button";
import { updateAgentAction } from "@/app/_actions/agents";
import { getAgentByIdForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";

type AgentBuildPageProps = {
  params: Promise<{
    agentId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    updated?: string;
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

function buildTone(prompt: string, firstMessage: string | null) {
  const combined = `${prompt} ${firstMessage || ""}`.toLowerCase();

  if (combined.includes("warm") || combined.includes("friendly") || combined.includes("welcome")) {
    return "Warm";
  }

  if (combined.includes("professional") || combined.includes("formal") || combined.includes("precise")) {
    return "Professional";
  }

  if (combined.includes("empathetic") || combined.includes("reassure") || combined.includes("support")) {
    return "Empathetic";
  }

  return "Balanced";
}

export default async function AgentBuildPage({ params, searchParams }: AgentBuildPageProps) {
  const session = await requireSession();
  const { agentId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const agent = await getAgentByIdForUser(session.email, agentId);

  const promptLength = agent?.systemPrompt.trim().length ?? 0;
  const hasPrompt = promptLength > 0;
  const hasFirstMessage = Boolean(agent?.firstMessage?.trim());
  const hasVoice = Boolean(agent?.voiceModel?.trim());
  const hasTransfer = Boolean(agent?.transferNumber?.trim());
  const latestCall = agent?.calls[0] ?? null;
  const buildChecks = [hasPrompt, hasFirstMessage, hasVoice];
  const buildScore = buildChecks.filter(Boolean).length;
  const promptTone = buildTone(agent?.systemPrompt || "", agent?.firstMessage || null);
  const buildChecklist = [
    {
      label: "Prompt is present",
      done: hasPrompt,
      note: hasPrompt
        ? "The runtime has a real instruction set to steer behavior."
        : "A missing prompt leaves the agent with style but no operating brain.",
    },
    {
      label: "Opening line sounds intentional",
      done: hasFirstMessage,
      note: hasFirstMessage
        ? "The caller’s first impression is defined instead of improvised."
        : "Set a first message so the call starts with purpose instead of awkward silence roulette.",
    },
    {
      label: "Voice model is chosen",
      done: hasVoice,
      note: hasVoice
        ? `Current model: ${agent?.voiceModel}`
        : "Pick a voice model so the character of the agent is explicit, not accidental.",
    },
    {
      label: "Escalation path exists",
      done: hasTransfer,
      note: hasTransfer
        ? `Transfer fallback is set to ${agent?.transferNumber}`
        : "Optional, but helpful when the agent should know when to hand off instead of bluff.",
    },
  ];

  const builderSignals = [
    {
      label: "Prompt length",
      value: `${promptLength} chars`,
      note: promptLength > 900
        ? "Detailed enough to guide behavior without necessarily being bloated."
        : promptLength > 250
          ? "A workable draft, but probably still worth tightening with clearer instructions."
          : "Very light — enough to start, not enough to trust blindly.",
    },
    {
      label: "Opening tone",
      value: promptTone,
      note: hasFirstMessage
        ? "Inferred from the prompt and first-message phrasing."
        : "No opening line yet, so tone still leans on prompt alone.",
    },
    {
      label: "Latest proof",
      value: latestCall ? latestCall.status.replaceAll("_", " ") : "No call proof yet",
      note: latestCall
        ? `Last evidence landed at ${formatDateTime(latestCall.startedAt || latestCall.createdAt)}.`
        : "The next real inbound call will validate whether the current build choices actually work.",
    },
  ];

  return (
    <ConsoleShell
      section="agents"
      eyebrow="Agent build"
      title={agent ? `Build ${agent.name}` : `Build agent ${agentId}`}
      description="Refine prompt, voice, and caller-facing behavior without losing the underlying runtime contract."
      userEmail={session.email}
    >
      {resolvedSearchParams?.updated ? (
        <div className="mb-5 rounded-[18px] border border-[color:rgba(64,145,95,0.24)] bg-[var(--success-soft)] px-5 py-4 text-sm text-[#2f6f49]">
          Agent build settings saved successfully.
        </div>
      ) : null}

      {resolvedSearchParams?.error ? (
        <div className="mb-5 rounded-[18px] border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-5 py-4 text-sm text-[#8d6336]">
          {resolvedSearchParams.error === "database-unavailable"
            ? "Database is not configured yet, so build changes could not be persisted."
            : resolvedSearchParams.error === "missing-required-fields"
              ? "Agent name and system prompt are still required here."
              : "Something prevented the build changes from being saved."}
        </div>
      ) : null}

      {agent ? (
        <>
          <AgentWorkspaceHeader agent={agent} currentView="build" />

          <div className="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
                  Build surface
                </div>
                <div className="inline-flex rounded-full bg-[color:rgba(238,189,142,0.16)] px-3 py-1 text-[0.68rem] font-medium text-[#f1d4b4]">
                  Core builder · {buildScore}/{buildChecks.length}
                </div>
              </div>
              <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
                <div>
                  <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.04em] sm:text-[1.82rem]">
                    This is where the agent stops being an idea and starts sounding like someone on the phone.
                  </h2>
                  <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                    Use the build workspace to shape the actual conversation behavior: prompt, opening line, voice, and fallback rules. If deploy decides whether the call can land, build decides whether it should feel good when it does.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    <Link
                      href={`/agents/${agent.id}/test`}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                    >
                      Open test surface
                    </Link>
                    <Link
                      href={`/agents/${agent.id}/monitor`}
                      className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                    >
                      Review live evidence
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Prompt", hasPrompt ? "Configured" : "Missing"],
                    ["First message", hasFirstMessage ? "Ready" : "Missing"],
                    ["Voice", hasVoice ? "Selected" : "Default / missing"],
                    ["Prompt tone", promptTone],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(229,226,225,0.48)]">{label}</div>
                      <div className="mt-2 text-[0.82rem] font-medium text-[var(--surface-dark-foreground)]">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Builder posture</h3>
                  <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                    Fast context for whether this draft already has enough structure to test meaningfully.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                  {buildScore}/{buildChecks.length} ready
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {builderSignals.map((item) => (
                  <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                    <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                    <div className="mt-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                    <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <form action={updateAgentAction} className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
            <input type="hidden" name="agentId" value={agent.id} />
            <input type="hidden" name="returnTo" value={`/agents/${agent.id}/build`} />
            <input type="hidden" name="status" value={agent.status} />
            <input type="hidden" name="phoneNumberId" value={agent.phoneNumbers[0]?.id ?? ""} />
            <input type="checkbox" name="isActive" defaultChecked={agent.isActive} className="sr-only" readOnly />

            <div className="space-y-5">
              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-soft)] px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Identity and framing</h3>
                </div>
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Agent name</span>
                    <input
                      type="text"
                      name="name"
                      defaultValue={agent.name}
                      required
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Role or use case</span>
                    <input
                      type="text"
                      name="description"
                      defaultValue={agent.description ?? ""}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                </div>
              </section>

              <AgentPromptField initialPrompt={agent.systemPrompt} agentName={agent.name} required />

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-soft)] px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Caller experience</h3>
                </div>
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <label className="space-y-1.5 sm:col-span-2">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">First message</span>
                    <input
                      type="text"
                      name="firstMessage"
                      defaultValue={agent.firstMessage ?? ""}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Voice model</span>
                    <input
                      type="text"
                      name="voiceModel"
                      defaultValue={agent.voiceModel ?? ""}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Transfer number</span>
                    <input
                      type="text"
                      name="transferNumber"
                      defaultValue={agent.transferNumber ?? ""}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">If the phone rang right now</h3>
                    <p className="mt-1 text-[0.78rem] leading-6 text-[var(--text-subtle)]">
                      A quick rehearsal of what the current build choices imply before you jump into a real test.
                    </p>
                  </div>
                  <div className="rounded-[16px] bg-[var(--surface-subtle)] px-3 py-2 text-[0.72rem] font-medium text-[var(--text-subtle)]">
                    Draft preview
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {[
                    {
                      label: "Opening turn",
                      body: agent.firstMessage || "No first message yet — the agent still needs a defined opening line.",
                    },
                    {
                      label: "Voice feel",
                      body: agent.voiceModel
                        ? `${agent.voiceModel} is currently selected as the voice model.`
                        : "No explicit voice model is set yet, so behavior may still depend on the runtime default.",
                    },
                    {
                      label: "Escalation",
                      body: agent.transferNumber
                        ? `Transfer fallback is set to ${agent.transferNumber}.`
                        : "No transfer fallback is set yet; add one if this agent should know when to hand off.",
                    },
                  ].map((item, index) => (
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

              <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-5 py-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-[0.82rem] leading-6 text-[var(--text-body)]">
                  Build changes update the same agent record used by runtime lookup, so prompt and caller experience edits stay aligned with live behavior.
                </p>
                <FormSubmitButton
                  label="Save build changes"
                  pendingLabel="Saving build…"
                  className="rounded-[16px] bg-[var(--text-strong)] px-4 py-2.5 text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)] disabled:cursor-wait disabled:opacity-75"
                />
              </div>
            </div>

            <div className="space-y-5">
              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Build checklist</h3>
                <div className="mt-4 space-y-3">
                  {buildChecklist.map((item) => (
                    <div key={item.label} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.72rem] font-semibold ${item.done ? "bg-[var(--success-soft)] text-[#2f6f49]" : "bg-[var(--warning-soft)] text-[#8d6336]"}`}>
                          {item.done ? "✓" : "!"}
                        </span>
                        <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{item.label}</div>
                      </div>
                      <p className="mt-3 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Next best actions</h3>
                <div className="mt-4 flex flex-col gap-2.5">
                  <Link href={`/agents/${agent.id}/test`} className="rounded-[16px] bg-[var(--text-strong)] px-4 py-3 text-center text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]">
                    Rehearse in test
                  </Link>
                  <Link href={`/agents/${agent.id}/deploy`} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-center text-[0.8rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]">
                    Review deploy readiness
                  </Link>
                  <Link href={`/agents/${agent.id}/monitor`} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-center text-[0.8rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]">
                    Inspect live evidence
                  </Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
                <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.56)]">Current runtime stance</div>
                <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.03em]">
                  The build surface shapes what callers actually hear.
                </h3>
                <p className="mt-3 text-[0.82rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                  Right now the live runtime already consumes prompt, voice, and opening-message data. This page is the calmer editing home for those levers.
                </p>
              </section>
            </div>
          </form>
        </>
      ) : null}
    </ConsoleShell>
  );
}