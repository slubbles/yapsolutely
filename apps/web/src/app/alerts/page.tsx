import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { requireSession } from "@/lib/auth";
import { listRecentCallsForUser } from "@/lib/call-data";
import { getDashboardMetrics } from "@/lib/dashboard-data";
import { getSettingsReadiness } from "@/lib/settings-data";

const filterOptions = ["ALL", "CRITICAL", "WARNING", "INFO"] as const;
const attentionStatuses = new Set(["FAILED", "NO_ANSWER", "BUSY", "CANCELED"]);

type AlertsPageProps = {
  searchParams?: Promise<{
    level?: string;
  }>;
};

type AlertLevel = "critical" | "warning" | "info";

type AlertItem = {
  id: string;
  title: string;
  level: AlertLevel;
  source: "runtime" | "config" | "calls";
  summary: string;
  detail: string;
  href: string;
  relatedLabel: string;
};

function levelBadge(level: AlertLevel) {
  switch (level) {
    case "critical":
      return { label: "Critical", className: "bg-[var(--danger-soft)] text-[#8b4a4a]" };
    case "warning":
      return { label: "Warning", className: "bg-[var(--warning-soft)] text-[#8d6336]" };
    default:
      return { label: "Info", className: "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]" };
  }
}

function sourceBadge(source: AlertItem["source"]) {
  switch (source) {
    case "runtime":
      return "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]";
    case "config":
      return "bg-[var(--warning-soft)] text-[#8d6336]";
    default:
      return "bg-[var(--danger-soft)] text-[#8b4a4a]";
  }
}

function matchesLevel(level: AlertLevel, filter: string) {
  if (filter === "CRITICAL") {
    return level === "critical";
  }

  if (filter === "WARNING") {
    return level === "warning";
  }

  if (filter === "INFO") {
    return level === "info";
  }

  return true;
}

