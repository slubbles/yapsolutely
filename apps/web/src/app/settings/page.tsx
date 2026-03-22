import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { requireSession } from "@/lib/auth";
import { getSettingsReadiness } from "@/lib/settings-data";

function overallTone(ready: boolean) {
  return ready
    ? "bg-[color:rgba(86,149,113,0.16)] text-[#bde2c7]"
    : "bg-[color:rgba(238,189,142,0.16)] text-[#f1d4b4]";
}

function statusPillClassName(status: "configured" | "missing") {
  return status === "configured"
    ? "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]"
    : "border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] text-[#8d6336]";
}

function runtimeHealthPillClassName(status: "reachable" | "unreachable" | "skipped") {
  switch (status) {
    case "reachable":
      return "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]";
    case "skipped":
      return "border-[var(--border-soft)] bg-[var(--surface-subtle)] text-[var(--text-subtle)]";
    default:
      return "border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] text-[#8d6336]";
  }
}

function runtimeReadinessPillClassName(status?: string) {
  switch (status) {
    case "ready":
      return "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]";
    case "needs_configuration":
      return "border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] text-[#8d6336]";
    default:
      return "border-[var(--border-soft)] bg-[var(--surface-subtle)] text-[var(--text-subtle)]";
  }
}

export default async function SettingsPage() {
  const session = await requireSession();
  const readiness = await getSettingsReadiness();
  const healthReady = readiness.runtimeHealth.status === "reachable";
  const runtimeReady = readiness.runtimeReadiness.readinessStatus === "ready";
  const controlChecks = [
    readiness.missingKeys.length === 0,
    readiness.runtimeMode.toLowerCase() === "live",
    healthReady,
    runtimeReady,
  ];
  const controlScore = controlChecks.filter(Boolean).length;
  const nextFocus = readiness.missingKeys.slice(0, 4);
  const validationChecklist = [
    {
      label: "All required secrets are configured",
      ready: readiness.missingKeys.length === 0,
      detail:
        readiness.missingKeys.length === 0
          ? "The current environment contract is filled with real values instead of placeholders."
          : `${readiness.missingKeys.length} required values are still missing before honest live validation.`,
    },
    {
      label: "Runtime mode is live",
      ready: readiness.runtimeMode.toLowerCase() === "live",
      detail:
        readiness.runtimeMode.toLowerCase() === "live"
          ? "The voice runtime is configured for provider-backed conversation flow."
          : "The runtime is still not in live mode, so call behavior may remain mocked or partial.",
    },
    {
      label: "Voice runtime health is reachable",
      ready: healthReady,
      detail: readiness.runtimeHealth.detail,
    },
    {
      label: "Voice runtime readiness passes",
      ready: runtimeReady,
      detail: readiness.runtimeReadiness.detail,
    },
  ];
  const operatorSignals = [
    {
      label: "Missing keys",
      value: String(readiness.missingKeys.length),
      note:
        readiness.missingKeys.length > 0
          ? "These are the fastest blockers between the repo and a credible live call pass."
          : "No config blockers are currently visible from the web app side.",
    },
    {
      label: "Runtime checks",
      value: readiness.runtimeReadiness.configuredCount != null && readiness.runtimeReadiness.totalCount != null
        ? `${readiness.runtimeReadiness.configuredCount}/${readiness.runtimeReadiness.totalCount}`
        : "—",
      note: "What the runtime itself reports about its own provider/config posture.",
    },
    {
      label: "Web → runtime posture",
      value: healthReady ? "Reachable" : readiness.runtimeHealth.status,
      note: "Useful for distinguishing missing credentials from a service that simply is not there.",
    },
  ];
  const nextSteps = [
    {
      title: readiness.missingKeys.length > 0 ? "Fill remaining credentials" : "Move to live validation",
      href: "/settings",
      label: readiness.missingKeys.length > 0 ? "Keep resolving blockers here" : "This page is ready for live checks",
      note:
        readiness.missingKeys.length > 0
          ? "Use the missing-key list and linked docs to clear the remaining blockers."
          : "Configuration no longer looks like the main excuse. Time to test reality.",
    },
    {
      title: "Review agent deploy posture",
      href: "/agents",
      label: "Open agent roster",
      note: "Once settings look healthy, the next risk is usually whether an agent is actually callable and assigned correctly.",
    },
    {
      title: "Verify call proof loop",
      href: "/calls",
      label: "Open calls",
      note: "The finish line still requires persisted calls, transcript evidence, and visible runtime actions.",
    },
  ];

  return (
    <ConsoleShell
      eyebrow="Settings"
      section="settings"
      title="Provider credentials and platform behavior live here."
      description="Expect environment introspection, Twilio/Deepgram/Anthropic configuration, and future tenant-level controls."
      userEmail={session.email}
    >
      <div className="mb-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
              Readiness control center
            </div>
            <div className={["inline-flex rounded-full px-3 py-1 text-[0.68rem] font-medium", overallTone(readiness.readyForLiveValidation)].join(" ")}>
              {readiness.readyForLiveValidation
                ? `Live-validation ready · ${controlScore}/${controlChecks.length}`
                : `Needs setup · ${controlScore}/${controlChecks.length}`}
            </div>
          </div>

          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.04em] sm:text-[1.82rem]">
                Settings should answer one uncomfortable but useful question: are we actually ready for a real phone test?
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                This page now acts like the deployment truth source for the product. It shows whether the environment is really configured, whether the runtime is reachable, and what still stands between the repo and a clean live validation pass.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Configured checks", value: `${readiness.configuredCount}/${readiness.totalCount}` },
                { label: "Runtime mode", value: readiness.runtimeMode },
                { label: "Missing items", value: String(readiness.missingKeys.length) },
                { label: "Runtime health", value: readiness.runtimeHealth.status },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(229,226,225,0.48)]">{item.label}</div>
                  <div className="mt-2 text-[0.9rem] font-medium text-[var(--surface-dark-foreground)]">{item.value}</div>
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
                A tighter read on whether the remaining work is credential collection, service reachability, or real validation.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              {controlScore}/{controlChecks.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {operatorSignals.map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                <div className="mt-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_320px]">
        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-[1.05rem] font-semibold text-[var(--text-strong)]">Environment readiness</h2>
              <p className="mt-1 text-[0.84rem] leading-7 text-[var(--text-body)]">
                This page tracks whether the repo is still in scaffold mode or ready for real provider wiring and live validation.
              </p>
            </div>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${readiness.readyForLiveValidation ? "border-[color:rgba(64,145,95,0.2)] bg-[var(--success-soft)] text-[#2f6f49]" : "border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] text-[#8d6336]"}`}
            >
              {readiness.readyForLiveValidation ? "Ready for live validation" : "Credentials still needed"}
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/65 p-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">Configured checks</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">
                {readiness.configuredCount}/{readiness.totalCount}
              </p>
            </div>
            <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/65 p-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">Runtime mode</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">{readiness.runtimeMode}</p>
            </div>
            <div className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/65 p-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">Missing items</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">{readiness.missingKeys.length}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.84rem] font-medium text-[var(--text-strong)]">Voice runtime health</p>
                <p className="mt-1 text-[0.78rem] leading-6 text-[var(--text-body)]">{readiness.runtimeHealth.detail}</p>
              </div>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${runtimeHealthPillClassName(readiness.runtimeHealth.status)}`}
              >
                {readiness.runtimeHealth.status}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-[0.68rem] text-[var(--text-subtle)]">
              <span>Configured runtime mode: {readiness.runtimeMode}</span>
              <span>
                Runtime reported mode: {readiness.runtimeHealth.reportedPipelineMode || "unknown"}
              </span>
              <span>Active streams: {readiness.runtimeHealth.activeStreams ?? "—"}</span>
            </div>
          </div>

          <div className="mt-4 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.84rem] font-medium text-[var(--text-strong)]">Voice runtime readiness</p>
                <p className="mt-1 text-[0.78rem] leading-6 text-[var(--text-body)]">{readiness.runtimeReadiness.detail}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${runtimeHealthPillClassName(readiness.runtimeReadiness.status)}`}
                >
                  {readiness.runtimeReadiness.status}
                </span>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${runtimeReadinessPillClassName(readiness.runtimeReadiness.readinessStatus)}`}
                >
                  {readiness.runtimeReadiness.readinessStatus || "unknown"}
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-[0.68rem] text-[var(--text-subtle)]">
              <span>
                Runtime checks: {readiness.runtimeReadiness.configuredCount ?? "—"}/
                {readiness.runtimeReadiness.totalCount ?? "—"}
              </span>
              <span>Runtime → web health: {readiness.runtimeReadiness.webHealthStatus || "unknown"}</span>
              <span>Runtime → web readiness: {readiness.runtimeReadiness.webReadinessStatus || "unknown"}</span>
              <span>
                Runtime says web live-ready: {typeof readiness.runtimeReadiness.webReadyForLiveValidation === "boolean"
                  ? readiness.runtimeReadiness.webReadyForLiveValidation
                    ? "yes"
                    : "no"
                  : "unknown"}
              </span>
            </div>

            {readiness.runtimeReadiness.missingKeys && readiness.runtimeReadiness.missingKeys.length > 0 ? (
              <div className="mt-3">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                  Runtime missing keys
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {readiness.runtimeReadiness.missingKeys.slice(0, 6).map((key) => (
                    <span
                      key={key}
                      className="rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2 font-mono text-[0.68rem] text-[var(--text-body)]"
                    >
                      {key}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 p-4 text-[0.8rem] text-[var(--text-body)]">
            <p>
              Use <code className="font-mono text-[var(--text-strong)]">docs/credentials-setup.md</code> as the step-by-step guide for collecting the remaining values.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-[0.78rem]">
              <span className="rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-body)]">
                docs/credentials-setup.md
              </span>
              <span className="rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-body)]">
                docs/deployment-runbook.md
              </span>
              <span className="rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2 text-[var(--text-body)]">
                docs/live-validation-checklist.md
              </span>
            </div>
            <div className="mt-3 space-y-1 text-[0.68rem] text-[var(--text-subtle)]">
              <p>Web app URL: {readiness.appUrl}</p>
              <p>Voice runtime base URL: {readiness.voiceBaseUrl}</p>
              <p>Voice websocket URL: {readiness.voiceWebSocketUrl}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)] lg:w-80">
          <h2 className="text-[1rem] font-semibold text-[var(--text-strong)]">Next credential focus</h2>
          {readiness.missingKeys.length === 0 ? (
            <p className="mt-3 text-[0.8rem] leading-6 text-[var(--text-body)]">
              Everything required for live validation appears configured. The next move is real deployment wiring and a live Twilio call test.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-[0.8rem] leading-6 text-[var(--text-body)]">
              {readiness.missingKeys.slice(0, 6).map((key) => (
                <li
                  key={key}
                  className="rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-3 py-2 font-mono text-[0.7rem] text-[var(--text-body)]"
                >
                  {key}
                </li>
              ))}
            </ul>
          )}

          {nextFocus.length > 0 ? (
            <div className="mt-4 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
              <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">Most immediate blockers</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {nextFocus.map((key) => (
                  <span key={key} className="rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2 font-mono text-[0.68rem] text-[var(--text-body)]">
                    {key}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </article>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[1rem] font-semibold text-[var(--text-strong)]">Live-validation checklist</h2>
              <p className="mt-1 text-[0.8rem] leading-6 text-[var(--text-body)]">
                The operational preflight before the team trusts a real inbound demo run.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              docs/live-validation-checklist.md
            </span>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {validationChecklist.map((item) => (
              <div key={item.label} className={["rounded-[18px] border px-4 py-4", statusPillClassName(item.ready ? "configured" : "missing")].join(" ")}>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[0.82rem] font-medium">{item.label}</div>
                  <div className="text-[0.68rem] uppercase tracking-[0.14em]">{item.ready ? "Ready" : "Needs work"}</div>
                </div>
                <p className="mt-2 text-[0.76rem] leading-6 opacity-90">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <h2 className="text-[1rem] font-semibold text-[var(--text-strong)]">Next best actions</h2>
          <div className="mt-4 space-y-3">
            {nextSteps.map((step) => (
              <Link key={step.title} href={step.href} className="block rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 transition hover:bg-[var(--surface-subtle)]">
                <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{step.title}</div>
                <div className="mt-1 text-[0.72rem] text-[var(--text-subtle)]">{step.label}</div>
                <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{step.note}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {readiness.sections.map((section) => (
          <article
            key={section.title}
            className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
          >
            <h2 className="text-[1rem] font-semibold text-[var(--text-strong)]">{section.title}</h2>
            <p className="mt-2 text-[0.8rem] leading-6 text-[var(--text-body)]">{section.description}</p>
            <div className="mt-4 space-y-3">
              {section.checks.map((check) => (
                <div
                  key={check.key}
                  className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-[var(--text-strong)]">{check.label}</p>
                      <p className="mt-1 text-[0.68rem] font-mono text-[var(--text-subtle)]">{check.key}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${statusPillClassName(check.status)}`}
                    >
                      {check.status}
                    </span>
                  </div>
                  <p className="mt-3 text-[0.78rem] leading-6 text-[var(--text-body)]">{check.detail}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="mt-6 rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
        <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.56)]">Operator note</div>
        <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.03em]">
          Good settings work removes excuses before the call ever starts.
        </h3>
        <p className="mt-3 text-[0.82rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
          This page now makes it obvious whether the next blocker is missing credentials, a sick runtime, or simply the need to stop reading readiness screens and place a real call. Exactly the kind of honesty a demo path enjoys.
        </p>
      </section>
    </ConsoleShell>
  );
}
