import Link from "next/link";
import { AgentStatus } from "@prisma/client";
import { ConsoleShell } from "@/components/console-shell";
import { AgentWorkspaceHeader } from "@/components/agent-workspace-header";
import { FormSubmitButton } from "@/components/form-submit-button";
import { updateAgentAction } from "@/app/_actions/agents";
import { getAgentByIdForUser, listPhoneNumbersForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";
import { getSettingsReadiness } from "@/lib/settings-data";

type AgentDeployPageProps = {
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

function readinessTone(ready: boolean) {
  return ready
    ? "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]"
    : "border-[color:rgba(160,91,65,0.18)] bg-[var(--warning-soft)] text-[#8d6336]";
}

export default async function AgentDeployPage({ params, searchParams }: AgentDeployPageProps) {
  const session = await requireSession();
  const { agentId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const agent = await getAgentByIdForUser(session.email, agentId);
  const phoneNumbers = await listPhoneNumbersForUser(session.email);
  const readiness = await getSettingsReadiness();
  const availablePhoneNumbers = phoneNumbers.filter(
    (phoneNumber) => !phoneNumber.assignedAgentId || phoneNumber.assignedAgentId === agent?.id,
  );

  const hasAssignedNumber = Boolean(agent?.phoneNumbers[0]);
  const hasPrompt = Boolean(agent?.systemPrompt.trim());
  const hasVoice = Boolean(agent?.voiceModel?.trim());
  const hasOpeningLine = Boolean(agent?.firstMessage?.trim());
  const isCallable = agent?.status === AgentStatus.ACTIVE && agent.isActive;
  const runtimeReachable = readiness.runtimeHealth.status === "reachable";
  const runtimeReady = readiness.runtimeReadiness.status === "reachable";
  const deployChecks = [
    hasAssignedNumber,
    hasPrompt,
    hasVoice,
    hasOpeningLine,
    Boolean(isCallable),
    runtimeReachable,
    runtimeReady,
  ];
  const deployScore = deployChecks.filter(Boolean).length;
  const deployReady = deployScore === deployChecks.length;
  const latestCall = agent?.calls[0] ?? null;

  const launchChecklist = [
    {
      label: "Assigned number",
      ready: hasAssignedNumber,
      detail: hasAssignedNumber
        ? `${agent?.phoneNumbers[0]?.phoneNumber} is attached and eligible for inbound resolution.`
        : "Pick a number here before expecting the runtime to route calls into this agent.",
    },
    {
      label: "Lifecycle + callable state",
      ready: Boolean(isCallable),
      detail: isCallable
        ? "This agent is ACTIVE and marked callable for runtime assignment."
        : "Only ACTIVE agents that remain callable should be treated as live routing targets.",
    },
    {
      label: "Prompt",
      ready: hasPrompt,
      detail: hasPrompt
        ? "Behavior instructions exist, so the runtime has a real operating brief."
        : "Deploying without a prompt is asking the runtime to improvise with confidence it has not earned.",
    },
    {
      label: "Voice + opening",
      ready: hasVoice && hasOpeningLine,
      detail: hasVoice && hasOpeningLine
        ? `Voice model and opening line are both defined for the first caller impression.`
        : "Set both a voice model and a first message before calling this truly launch-ready.",
    },
    {
      label: "Runtime health",
      ready: runtimeReachable,
      detail: runtimeReachable
        ? readiness.runtimeHealth.detail
        : readiness.runtimeHealth.detail,
    },
    {
      label: "Runtime readiness",
      ready: runtimeReady,
      detail: runtimeReady
        ? readiness.runtimeReadiness.detail
        : readiness.runtimeReadiness.detail,
    },
  ];

  const inboundPath = [
    {
      label: "Number resolution",
      body: hasAssignedNumber
        ? `Inbound traffic to ${agent?.phoneNumbers[0]?.phoneNumber} can resolve through the shared runtime contract.`
        : "No number is assigned yet, so an inbound call cannot route cleanly to this agent.",
    },
    {
      label: "Agent eligibility",
      body: isCallable
        ? "Lifecycle state allows this agent to answer live traffic right now."
        : "The runtime should not treat this agent as a safe live target until its status and callable toggle align.",
    },
    {
      label: "Caller experience",
      body: hasOpeningLine
        ? `Caller hears: “${agent?.firstMessage}”`
        : "No defined first message yet, so the deploy posture is still soft around the opening experience.",
    },
    {
      label: "Proof loop",
      body: latestCall
        ? `Latest evidence was ${latestCall.status.toLowerCase().replaceAll("_", " ")} at ${formatDateTime(latestCall.startedAt || latestCall.createdAt)}.`
        : "No recent call proof exists yet, so the next live inbound call will be the first meaningful deploy validation.",
    },
  ];

  return (
    <ConsoleShell
      section="agents"
      eyebrow="Agent deploy"
      title={agent ? `Deploy ${agent.name}` : `Deploy agent ${agentId}`}
      description="Map numbers, control runtime eligibility, and make the inbound resolution contract explicit."
      userEmail={session.email}
    >
      {resolvedSearchParams?.updated ? (
        <div className="mb-5 rounded-[18px] border border-[color:rgba(64,145,95,0.24)] bg-[var(--success-soft)] px-5 py-4 text-sm text-[#2f6f49]">
          Deploy settings saved successfully.
        </div>
      ) : null}

      {resolvedSearchParams?.error ? (
        <div className="mb-5 rounded-[18px] border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-5 py-4 text-sm text-[#8d6336]">
          {resolvedSearchParams.error === "database-unavailable"
            ? "Database is not configured yet, so deploy changes could not be persisted."
            : resolvedSearchParams.error === "missing-required-fields"
              ? "Agent name and system prompt are still required before deployment changes can save."
              : "Something prevented the deploy changes from being saved."}
        </div>
      ) : null}

      {agent ? (
        <>
          <AgentWorkspaceHeader agent={agent} currentView="deploy" />

          <div className="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
                  Deploy posture
                </div>
                <div
                  className={[
                    "inline-flex rounded-full px-3 py-1 text-[0.68rem] font-medium",
                    deployReady
                      ? "bg-[color:rgba(86,149,113,0.16)] text-[#bde2c7]"
                      : "bg-[color:rgba(238,189,142,0.16)] text-[#f1d4b4]",
                  ].join(" ")}
                >
                  {deployReady ? `Launch-ready · ${deployScore}/${deployChecks.length}` : `Needs setup · ${deployScore}/${deployChecks.length}`}
                </div>
              </div>

              <h2 className="mt-4 font-display text-[1.45rem] font-semibold tracking-[-0.04em] sm:text-[1.72rem]">
                Deploy should answer one question fast: will the next inbound call land cleanly?
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                This surface now treats deployment like a real launch gate: routing, callable state, platform posture, and the opening caller experience all sit next to the settings you can change.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Assigned line", agent.phoneNumbers[0]?.phoneNumber || "No number assigned"],
                  ["Lifecycle", `${agent.status}${agent.isActive ? " · callable" : " · inactive"}`],
                  ["Runtime health", readiness.runtimeHealth.status],
                  ["Runtime readiness", readiness.runtimeReadiness.readinessStatus || readiness.runtimeReadiness.status],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                    <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(229,226,225,0.48)]">{label}</div>
                    <div className="mt-2 text-[0.82rem] text-[var(--surface-dark-foreground)]">{value}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Launch checklist</h3>
                  <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                    A tighter read on whether this agent is ready for a real inbound call.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                  {deployScore}/{deployChecks.length}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {launchChecklist.map((item) => (
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

          <form action={updateAgentAction} className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.9fr)]">
            <input type="hidden" name="agentId" value={agent.id} />
            <input type="hidden" name="returnTo" value={`/agents/${agent.id}/deploy`} />
            <input type="hidden" name="name" value={agent.name} />
            <input type="hidden" name="description" value={agent.description ?? ""} />
            <input type="hidden" name="systemPrompt" value={agent.systemPrompt} />
            <input type="hidden" name="firstMessage" value={agent.firstMessage ?? ""} />
            <input type="hidden" name="voiceModel" value={agent.voiceModel ?? ""} />
            <input type="hidden" name="transferNumber" value={agent.transferNumber ?? ""} />

            <div className="space-y-5">
              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="border-b border-[var(--border-soft)] px-5 py-4">
                  <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Routing and lifecycle</h3>
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
                    <span>Agent is active and eligible for runtime assignment.</span>
                  </label>

                  <p className="text-[0.75rem] leading-6 text-[var(--text-subtle)]">
                    Only agents marked <span className="font-semibold text-[var(--text-strong)]">ACTIVE</span> can stay callable. Saving any other lifecycle status will automatically disable runtime assignment.
                  </p>
                </div>
              </section>

              <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-5 py-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-2xl text-[0.82rem] leading-6 text-[var(--text-body)]">
                  Deployment changes flow directly into the number-resolution contract the voice runtime uses when inbound calls hit the system.
                </p>
                <FormSubmitButton
                  label="Save deploy settings"
                  pendingLabel="Saving deploy…"
                  className="rounded-[16px] bg-[var(--text-strong)] px-4 py-2.5 text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)] disabled:cursor-wait disabled:opacity-75"
                />
              </div>
            </div>

            <div className="space-y-5">
              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">If the phone rang right now</h3>
                <div className="mt-4 grid gap-3">
                  {inboundPath.map((item, index) => (
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

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Runtime contract</h3>
                <p className="mt-2 text-[0.8rem] leading-6 text-[var(--text-body)]">
                  Inbound calls resolve agent config through the shared product API once the number assignment is persisted.
                </p>
                <div className="mt-4 rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                  /api/runtime/resolve-agent?phoneNumber=%2B15551234567
                </div>
                <p className="mt-3 text-[0.75rem] leading-6 text-[var(--text-subtle)]">
                  Requests must include the runtime secret header before the web app returns live routing details.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5 text-sm">
                  <Link href="/settings" className="rounded-[16px] bg-[var(--text-strong)] px-4 py-3 text-[0.78rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]">
                    Review platform readiness
                  </Link>
                  <Link href={`/agents/${agent.id}/monitor`} className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-[0.78rem] font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]">
                    Open monitor
                  </Link>
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Current deployment summary</h3>
                <div className="mt-4 space-y-3">
                  {[
                    ["Assigned number", agent.phoneNumbers[0]?.phoneNumber || "None yet"],
                    ["Lifecycle", agent.status],
                    ["Callable", agent.isActive ? "Yes" : "No"],
                    ["Recent calls", agent.calls.length.toString()],
                    ["Latest proof", latestCall ? formatDateTime(latestCall.startedAt || latestCall.createdAt) : "No call proof yet"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-3">
                      <span className="text-[0.74rem] text-[var(--text-subtle)]">{label}</span>
                      <span className="text-[0.78rem] font-medium text-[var(--text-strong)]">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
                <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.56)]">Operator note</div>
                <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.03em]">
                  Good deployment is boring on purpose.
                </h3>
                <p className="mt-3 text-[0.82rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                  The ideal deploy surface removes surprises: the number is mapped, the runtime is reachable, the agent is callable, and the first caller impression is already chosen before the phone ever rings.
                </p>
              </section>
            </div>
          </form>
        </>
      ) : null}
    </ConsoleShell>
  );
}