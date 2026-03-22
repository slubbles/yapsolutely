import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { requireSession } from "@/lib/auth";
import { listRecentCallsForUser } from "@/lib/call-data";
import { getDashboardMetrics } from "@/lib/dashboard-data";
import { getSettingsReadiness } from "@/lib/settings-data";

type BillingBlocker = {
  title: string;
  level: "warning" | "info";
  detail: string;
};

function formatDuration(seconds: number) {
  if (seconds <= 0) {
    return "0m";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${String(remainingSeconds).padStart(2, "0")}s`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%";
  }

  return `${Math.round(value)}%`;
}

function blockerTone(level: BillingBlocker["level"]) {
  return level === "warning"
    ? "border-[color:rgba(160,91,65,0.18)] bg-[var(--warning-soft)] text-[#8d6336]"
    : "border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 text-[var(--text-body)]";
}

export default async function BillingPage() {
  const session = await requireSession();
  const [metrics, calls, readiness] = await Promise.all([
    getDashboardMetrics(session.email),
    listRecentCallsForUser(session.email),
    getSettingsReadiness(),
  ]);

  const totalCallSeconds = calls.reduce((sum, call) => sum + (call.durationSeconds ?? 0), 0);
  const billableMinutes = Math.ceil(totalCallSeconds / 60);
  const estimatedCallSpend = billableMinutes * 0.12;
  const estimatedAgentSpend = metrics.activeAgents * 39;
  const estimatedNumberSpend = metrics.assignedNumbers * 2;
  const estimatedPlatformSpend = estimatedCallSpend + estimatedAgentSpend + estimatedNumberSpend;
  const completionRate = calls.length > 0 ? Math.round((metrics.completedCalls / calls.length) * 100) : 0;
  const attentionRate = calls.length > 0 ? (metrics.failedCalls / calls.length) * 100 : 0;
  const usagePressure = readiness.readyForLiveValidation ? "Ready to meter live usage" : "Still scaffold-biased";
  const averageMinutesPerCall = calls.length > 0 ? (billableMinutes / calls.length).toFixed(1) : "0.0";
  const callsDrivingSpend = calls.filter((call) => (call.durationSeconds ?? 0) >= 180);
  const overLimitRows = [
    metrics.activeAgents > 5 ? "Agent count exceeds starter planning limit." : null,
    metrics.assignedNumbers > 3 ? "Assigned numbers exceed starter planning limit." : null,
    billableMinutes > 500 ? "Billable minutes exceed placeholder monthly allowance." : null,
  ].filter((value): value is string => Boolean(value));

  const limitRows = [
    {
      label: "Agents",
      used: metrics.activeAgents,
      limit: 5,
      note: "Soft MVP planning limit for a starter workspace.",
    },
    {
      label: "Assigned numbers",
      used: metrics.assignedNumbers,
      limit: 3,
      note: "Phone inventory tends to creep quietly; this keeps routing intentional.",
    },
    {
      label: "Billable minutes",
      used: billableMinutes,
      limit: 500,
      note: "Placeholder monthly allowance until a real pricing model lands.",
    },
  ];

  const invoiceRows = [
    {
      id: "inv-current",
      label: "Current estimate",
      amount: formatCurrency(estimatedPlatformSpend),
      note: "Derived from persisted calls, active agents, and assigned numbers in the current workspace.",
      status: "Draft",
    },
    {
      id: "inv-next",
      label: "Projected next cycle",
      amount: formatCurrency(Math.round(estimatedPlatformSpend * 1.18)),
      note: "Simple growth forecast assuming current call volume and operator footprint keep climbing modestly.",
      status: "Forecast",
    },
  ];

  const primaryRecommendation = !readiness.readyForLiveValidation
    ? {
        title: "Keep billing in planning mode until the environment is fully real",
        note: "The page can already model usage drivers, but missing credentials/runtime validation still make hard billing conclusions premature.",
        nextStep:
          readiness.missingKeys.length > 0
            ? `Finish the missing environment contract first: ${readiness.missingKeys.slice(0, 3).join(", ")}${readiness.missingKeys.length > 3 ? ", and more" : ""}.`
            : "Finish live validation so spend signals can be treated as operational truth rather than provisional estimates.",
      }
    : metrics.failedCalls > 0
      ? {
          title: "Reduce failed-call waste before expanding usage",
          note: "Low-quality traffic is the fastest way to create ugly spend without corresponding customer value.",
          nextStep: `Review ${metrics.failedCalls} attention call${metrics.failedCalls === 1 ? "" : "s"} in Calls and QA before thinking about growth posture.`,
        }
      : metrics.activeAgents === 0
        ? {
            title: "Do not optimize billing before the product is staffed",
            note: "No active agents means there is nothing live enough to justify deeper billing behavior yet.",
            nextStep: "Create or activate an agent first, then return once real usage has somewhere meaningful to flow.",
          }
        : {
            title: "Track the cost drivers that actually matter next",
            note: "The current workspace is healthy enough that the best next step is understanding what is driving spend and where limits will pinch first.",
            nextStep: "Use the cost-driver mix and limit watch to decide whether agent count, talk time, or number sprawl deserves the next control.",
          };

  const costDrivers = [
    {
      label: "Conversation minutes",
      value: formatCurrency(estimatedCallSpend),
      note: `${billableMinutes} billable minutes across ${calls.length} persisted call${calls.length === 1 ? "" : "s"}.`,
    },
    {
      label: "Agent footprint",
      value: formatCurrency(estimatedAgentSpend),
      note: `${metrics.activeAgents} active agent${metrics.activeAgents === 1 ? "" : "s"} currently modeled in the workspace.`,
    },
    {
      label: "Number inventory",
      value: formatCurrency(estimatedNumberSpend),
      note: `${metrics.assignedNumbers} assigned number${metrics.assignedNumbers === 1 ? "" : "s"} currently in routed use.`,
    },
  ];

  const billingBlockers: BillingBlocker[] = [
    !readiness.readyForLiveValidation
      ? {
          title: "Environment is not ready for real billing confidence",
          level: "warning",
          detail: `Live validation is still blocked by ${readiness.missingKeys.length} missing configuration value${readiness.missingKeys.length === 1 ? "" : "s"}, which keeps usage posture partly provisional.`,
        }
      : null,
    metrics.failedCalls > 0
      ? {
          title: "Failed-call noise can inflate spend without value",
          level: "warning",
          detail: `${metrics.failedCalls} recent call outcome${metrics.failedCalls === 1 ? " is" : "s are"} already sitting in failed, busy, canceled, or no-answer territory.`,
        }
      : null,
    overLimitRows.length > 0
      ? {
          title: "Starter planning limits are already under pressure",
          level: "warning",
          detail: overLimitRows.join(" "),
        }
      : null,
    calls.length === 0
      ? {
          title: "No meaningful usage history exists yet",
          level: "info",
          detail: "Without persisted call volume, billing remains more of a planning shell than a true system control surface.",
        }
      : null,
  ].filter((item): item is BillingBlocker => Boolean(item));

  return (
    <ConsoleShell
      eyebrow="Billing"
      section="billing"
      title="Keep plan, usage, and cost visibility in the system layer."
      description="Treat plan posture, consumption, and limit risk as first-class operating signals instead of leaving finance questions to surprise everyone later."
      userEmail={session.email}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
            System surface
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] sm:text-[1.9rem]">
                Billing should make usage legible before it makes anyone nervous.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                This first pass combines persisted usage and platform readiness into a finance-friendly workspace, while staying honest that the repo is still proving product reality before real invoices become sacred text.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/settings"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Review settings
                </Link>
                <Link
                  href="/analytics"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Open analytics
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Est. current spend", value: formatCurrency(estimatedPlatformSpend) },
                { label: "Billable minutes", value: String(billableMinutes) },
                { label: "Active agents", value: String(metrics.activeAgents) },
                { label: "Assigned numbers", value: String(metrics.assignedNumbers) },
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
              <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">What finance should care about next</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                A practical recommendation based on readiness, quality, and the actual cost drivers already visible in the workspace.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              {usagePressure}
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
                label: "Live validation",
                value: readiness.readyForLiveValidation ? "Ready" : "Blocked",
                note: readiness.readyForLiveValidation
                  ? "Environment checks look good enough to start taking real platform usage seriously."
                  : "Missing credentials still make today’s usage more of a planning signal than a final bill.",
              },
              {
                label: "Completion rate",
                value: `${completionRate}%`,
                note: "Useful because low call quality tends to create expensive noise rather than valuable usage.",
              },
              {
                label: "Runtime status",
                value: metrics.runtimeStatus,
                note: metrics.runtimeNote,
              },
              {
                label: "Attention rate",
                value: formatPercent(attentionRate),
                note: "A rising share of failed or incomplete outcomes is usually a billing smell before it becomes a support story.",
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

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
              <div>
                <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Cost driver mix</h3>
                <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                  The current estimate broken into the levers that actually move spend.
                </p>
              </div>
              <Link href="/calls" className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
                Open calls →
              </Link>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ...costDrivers,
                { label: "Avg. minutes / call", value: averageMinutesPerCall, note: "A fast proxy for whether spend is coming from true conversations or a few long tails." },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                  <div className="mt-2 text-[1.45rem] font-semibold text-[var(--text-strong)]">{item.value}</div>
                  <p className="mt-2 text-[0.74rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
              <div>
                <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Invoice preview</h3>
                <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                  A finance-facing preview that stays honest about being modeled rather than provider-native.
                </p>
              </div>
              <Link href="/settings" className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
                Readiness →
              </Link>
            </div>

            <div className="space-y-3 p-5">
              {invoiceRows.map((item) => (
                <div key={item.id} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{item.label}</div>
                      <p className="mt-1 text-[0.74rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[1.1rem] font-semibold text-[var(--text-strong)]">{item.amount}</div>
                      <div className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-subtle)]">{item.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Billing blockers</h3>
              <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                {billingBlockers.length}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {billingBlockers.map((item) => (
                <div key={item.title} className={["rounded-[18px] border px-4 py-4", blockerTone(item.level)].join(" ")}>
                  <div className="text-[0.8rem] font-medium">{item.title}</div>
                  <p className="mt-2 text-[0.74rem] leading-6 opacity-90">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Limit watch</h3>
            <div className="mt-4 space-y-4">
              {limitRows.map((row) => {
                const width = Math.min((row.used / row.limit) * 100, 100);
                const tone = width >= 85 ? "bg-[var(--danger-soft)]" : width >= 60 ? "bg-[var(--warning-soft)]" : "bg-[color:rgba(76,139,199,0.12)]";

                return (
                  <div key={row.label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-[0.78rem] text-[var(--text-body)]">
                      <span>{row.label}</span>
                      <span className="font-mono text-[0.72rem] text-[var(--text-subtle)]">{row.used}/{row.limit}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[var(--surface-subtle)]">
                      <div className={`h-2.5 rounded-full ${tone}`} style={{ width: `${Math.max(width, row.used > 0 ? 8 : 0)}%` }} />
                    </div>
                    <p className="mt-2 text-[0.72rem] leading-6 text-[var(--text-subtle)]">{row.note}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Usage creating the most spend</h3>
            </div>
            <div className="space-y-2 p-4">
              {callsDrivingSpend.slice(0, 4).length > 0 ? (
                callsDrivingSpend.slice(0, 4).map((call) => (
                  <Link
                    key={call.id}
                    href={`/calls/${call.id}`}
                    className="block rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded px-1.5 py-0.5 text-[0.6rem] bg-[var(--surface-subtle)] text-[var(--text-subtle)]">
                        {call.status.replaceAll("_", " ")}
                      </span>
                      <span className="ml-auto text-[0.65rem] text-[var(--text-subtle)]">{formatDuration(call.durationSeconds ?? 0)}</span>
                    </div>
                    <div className="text-[0.74rem] font-medium text-[var(--text-strong)]">{call.callerNumber || "Unknown caller"}</div>
                    <p className="mt-1 text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">
                      {call.agentName || "Unassigned agent"} · {call.createdAt.toLocaleString()}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No long-call spend drivers are standing out in the current usage window.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Operator notes</h3>
            <div className="mt-4 space-y-3 text-[0.78rem] leading-6 text-[var(--text-body)]">
              <p>
                These numbers are intentionally transparent about being provisional. They already reflect real persisted usage, but not provider-native billing events or stored invoices yet.
              </p>
              <p>
                The next layer is to wire true plan metadata, invoice history, and overage notifications back into <Link href="/alerts" className="font-medium text-[var(--text-strong)] underline underline-offset-4">alerts</Link> and <Link href="/settings" className="font-medium text-[var(--text-strong)] underline underline-offset-4">settings</Link> so financial risk shows up before it becomes a support ticket.
              </p>
            </div>
          </section>
        </div>
      </div>
    </ConsoleShell>
  );
}