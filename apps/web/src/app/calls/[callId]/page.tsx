import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { requireSession } from "@/lib/auth";
import { getCallByIdForUser } from "@/lib/call-data";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

function formatDuration(value: number | null | undefined) {
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

function formatLabel(value: string) {
  return value.replaceAll("_", " ").replaceAll("-", " ");
}

function sentenceCase(value: string) {
  const formatted = formatLabel(value).toLowerCase();
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatValue(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : null;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    const items = value.map((item) => formatValue(item)).filter(Boolean);
    return items.length ? items.join(", ") : null;
  }

  if (isRecord(value)) {
    const entries = Object.entries(value)
      .map(([key, nestedValue]) => {
        const formatted = formatValue(nestedValue);
        return formatted ? `${formatLabel(key)}: ${formatted}` : null;
      })
      .filter(Boolean);

    return entries.length ? entries.join(" • ") : null;
  }

  return String(value);
}

function rolePillClassName(role: string) {
  switch (role) {
    case "AGENT":
      return "border-[color:rgba(80,88,135,0.18)] bg-[color:rgba(80,88,135,0.08)] text-[#505887]";
    case "USER":
      return "border-[color:rgba(44,96,133,0.18)] bg-[color:rgba(44,96,133,0.08)] text-[#2c6085]";
    case "TOOL":
      return "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]";
    default:
      return "border-[var(--border-soft)] bg-[var(--surface-subtle)] text-[var(--text-subtle)]";
  }
}

function callStatusPillClassName(status: string) {
  switch (status) {
    case "COMPLETED":
      return "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]";
    case "IN_PROGRESS":
    case "RINGING":
      return "border-[color:rgba(44,96,133,0.18)] bg-[color:rgba(44,96,133,0.08)] text-[#2c6085]";
    case "FAILED":
    case "CANCELED":
    case "NO_ANSWER":
    case "BUSY":
      return "border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] text-[#8d6336]";
    default:
      return "border-[var(--border-soft)] bg-[var(--surface-subtle)] text-[var(--text-subtle)]";
  }
}

function outcomePillClassName(status: "success" | "warning" | "error") {
  switch (status) {
    case "success":
      return "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]";
    case "warning":
      return "border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] text-[#8d6336]";
    default:
      return "border-[color:rgba(160,91,65,0.22)] bg-[color:rgba(244,231,222,0.8)] text-[#a05b41]";
  }
}

function buildEventDetails(payload: unknown) {
  if (!isRecord(payload)) {
    return [] as Array<{ label: string; value: string }>;
  }

  const details: Array<{ label: string; value: string }> = [];
  const push = (label: string, value: unknown) => {
    const formatted = formatValue(value);

    if (formatted) {
      details.push({ label, value: formatted });
    }
  };

  push("Type", payload.type);
  push("Tool", payload.toolName);
  push("Source", payload.source);
  push("Confidence", payload.confidence);
  push("To", payload.to);
  push("From", payload.from);
  push("SID", payload.sid);
  push("Reason", payload.reason);
  push("Error", payload.message);

  if (isRecord(payload.lead)) {
    push("Lead name", payload.lead.fullName);
    push("Lead email", payload.lead.email);
    push("Lead service", payload.lead.service);
    push("Lead time", payload.lead.preferredDateTime);
    push("Lead notes", payload.lead.notes);
    push("Lead caller", payload.lead.callerNumber);
  }

  return details;
}

function inferToolOutcomeStatus(text: string | null | undefined, payload: unknown) {
  const normalizedText = (text || "").toLowerCase();
  const hasErrorMessage = isRecord(payload) && typeof payload.message === "string";

  if (
    normalizedText.includes("failed") ||
    normalizedText.includes("could not") ||
    normalizedText.includes("missing") ||
    hasErrorMessage
  ) {
    return "error" as const;
  }

  if (normalizedText.includes("queued")) {
    return "warning" as const;
  }

  return "success" as const;
}

function statusNarrative(status: string) {
  switch (status) {
    case "COMPLETED":
      return "The call finished and the runtime persisted a reviewable conversation trail.";
    case "IN_PROGRESS":
    case "RINGING":
      return "The runtime is still actively working this conversation path.";
    case "FAILED":
      return "Something in delivery or runtime handling broke before a clean finish.";
    case "NO_ANSWER":
      return "The call never settled into a real connected conversation.";
    case "BUSY":
      return "The carrier reported a busy line before the agent could get going.";
    case "CANCELED":
      return "The attempt ended early and deserves a quick operator explanation.";
    default:
      return "The conversation completed outside the happiest path and should be reviewed.";
  }
}

function reviewSignalTone(kind: "healthy" | "watch" | "risk") {
  switch (kind) {
    case "healthy":
      return "bg-[var(--success-soft)] text-[#2f6f49]";
    case "watch":
      return "bg-[color:rgba(44,96,133,0.08)] text-[#2c6085]";
    default:
      return "bg-[var(--warning-soft)] text-[#8d6336]";
  }
}

type ExtractedOutcome = {
  label: string;
  value: string;
  note: string;
};

type AttentionMoment = {
  title: string;
  body: string;
  tone: "healthy" | "watch" | "risk";
};

function isExtractedOutcome(value: ExtractedOutcome | null): value is ExtractedOutcome {
  return value !== null;
}

function isAttentionMoment(value: AttentionMoment | null): value is AttentionMoment {
  return value !== null;
}

type CallDetailPageProps = {
  params: Promise<{
    callId: string;
  }>;
};

export default async function CallDetailPage({ params }: CallDetailPageProps) {
  const session = await requireSession();
  const { callId } = await params;
  const call = await getCallByIdForUser(session.email, callId);

  const metadata = call && isRecord(call.metadata) ? call.metadata : null;
  const latestLeadCapture = metadata && isRecord(metadata.latestLeadCapture) ? metadata.latestLeadCapture : null;
  const toolEvents = call?.events.filter((event) => event.role === "TOOL") ?? [];
  const transcriptEvents = call?.events.filter((event) => event.role === "AGENT" || event.role === "USER") ?? [];
  const operatorEvents = call?.events.filter((event) => event.role !== "AGENT" && event.role !== "USER") ?? [];
  const toolOutcomeCounts = toolEvents.reduce(
    (counts, event) => {
      const status = inferToolOutcomeStatus(event.text, event.payload);
      counts[status] += 1;
      return counts;
    },
    {
      success: 0,
      warning: 0,
      error: 0,
    },
  );

  const reviewChecklist = call
    ? [
        {
          title: "Transcript evidence is visible",
          done: transcriptEvents.length > 0 || Boolean(call.transcriptText),
          note: "A review page feels credible when you can immediately see what was said, not just how the row was labeled.",
        },
        {
          title: "Runtime outcome is explainable",
          done: call.status === "COMPLETED" || toolOutcomeCounts.error === 0,
          note: "Failed tools or failed calls should have enough surface evidence that an operator can explain what happened in one pass.",
        },
        {
          title: "Agent and route are attributed",
          done: Boolean(call.agent?.name) && Boolean(call.phoneNumber?.phoneNumber || call.toNumber),
          note: "Every reviewable call should make ownership and routing obvious before anyone scrolls into metadata.",
        },
        {
          title: "Captured outcomes are preserved",
          done: Boolean(call.summary || latestLeadCapture || toolEvents.length),
          note: "Summaries, lead capture, or tool actions keep the page grounded in outcome proof instead of transcript vibes alone.",
        },
      ]
    : [];

  const extractedOutcomes = call
    ? [
        {
          label: "Call outcome",
          value: sentenceCase(call.status),
          note: statusNarrative(call.status),
        },
        latestLeadCapture
          ? {
              label: "Lead capture",
              value: formatValue(latestLeadCapture.fullName) || formatValue(latestLeadCapture.email) || "Captured",
              note:
                formatValue(latestLeadCapture.service)
                  ? `Requested ${formatValue(latestLeadCapture.service)}${formatValue(latestLeadCapture.preferredDateTime) ? ` around ${formatValue(latestLeadCapture.preferredDateTime)}` : ""}.`
                  : "Lead details were captured during the conversation.",
            }
          : null,
        toolEvents.length > 0
          ? {
              label: "Runtime tools",
              value: `${toolEvents.length} action${toolEvents.length === 1 ? "" : "s"}`,
              note:
                toolOutcomeCounts.error > 0
                  ? `${toolOutcomeCounts.error} tool action${toolOutcomeCounts.error === 1 ? "" : "s"} recorded an error outcome.`
                  : toolOutcomeCounts.warning > 0
                    ? `${toolOutcomeCounts.warning} tool action${toolOutcomeCounts.warning === 1 ? "" : "s"} finished in a queued or watch state.`
                    : "Runtime actions completed without an obvious error signal.",
            }
          : null,
        call.summary
          ? {
              label: "Operator summary",
              value: "Available",
              note: call.summary,
            }
          : null,
      ].filter(isExtractedOutcome)
    : [];

  const attentionMoments = call
    ? [
        toolOutcomeCounts.error > 0
          ? {
              title: "Tool action needs review",
              body: `${toolOutcomeCounts.error} runtime action${toolOutcomeCounts.error === 1 ? "" : "s"} ended with an error signal. Check the tool proof panel before trusting the outcome story.`,
              tone: "risk" as const,
            }
          : null,
        !call.transcriptText && transcriptEvents.length === 0
          ? {
              title: "Transcript proof is thin",
              body: "This call has very little transcript evidence yet, so the metadata tells more of the story than the conversation itself.",
              tone: "watch" as const,
            }
          : null,
        latestLeadCapture
          ? {
              title: "Useful business outcome captured",
              body: `Lead capture is present${formatValue(latestLeadCapture.fullName) ? ` for ${formatValue(latestLeadCapture.fullName)}` : ""}, which makes this call more than just a transcript artifact.`,
              tone: "healthy" as const,
            }
          : null,
        call.status !== "COMPLETED"
          ? {
              title: "Outcome deserves operator framing",
              body: statusNarrative(call.status),
              tone: call.status === "FAILED" ? ("risk" as const) : ("watch" as const),
            }
          : null,
      ].filter(isAttentionMoment)
    : [];

  return (
    <ConsoleShell
      section="calls"
      eyebrow="Call detail"
      title={call?.agent?.name ? `${call.agent.name} call` : `Call ${callId}`}
      description="Review the full conversation, inspect runtime actions, and verify what the agent actually did behind the scenes during the call."
      userEmail={session.email}
    >
      {call ? (
        <div className="space-y-6">
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
              <Link
                href="/calls"
                className="inline-flex items-center gap-1.5 text-[0.74rem] text-[color:rgba(229,226,225,0.66)] transition hover:text-[var(--surface-dark-foreground)]"
              >
                ← Back to calls
              </Link>
              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
                Demo review workspace
              </div>
              <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.88fr)] lg:items-end">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] sm:text-[1.9rem]">
                      {call.agent?.name || "Unassigned agent"} handled this conversation.
                    </h2>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.18em] ${callStatusPillClassName(call.status)}`}
                    >
                      {sentenceCase(call.status)}
                    </span>
                  </div>
                  <p className="mt-3 max-w-3xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                    Review the transcript, inspect what the runtime actually did, and walk away with an explanation sturdy enough for a demo instead of a shrug dressed as observability.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 text-sm">
                    {call.agent?.id ? (
                      <Link
                        href={`/agents/${call.agent.id}/monitor`}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                      >
                        Open agent monitor
                      </Link>
                    ) : null}
                    {call.agent?.id ? (
                      <Link
                        href={`/agents/${call.agent.id}`}
                        className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                      >
                        View agent overview
                      </Link>
                    ) : null}
                    <Link
                      href="/numbers"
                      className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                    >
                      Review routing
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Caller", value: call.callerNumber || "Unknown" },
                    { label: "Route", value: call.toNumber || call.phoneNumber?.phoneNumber || "Unknown" },
                    { label: "Duration", value: formatDuration(call.durationSeconds) },
                    { label: "Timeline events", value: String(call.events.length) },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                      <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(229,226,225,0.48)]">{item.label}</div>
                      <div className="mt-2 text-[1rem] font-semibold text-[var(--surface-dark-foreground)]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Review posture</h3>
                  <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                    A compact read on whether this page already tells a clean story or still needs operator interpretation.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                  {reviewChecklist.filter((item) => item.done).length}/{reviewChecklist.length}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {reviewChecklist.map((item) => (
                  <div key={item.title} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.72rem] font-semibold ${item.done ? "bg-[var(--success-soft)] text-[#2f6f49]" : "bg-[var(--warning-soft)] text-[#8d6336]"}`}
                      >
                        {item.done ? "✓" : "!"}
                      </span>
                      <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{item.title}</div>
                    </div>
                    <p className="mt-3 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">Call status</p>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${callStatusPillClassName(call.status)}`}
                >
                  {sentenceCase(call.status)}
                </span>
              </div>
              <p className="mt-3 text-[0.8rem] leading-6 text-[var(--text-body)]">{statusNarrative(call.status)}</p>
            </article>

            <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">Conversation proof</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text-strong)]">{transcriptEvents.length || call.transcriptText ? "Visible" : "Thin"}</p>
              <p className="mt-2 text-[0.8rem] text-[var(--text-body)]">
                {transcriptEvents.length > 0 || call.transcriptText
                  ? `${transcriptEvents.length} spoken event${transcriptEvents.length === 1 ? "" : "s"} plus transcript text${call.transcriptText ? " available" : " pending"}.`
                  : "Transcript evidence has not fully landed yet, so the page leans more on metadata than dialogue."}
              </p>
            </article>

            <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">Runtime actions</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text-strong)]">{toolEvents.length}</p>
              <p className="mt-2 text-[0.8rem] text-[var(--text-body)]">
                {toolOutcomeCounts.error > 0
                  ? `${toolOutcomeCounts.error} action${toolOutcomeCounts.error === 1 ? "" : "s"} ended in error state.`
                  : toolOutcomeCounts.warning > 0
                    ? `${toolOutcomeCounts.warning} action${toolOutcomeCounts.warning === 1 ? "" : "s"} still deserves a quick look.`
                    : toolEvents.length > 0
                      ? "Runtime actions look clean from the top line."
                      : "No tools were triggered during this conversation."}
              </p>
            </article>

            <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-subtle)]">Timestamps</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text-strong)]">{formatDuration(call.durationSeconds)}</p>
              <p className="mt-2 text-[0.8rem] text-[var(--text-body)]">
                Started {formatDateTime(call.startedAt || call.createdAt)}
              </p>
            </article>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
            <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-[1.02rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Extracted outcomes</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
                    The fast operator read: what happened, what business value was captured, and whether the runtime left enough evidence to trust the story.
                  </p>
                </div>
                <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                  review → explain → improve
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {extractedOutcomes.map((item) => (
                  <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                    <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                    <div className="mt-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                    <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Attention queue</h2>
                  <p className="mt-1 text-[0.78rem] leading-6 text-[var(--text-subtle)]">
                    The moments worth mentioning before this call becomes part of a live demo narrative.
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                  {attentionMoments.length}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {attentionMoments.length > 0 ? (
                  attentionMoments.map((item) => (
                    <div key={item.title} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${reviewSignalTone(item.tone)}`}>
                          {item.tone}
                        </span>
                        <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{item.title}</div>
                      </div>
                      <p className="mt-3 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.body}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 text-[0.78rem] leading-6 text-[var(--text-body)]">
                    No special attention flags surfaced from the current evidence set. Delightfully boring, which is exactly what a demo reviewer wants.
                  </div>
                )}
              </div>
            </article>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
            <div className="space-y-5">
              <article className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
                <div className="flex flex-col gap-2 border-b border-[var(--border-soft)] px-5 py-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Transcript timeline</h2>
                    <p className="mt-1 text-[0.78rem] leading-6 text-[var(--text-subtle)]">
                      Timeline clarity comes first: caller speech, agent replies, runtime actions, and system events in the order they actually happened.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                    <span>{call.events.length} total events</span>
                    <span>•</span>
                    <span>{transcriptEvents.length} spoken</span>
                    <span>•</span>
                    <span>{operatorEvents.length} operator/runtime</span>
                  </div>
                </div>
                {call.events.length === 0 ? (
                  <div className="px-5 py-5 text-[0.8rem] leading-6 text-[var(--text-body)]">
                    No transcript events recorded yet. The runtime event API is ready; now it just needs more chatter.
                  </div>
                ) : (
                  <div className="space-y-3 p-4 sm:p-5">
                    {call.events.map((event) => {
                      const details = buildEventDetails(event.payload);

                      return (
                        <div
                          key={event.id}
                          className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${rolePillClassName(event.role)}`}
                              >
                                {event.role}
                              </span>
                              <span className="font-mono text-[0.68rem] text-[var(--text-subtle)]">#{event.sequence}</span>
                              <span className="text-[0.68rem] text-[var(--text-subtle)]">{formatDateTime(event.createdAt)}</span>
                            </div>
                            {event.startedAt || event.endedAt ? (
                              <span className="text-[0.68rem] text-[var(--text-subtle)]">
                                {event.startedAt ? formatDateTime(event.startedAt) : "—"}
                                {event.endedAt ? ` → ${formatDateTime(event.endedAt)}` : ""}
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-3 text-[0.82rem] leading-7 text-[var(--text-body)]">
                            {event.text || "No text payload"}
                          </p>

                          {details.length > 0 ? (
                            <dl className="mt-4 grid gap-3 text-[0.78rem] md:grid-cols-2 xl:grid-cols-3">
                              {details.map((detail) => (
                                <div key={`${event.id}-${detail.label}`}>
                                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                                    {detail.label}
                                  </dt>
                                  <dd className="mt-1 leading-6 text-[var(--text-body)]">{detail.value}</dd>
                                </div>
                              ))}
                            </dl>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>

              {call.transcriptText ? (
                <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                  <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Transcript text</h2>
                  <pre className="mt-4 whitespace-pre-wrap rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-4 text-[0.8rem] leading-7 text-[var(--text-body)]">
                    {call.transcriptText}
                  </pre>
                </article>
              ) : null}
            </div>

            <div className="space-y-5">
              <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Call summary</h2>
                <div className="mt-4 space-y-2.5">
                  {[
                    { label: "Outcome", value: formatLabel(call.status), accent: true },
                    { label: "Agent", value: call.agent?.name || "Unassigned" },
                    { label: "Number", value: call.phoneNumber?.phoneNumber || call.toNumber || "Unknown" },
                    { label: "External call ID", value: call.externalCallId || "—" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-3">
                      <span className="text-[0.72rem] text-[var(--text-subtle)]">{item.label}</span>
                      <span className={`text-[0.74rem] ${item.accent ? "font-medium text-[var(--text-strong)]" : "text-[var(--text-body)]"}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {call.summary ? (
                  <div className="mt-5 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                    <div className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">Call summary</div>
                    <p className="mt-2 text-[0.8rem] leading-7 text-[var(--text-body)]">{call.summary}</p>
                  </div>
                ) : null}
              </article>

              {(toolEvents.length > 0 || latestLeadCapture) ? (
                <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Action outcomes</h2>
                      <p className="mt-1 text-[0.78rem] leading-6 text-[var(--text-subtle)]">
                        Runtime tools, captured lead details, and the behind-the-scenes proof that this conversation actually accomplished something.
                      </p>
                    </div>
                    {latestLeadCapture ? (
                      <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                        Latest lead {formatDateTime(formatValue(latestLeadCapture.capturedAt))}
                      </p>
                    ) : null}
                  </div>

                  {latestLeadCapture ? (
                    <div className="mt-4 rounded-[18px] border border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] px-4 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#2f6f49]">
                          Latest lead capture
                        </h3>
                        <span className="rounded-full border border-[color:rgba(64,145,95,0.24)] px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#2f6f49]">
                          Captured
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3 text-[0.78rem] md:grid-cols-2 text-[var(--text-body)]">
                        <p>Name: {formatValue(latestLeadCapture.fullName) || "—"}</p>
                        <p>Email: {formatValue(latestLeadCapture.email) || "—"}</p>
                        <p>Service: {formatValue(latestLeadCapture.service) || "—"}</p>
                        <p>Requested time: {formatValue(latestLeadCapture.preferredDateTime) || "—"}</p>
                        <p>Caller number: {formatValue(latestLeadCapture.callerNumber) || "—"}</p>
                        <p>Captured at: {formatDateTime(formatValue(latestLeadCapture.capturedAt))}</p>
                      </div>
                      {formatValue(latestLeadCapture.notes) ? (
                        <p className="mt-3 text-[0.78rem] leading-6 text-[var(--text-body)]">
                          Notes: {formatValue(latestLeadCapture.notes)}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {toolEvents.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {toolEvents.map((event) => {
                        const payload = isRecord(event.payload) ? event.payload : null;
                        const status = inferToolOutcomeStatus(event.text, payload);
                        const toolName = typeof payload?.toolName === "string" ? payload.toolName : "runtime_action";
                        const details = buildEventDetails(payload);

                        return (
                          <div
                            key={event.id}
                            className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-4"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-[0.8rem] font-semibold text-[var(--text-strong)]">
                                {formatLabel(toolName)}
                              </span>
                              <span
                                className={`rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${outcomePillClassName(status)}`}
                              >
                                {status}
                              </span>
                              <span className="text-[0.68rem] text-[var(--text-subtle)]">{formatDateTime(event.createdAt)}</span>
                            </div>
                            <p className="mt-3 text-[0.8rem] leading-6 text-[var(--text-body)]">
                              {event.text || "Tool event recorded."}
                            </p>
                            {details.length > 0 ? (
                              <dl className="mt-4 grid gap-3 text-[0.76rem] md:grid-cols-2">
                                {details.map((detail) => (
                                  <div key={`${event.id}-${detail.label}`}>
                                    <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                                      {detail.label}
                                    </dt>
                                    <dd className="mt-1 leading-6 text-[var(--text-body)]">{detail.value}</dd>
                                  </div>
                                ))}
                              </dl>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </article>
              ) : null}

              <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
                <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Call metadata</h2>
                <div className="mt-4 grid gap-3 text-[0.78rem] md:grid-cols-2 text-[var(--text-body)]">
                  <p>Status: {call.status}</p>
                  <p>Caller: {call.callerNumber || "Unknown"}</p>
                  <p>To: {call.toNumber || call.phoneNumber?.phoneNumber || "Unknown"}</p>
                  <p>Agent: {call.agent?.name || "Unassigned"}</p>
                  <p>Duration: {call.durationSeconds ? `${call.durationSeconds}s` : "—"}</p>
                  <p>External call ID: {call.externalCallId || "—"}</p>
                  <p>Answered: {formatDateTime(call.answeredAt)}</p>
                  <p>Ended: {formatDateTime(call.endedAt)}</p>
                </div>

                {metadata ? (
                  <div className="mt-5">
                    <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">Runtime metadata</div>
                    <pre className="mt-3 whitespace-pre-wrap rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-4 text-[0.74rem] leading-6 text-[var(--text-body)]">
                      {JSON.stringify(metadata, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </article>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-[var(--text-strong)]">Call not found</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
              This call either does not exist for the current session user or the database is not configured yet.
            </p>
          </article>
        </div>
      )}
    </ConsoleShell>
  );
}