export default async function AlertsPage({ searchParams }: AlertsPageProps) {
  const session = await requireSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const level = resolvedSearchParams?.level?.trim().toUpperCase() || "ALL";
  const normalizedLevel = filterOptions.includes(level as (typeof filterOptions)[number]) ? level : "ALL";

  const [metrics, calls, readiness] = await Promise.all([
    getDashboardMetrics(session.email),
    listRecentCallsForUser(session.email),
    getSettingsReadiness(),
  ]);

  const alertItems: AlertItem[] = [];

  if (readiness.runtimeHealth.status === "unreachable") {
    alertItems.push({
      id: "runtime-health-unreachable",
      title: "Voice runtime health probe failed",
      level: "critical",
      source: "runtime",
      summary: "The web app could not reach the voice runtime health endpoint.",
      detail: readiness.runtimeHealth.detail,
      href: "/settings",
      relatedLabel: "Settings readiness",
    });
  }

  if (readiness.runtimeReadiness.status === "unreachable") {
    alertItems.push({
      id: "runtime-readiness-unreachable",
      title: "Runtime readiness contract is unreachable",
      level: "critical",
      source: "runtime",
      summary: "Cross-service readiness checks are failing from the web app.",
      detail: readiness.runtimeReadiness.detail,
      href: "/settings",
      relatedLabel: "Runtime readiness",
    });
  }

  if (readiness.missingKeys.length > 0) {
    alertItems.push({
      id: "config-missing-keys",
      title: "Live validation is blocked by missing configuration",
      level: readiness.missingKeys.length >= 4 ? "critical" : "warning",
      source: "config",
      summary: `${readiness.missingKeys.length} required environment values are still missing.`,
      detail: readiness.missingKeys.slice(0, 5).join(", "),
      href: "/settings",
      relatedLabel: "Missing keys",
    });
  }

  if (metrics.failedCalls > 0) {
    alertItems.push({
      id: "call-outcome-attention",
      title: "Non-ideal call outcomes need review",
      level: metrics.failedCalls >= 3 ? "critical" : "warning",
      source: "calls",
      summary: `${metrics.failedCalls} completed call records ended as failed, no-answer, busy, or canceled.`,
      detail: "Open the QA queue and call history to inspect patterns by agent, prompt, or routing path.",
      href: "/qa?queue=ATTENTION",
      relatedLabel: "QA attention queue",
    });
  }

  if (metrics.callsToday > 0 && metrics.toolActionsToday === 0) {
    alertItems.push({
      id: "tool-actions-flat",
      title: "Runtime tools show no activity today",
      level: "info",
      source: "runtime",
      summary: "Calls are being logged today, but no tool actions were recorded.",
      detail: "That may be fine, but it is worth checking whether live workflows are underused or silently not firing.",
      href: "/analytics",
      relatedLabel: "Analytics signal summary",
    });
  }

  calls
    .filter((call) => attentionStatuses.has(call.status))
    .slice(0, 3)
    .forEach((call, index) => {
      alertItems.push({
        id: `call-${call.id}`,
        title: `${call.status.replaceAll("_", " ")} call requires transcript review`,
        level: call.status === "FAILED" ? "critical" : "warning",
        source: "calls",
        summary: `${call.callerNumber || "Unknown caller"} · ${call.agentName || "Unassigned agent"}`,
        detail: call.transcriptPreview || "Open the call detail to inspect transcript evidence and runtime actions.",
        href: `/calls/${call.id}`,
        relatedLabel: `Call ${index + 1}`,
      });
    });

  if (alertItems.length === 0) {
    alertItems.push({
      id: "ops-calm",
      title: "No active alerts in the current signal set",
      level: "info",
      source: "runtime",
      summary: "The current readiness and call signals are not surfacing urgent issues.",
      detail: "That does not replace manual review, but it is a nice change of pace from chaos.",
      href: "/analytics",
      relatedLabel: "Analytics overview",
    });
  }

  const visibleAlerts = alertItems.filter((item) => matchesLevel(item.level, normalizedLevel));
  const criticalAlerts = visibleAlerts.filter((item) => item.level === "critical");
  const warningAlerts = visibleAlerts.filter((item) => item.level === "warning");
  const infoAlerts = visibleAlerts.filter((item) => item.level === "info");
  const runtimeAlerts = visibleAlerts.filter((item) => item.source === "runtime");
  const configAlerts = visibleAlerts.filter((item) => item.source === "config");
  const callAlerts = visibleAlerts.filter((item) => item.source === "calls");
  const hasFilters = normalizedLevel !== "ALL";

  return (
    <ConsoleShell
      eyebrow="Alerts"
      section="monitor"
      title="Surface operational issues before they become repeatable customer pain."
      description="Bring runtime failures, readiness gaps, and non-ideal call outcomes into one triage surface so operators know what deserves attention first."
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
                Alerts should interrupt politely, but they should still interrupt.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                This alert center merges runtime reachability, configuration readiness, and persisted call trouble into a single queue so operational issues stop hiding across three different pages.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/settings"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Review settings
                </Link>
                <Link
                  href="/qa"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Open QA queue
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Visible alerts", value: visibleAlerts.length.toString() },
                { label: "Critical", value: criticalAlerts.length.toString() },
                { label: "Warnings", value: warningAlerts.length.toString() },
                { label: "Info", value: infoAlerts.length.toString() },
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
              <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Source breakdown</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                Where the current alert pressure is actually coming from.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              Live signal mix
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: "Runtime", value: runtimeAlerts.length, note: readiness.runtimeHealth.detail },
              { label: "Config", value: configAlerts.length, note: `${readiness.configuredCount}/${readiness.totalCount} readiness checks configured.` },
              { label: "Calls", value: callAlerts.length, note: `${metrics.failedCalls} non-ideal call outcomes recorded overall.` },
            ].map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[0.76rem] font-medium text-[var(--text-strong)]">{item.label}</div>
                  <div className="font-mono text-[0.74rem] text-[var(--text-subtle)]">{item.value}</div>
                </div>
                <p className="mt-2 text-[0.74rem] leading-6 text-[var(--text-body)]">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <form className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)] md:grid-cols-[180px_auto]">
          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Level</span>
            <select
              name="level"
              defaultValue={normalizedLevel}
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(32,36,43,0.2)]"
            >
              <option value="ALL">All levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>
          </label>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
            >
              Apply filter
            </button>
            {hasFilters ? (
              <Link
                href="/alerts"
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Runtime mode", value: readiness.runtimeMode, note: "Current pipeline mode reported by the web app." },
            { label: "Configured checks", value: `${readiness.configuredCount}/${readiness.totalCount}`, note: "Environment readiness coverage before live validation." },
            { label: "Calls today", value: String(metrics.callsToday), note: "Used here as rough operational load context." },
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
                <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Alert queue</h3>
                <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                  A single list of the issues most likely to affect live operations right now.
                </p>
              </div>
              <Link href="/analytics" className="text-[0.72rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]">
                Open analytics →
              </Link>
            </div>

            <div className="divide-y divide-[var(--border-soft)]">
              {visibleAlerts.map((item) => {
                const levelMeta = levelBadge(item.level);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="block px-5 py-4 transition hover:bg-[var(--surface-subtle)]/55"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${levelMeta.className}`}>
                        {levelMeta.label}
                      </span>
                      <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${sourceBadge(item.source)}`}>
                        {item.source}
                      </span>
                      <span className="ml-auto text-[0.68rem] text-[var(--text-subtle)]">{item.relatedLabel}</span>
                    </div>
                    <h4 className="mt-3 text-[0.9rem] font-semibold text-[var(--text-strong)]">{item.title}</h4>
                    <p className="mt-2 text-[0.8rem] leading-6 text-[var(--text-body)]">{item.summary}</p>
                    <p className="mt-2 text-[0.74rem] leading-6 text-[var(--text-subtle)]">{item.detail}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Readiness watch</h3>
            <div className="mt-4 space-y-3">
              {[
                {
                  label: "Runtime health",
                  value: readiness.runtimeHealth.status,
                  note: readiness.runtimeHealth.detail,
                },
                {
                  label: "Runtime readiness",
                  value: readiness.runtimeReadiness.status,
                  note: readiness.runtimeReadiness.detail,
                },
                {
                  label: "Live validation",
                  value: readiness.readyForLiveValidation ? "ready" : "blocked",
                  note: readiness.readyForLiveValidation
                    ? "All required checks look configured for live validation."
                    : "The environment contract still has gaps before full live validation.",
                },
              ].map((row) => (
                <div key={row.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[0.76rem] font-medium text-[var(--text-strong)]">{row.label}</div>
                    <div className="font-mono text-[0.72rem] text-[var(--text-subtle)]">{row.value}</div>
                  </div>
                  <p className="mt-2 text-[0.74rem] leading-6 text-[var(--text-body)]">{row.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Calls in trouble</h3>
            </div>
            <div className="space-y-2 p-4">
              {calls.filter((call) => attentionStatuses.has(call.status)).slice(0, 4).length > 0 ? (
                calls
                  .filter((call) => attentionStatuses.has(call.status))
                  .slice(0, 4)
                  .map((call) => (
                    <Link
                      key={call.id}
                      href={`/calls/${call.id}`}
                      className="block rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded px-1.5 py-0.5 text-[0.6rem] bg-[var(--warning-soft)] text-[#8d6336]">
                          {call.status.replaceAll("_", " ")}
                        </span>
                        <span className="ml-auto text-[0.65rem] text-[var(--text-subtle)]">{call.createdAt.toLocaleString()}</span>
                      </div>
                      <div className="text-[0.74rem] font-medium text-[var(--text-strong)]">{call.callerNumber || "Unknown caller"}</div>
                      <p className="mt-1 text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">
                        {call.agentName || "Unassigned agent"} · {call.transcriptPreview || "Transcript detail should be reviewed."}
                      </p>
                    </Link>
                  ))
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No recent troubled calls are visible in the current data slice.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Operator notes</h3>
            <div className="mt-4 space-y-3 text-[0.78rem] leading-6 text-[var(--text-body)]">
              <p>
                This surface now uses real runtime readiness and call-outcome data, but it still lacks acknowledgement, ownership, and resolution history.
              </p>
              <p>
                The next obvious step is to connect alert dismissal and triage decisions back into <Link href="/qa" className="font-medium text-[var(--text-strong)] underline underline-offset-4">QA</Link>, <Link href="/settings" className="font-medium text-[var(--text-strong)] underline underline-offset-4">settings</Link>, and agent-level monitoring so every alert has an accountable path forward.
              </p>
            </div>
          </section>
        </div>
      </div>
    </ConsoleShell>
  );
}