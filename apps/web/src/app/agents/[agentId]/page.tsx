import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { AgentWorkspaceHeader } from "@/components/agent-workspace-header";
import { AgentPromptField } from "@/components/agent-prompt-field";
import { FormSubmitButton } from "@/components/form-submit-button";
import { AgentStatus } from "@prisma/client";
import { archiveAgentAction, updateAgentAction } from "@/app/_actions/agents";
import { getAgentByIdForUser, listPhoneNumbersForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";

type AgentDetailPageProps = {
  params: Promise<{
    agentId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    updated?: string;
    archived?: string;
  }>;
};

function callStatusClassName(status: string) {
  if (status === "COMPLETED") {
    return "text-[#2f6f49]";
  }

  if (status === "IN_PROGRESS") {
    return "text-[#2463eb]";
  }

  if (status === "FAILED" || status === "CANCELED" || status === "NO_ANSWER" || status === "BUSY") {
    return "text-[#a05b41]";
  }

  return "text-[var(--text-subtle)]";
}

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

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return "—";
  }

  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
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

export default async function AgentDetailPage({ params, searchParams }: AgentDetailPageProps) {
  const session = await requireSession();
  const { agentId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const agent = await getAgentByIdForUser(session.email, agentId);
  const phoneNumbers = await listPhoneNumbersForUser(session.email);
  const availablePhoneNumbers = phoneNumbers.filter(
    (phoneNumber) => !phoneNumber.assignedAgentId || phoneNumber.assignedAgentId === agent?.id,
  );

  const hasPrompt = Boolean(agent?.systemPrompt.trim());
  const hasFirstMessage = Boolean(agent?.firstMessage?.trim());
  const hasVoice = Boolean(agent?.voiceModel?.trim());
  const hasAssignedNumber = Boolean(agent?.phoneNumbers.length);
  const isCallable = agent?.status === AgentStatus.ACTIVE && agent.isActive;
  const latestCall = agent?.calls[0] ?? null;
  const transcriptCalls = agent?.calls.filter((call) => Boolean(call.transcriptText?.trim())).length ?? 0;
  const completedCalls = agent?.calls.filter((call) => call.status === "COMPLETED").length ?? 0;
  const setupChecks = [hasPrompt, hasFirstMessage, hasVoice, hasAssignedNumber, Boolean(isCallable)];
  const overviewScore = setupChecks.filter(Boolean).length;

  const workspaceCards = agent
    ? [
        {
          label: "Build",
          href: `/agents/${agent.id}/build`,
          value: hasPrompt && hasVoice ? "Configured" : "Needs shaping",
          note: hasPrompt
            ? "Prompt, voice, and opening behavior live here."
            : "Start by giving the runtime clearer instructions.",
        },
        {
          label: "Test",
          href: `/agents/${agent.id}/test`,
          value: overviewScore === setupChecks.length ? "Ready to rehearse" : "Preflight first",
          note: hasAssignedNumber
            ? "Rehearse the next inbound call before a live demo."
            : "Assign a line before expecting a meaningful phone test.",
        },
        {
          label: "Deploy",
          href: `/agents/${agent.id}/deploy`,
          value: isCallable && hasAssignedNumber ? "Callable" : "Routing incomplete",
          note: isCallable
            ? "Lifecycle, routing, and eligibility can be managed here."
            : "This is where launch posture becomes explicit.",
        },
        {
          label: "Monitor",
          href: `/agents/${agent.id}/monitor`,
          value: latestCall ? `${agent.calls.length} calls logged` : "No proof yet",
          note: latestCall
            ? "Review recent calls and route fixes back into build."
            : "Your next real call will turn this into a proof loop.",
        },
      ]
    : [];

  const overviewChecklist = [
    {
      label: "Prompt is defined",
      ready: hasPrompt,
      detail: hasPrompt
        ? "The runtime has a real instruction set instead of a blank personality shell."
        : "Add a system prompt so the agent has actual behavioral guardrails.",
    },
    {
      label: "Opening experience is intentional",
      ready: hasFirstMessage && hasVoice,
      detail: hasFirstMessage && hasVoice
        ? `Caller hears “${agent?.firstMessage}” with ${agent?.voiceModel}.`
        : "Set both the first message and voice model before you trust the first impression.",
    },
    {
      label: "Inbound routing exists",
      ready: hasAssignedNumber,
      detail: hasAssignedNumber
        ? `${agent?.phoneNumbers[0]?.phoneNumber} is attached to this agent record.`
        : "Assign a number so inbound traffic has somewhere useful to land.",
    },
    {
      label: "Agent is callable",
      ready: Boolean(isCallable),
      detail: isCallable
        ? "Lifecycle state and active toggle both allow runtime assignment."
        : "Move the agent to ACTIVE and keep it callable before treating it as live.",
    },
  ];

  return (
    <ConsoleShell
      section="agents"
      eyebrow="Agent detail"
      title={agent?.name || `Agent ${agentId}`}
      description={
        agent
          ? "Tune identity, prompt, routing, and runtime readiness from the same record that powers number assignment and live inbound resolution."
          : "This route is ready to become the real per-agent workspace for prompts, voice tuning, activation, and number mapping."
      }
      userEmail={session.email}
    >
      {resolvedSearchParams?.updated ? (
        <div className="mb-5 rounded-[18px] border border-[color:rgba(64,145,95,0.24)] bg-[var(--success-soft)] px-5 py-4 text-sm text-[#2f6f49]">
          Agent changes saved successfully.
        </div>
      ) : null}

      {resolvedSearchParams?.archived ? (
        <div className="mb-5 rounded-[18px] border border-[color:rgba(64,145,95,0.24)] bg-[var(--success-soft)] px-5 py-4 text-sm text-[#2f6f49]">
          Agent archived successfully and any assigned numbers were released.
        </div>
      ) : null}

      {resolvedSearchParams?.error ? (
        <div className="mb-5 rounded-[18px] border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-5 py-4 text-sm text-[#8d6336]">
          {resolvedSearchParams.error === "database-unavailable"
            ? "Database is not configured yet, so the update could not be persisted."
            : resolvedSearchParams.error === "missing-required-fields"
              ? "Name and system prompt are required."
              : resolvedSearchParams.error === "not-found"
                ? "That agent could not be found for the current user."
              : "Something prevented the update from being applied."}
        </div>
      ) : null}

      {agent ? (
        <>
          <AgentWorkspaceHeader agent={agent} currentView="overview" />

          <div className="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
                  Agent overview
                </div>
                <div
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-[0.68rem] font-medium",
                    overviewScore === setupChecks.length
                      ? "bg-[color:rgba(86,149,113,0.16)] text-[#bde2c7]"
                      : "bg-[color:rgba(238,189,142,0.16)] text-[#f1d4b4]",
                  ].join(" ")}
                >
                  {overviewScore === setupChecks.length
                    ? `Launch-ready basics · ${overviewScore}/${setupChecks.length}`
                    : `Needs setup · ${overviewScore}/${setupChecks.length}`}
                </div>
              </div>

              <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
                <div>
                  <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.04em] sm:text-[1.82rem]">
                    The overview should answer the operator’s first question: what does this agent need next?
                  </h2>
                  <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                    This is now the home base for one agent. It pulls build quality, test posture, deploy readiness, and live proof into one place, then keeps the core editing controls close enough to fix what matters without tab-hopping like a caffeinated squirrel.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    <Link
                      href={`/agents/${agent.id}/test`}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                    >
                      Open test workspace
                    </Link>
                    <Link
                      href={`/agents/${agent.id}/deploy`}
                      className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                    >
                      Review deploy posture
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Lifecycle", `${agent.status}${agent.isActive ? " · callable" : " · inactive"}`],
                    ["Assigned line", agent.phoneNumbers[0]?.phoneNumber || "No number assigned"],
                    ["Recent proof", latestCall ? latestCall.status.replaceAll("_", " ") : "No call proof yet"],
                    ["Transcript coverage", agent.calls.length ? `${Math.round((transcriptCalls / agent.calls.length) * 100)}%` : "0%"],
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
                  <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Operator snapshot</h3>
                  <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                    A fast read on whether this agent is only configured on paper or actually ready to answer the next call.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                  {completedCalls}/{agent.calls.length} completed
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {overviewChecklist.map((item) => (
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

          <form action={updateAgentAction} id="agent-detail-form" className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.95fr)]">
            <input type="hidden" name="agentId" value={agent.id} />
            <input type="hidden" name="returnTo" value={`/agents/${agent.id}`} />
            <div className="space-y-5">
              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-soft)] px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Identity</h3>
                </div>
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Agent name</span>
                    <input
                      type="text"
                      name="name"
                      defaultValue={agent.name}
                      required
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Role or use case</span>
                    <input
                      type="text"
                      name="description"
                      defaultValue={agent.description ?? ""}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                </div>
              </section>

              <AgentPromptField initialPrompt={agent.systemPrompt} agentName={agent.name} required />

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-soft)] px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Voice and caller experience</h3>
                </div>
                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <label className="space-y-1.5 sm:col-span-2">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">First message</span>
                    <input
                      type="text"
                      name="firstMessage"
                      defaultValue={agent.firstMessage ?? ""}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Voice model</span>
                    <input
                      type="text"
                      name="voiceModel"
                      defaultValue={agent.voiceModel ?? ""}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Transfer number</span>
                    <input
                      type="text"
                      name="transferNumber"
                      defaultValue={agent.transferNumber ?? ""}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    />
                  </label>
                </div>
              </section>

              <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-5 py-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-[0.82rem] leading-6 text-[var(--text-body)]">
                  Saving here updates the real agent record, remaps the selected number if needed, and keeps the overview aligned with the same live runtime contract used everywhere else.
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <FormSubmitButton
                    label="Save agent changes"
                    pendingLabel="Saving changes…"
                    className="rounded-[16px] bg-[var(--text-strong)] px-4 py-2.5 text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)] disabled:cursor-wait disabled:opacity-75"
                  />
                  <button
                    type="submit"
                    formAction={archiveAgentAction}
                    className="rounded-[16px] border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-4 py-2.5 text-[0.8rem] font-medium text-[#8d6336] transition hover:bg-[color:rgba(224,204,168,0.7)]"
                  >
                    Archive agent
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-soft)] px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Status and routing</h3>
                </div>
                <div className="space-y-4 p-5">
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Lifecycle status</span>
                    <select
                      name="status"
                      defaultValue={agent.status}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.82rem] text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    >
                      {Object.values(AgentStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-[0.72rem] text-[var(--text-subtle)]">Assigned phone number</span>
                    <select
                      name="phoneNumberId"
                      defaultValue={agent.phoneNumbers[0]?.id ?? ""}
                      className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.82rem] text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                    >
                      <option value="">No number assigned</option>
                      {availablePhoneNumbers.map((phoneNumber) => (
                        <option key={phoneNumber.id} value={phoneNumber.id}>
                          {phoneNumber.friendlyName
                            ? `${phoneNumber.friendlyName} · ${phoneNumber.phoneNumber}`
                            : phoneNumber.phoneNumber}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-start gap-3 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-3 text-[0.8rem] text-[var(--text-body)]">
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={agent.isActive}
                      className="mt-0.5 h-4 w-4 rounded border border-[var(--border-soft)] bg-[var(--canvas)]"
                    />
                    <span>Agent is active and available for runtime assignment.</span>
                  </label>
                  <p className="text-[0.75rem] leading-6 text-[var(--text-subtle)]">
                    Only agents with lifecycle status <span className="font-semibold text-[var(--text-strong)]">ACTIVE</span> can stay callable. Saving any other status will automatically mark the agent inactive.
                  </p>
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Next best actions</h3>
                  <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                    Command center
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-2.5">
                  <Link href={`/agents/${agent.id}/build`} className="rounded-[16px] bg-[var(--text-strong)] px-4 py-3 text-center text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]">
                    Refine build settings
                  </Link>
                  <Link href={`/agents/${agent.id}/test`} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-center text-[0.8rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]">
                    Rehearse the next call
                  </Link>
                  <Link href={`/agents/${agent.id}/deploy`} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-center text-[0.8rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]">
                    Review deploy readiness
                  </Link>
                  <Link href={`/agents/${agent.id}/monitor`} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-center text-[0.8rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]">
                    Inspect live evidence
                  </Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-soft)] px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Connected records</h3>
                </div>
                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Agent ID", value: agent.id },
                      { label: "Created", value: formatDate(agent.createdAt) },
                      { label: "Updated", value: formatDate(agent.updatedAt) },
                        { label: "Calls", value: agent.calls.length.toString() },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-3"
                      >
                        <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                          {item.label}
                        </div>
                        <div className="mt-1 text-[0.78rem] text-[var(--text-body)]">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                      Assigned numbers
                    </div>
                    {agent.phoneNumbers.length ? (
                      <div className="mt-3 space-y-2">
                  {agent.phoneNumbers.map((phoneNumber) => (
                    <div
                      key={phoneNumber.id}
                      className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-3"
                    >
                      <div className="text-[0.8rem] font-medium text-[var(--text-strong)]">
                        {phoneNumber.friendlyName || "Assigned number"}
                      </div>
                      <div className="mt-1 font-mono text-[0.74rem] text-[var(--text-body)]">
                        {phoneNumber.phoneNumber}
                      </div>
                    </div>
                  ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-[0.78rem] leading-6 text-[var(--text-subtle)]">
                        No phone number is assigned yet. Pick one above to make this agent reachable from an inbound call.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Recent calls</h3>
                  <Link href="/calls" className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
                    View all →
                  </Link>
                </div>
                <div className="divide-y divide-[var(--border-soft)]">
                  {agent.calls.length ? (
                    agent.calls.map((call) => (
                      <Link
                        key={call.id}
                        href={`/calls/${call.id}`}
                        className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-[var(--surface-subtle)]/55"
                      >
                        <div>
                          <div className="font-mono text-[0.74rem] text-[var(--text-body)]">
                            {call.callerNumber || call.toNumber || "Unknown caller"}
                          </div>
                          <div className="mt-1 text-[0.68rem] text-[var(--text-subtle)]">
                            {formatDateTime(call.startedAt || call.createdAt)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-[0.7rem] text-[var(--text-subtle)]">
                            {formatDuration(call.durationSeconds)}
                          </div>
                          <div className={`mt-1 text-[0.68rem] font-medium ${callStatusClassName(call.status)}`}>
                            {call.status}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-5 py-5 text-[0.78rem] leading-6 text-[var(--text-subtle)]">
                      No calls have been logged for this agent yet.
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
                <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.56)]">Overview note</div>
                <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.03em]">
                  A good overview reduces uncertainty before the phone rings.
                </h3>
                <p className="mt-3 text-[0.82rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                  Build shapes the behavior, deploy controls the route, test checks the setup, and monitor closes the proof loop. This page now connects those jobs instead of pretending they are unrelated islands.
                </p>
                {latestCall ? (
                  <div className="mt-4 rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                    <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.5)]">Latest proof point</div>
                    <div className="mt-2 text-[0.82rem] text-[var(--surface-dark-foreground)]">
                      Last call was {latestCall.status.toLowerCase().replaceAll("_", " ")} at {formatDateTime(latestCall.startedAt || latestCall.createdAt)} for {formatDuration(latestCall.durationSeconds)}.
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          </form>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Prompt", "System prompt editor will live here."],
            ["Voice", "Voice model, language, and first-message controls."],
            ["Activation", "Status toggles and runtime readiness checks."],
            ["Number mapping", "Twilio number assignment and transfer behavior."],
          ].map(([title, body]) => (
            <article
              key={title}
              className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
            >
              <h2 className="text-lg font-semibold text-[var(--text-strong)]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{body}</p>
            </article>
          ))}
        </div>
      )}
    </ConsoleShell>
  );
}