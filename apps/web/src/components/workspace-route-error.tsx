"use client";

import Link from "next/link";
import { useEffect } from "react";

type WorkspaceRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
  message: string;
  retryLabel: string;
  fallbackHref: string;
  fallbackLabel: string;
  variant?: "knowledge" | "monitor" | "qa" | "alerts" | "billing" | "deploy";
};

function variantBadge(variant: NonNullable<WorkspaceRouteErrorProps["variant"]>) {
  switch (variant) {
    case "knowledge":
      return { label: "Build route error", className: "border-[color:rgba(76,139,199,0.18)] bg-[color:rgba(76,139,199,0.1)] text-[#466f9a]" };
    case "qa":
      return { label: "QA route error", className: "border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] text-[#8d6336]" };
    case "alerts":
      return { label: "Alert route error", className: "border-[color:rgba(170,84,84,0.2)] bg-[var(--danger-soft)] text-[#8b4a4a]" };
    case "billing":
      return { label: "System route error", className: "border-[color:rgba(76,139,199,0.18)] bg-[color:rgba(76,139,199,0.1)] text-[#466f9a]" };
    case "deploy":
      return { label: "Deploy route error", className: "border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] text-[#8d6336]" };
    default:
      return { label: "Monitor route error", className: "border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] text-[#8d6336]" };
  }
}

function variantNotes(variant: NonNullable<WorkspaceRouteErrorProps["variant"]>) {
  switch (variant) {
    case "knowledge":
      return [
        "Source inventory and agent attachments may be temporarily unavailable.",
        "Retry first; if it persists, continue build work in agents while the source layer recovers.",
      ];
    case "qa":
      return [
        "Review scoring and queue triage are temporarily offline.",
        "Use direct call detail pages for manual review until the QA workspace recovers.",
      ];
    case "alerts":
      return [
        "Alert synthesis may be missing runtime, config, or call-trouble signals right now.",
        "Check settings and QA directly if you need the raw signals immediately.",
      ];
    case "billing":
      return [
        "Usage estimates and limit posture may be temporarily unavailable.",
        "Settings and analytics still provide the underlying readiness and activity evidence.",
      ];
    case "deploy":
      return [
        "Campaign staging is unavailable for the moment.",
        "Numbers and calls still expose the routing inventory and callback evidence underneath.",
      ];
    default:
      return [
        "Monitoring summaries may be incomplete while this route is failing.",
        "Calls and related workspaces still offer the raw operational detail underneath.",
      ];
  }
}

export function WorkspaceRouteError({
  error,
  reset,
  title,
  message,
  retryLabel,
  fallbackHref,
  fallbackLabel,
  variant = "monitor",
}: WorkspaceRouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const badge = variantBadge(variant);
  const notes = variantNotes(variant);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
      <article className="rounded-[var(--radius-card)] border border-[color:rgba(160,91,65,0.18)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
        <div className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${badge.className}`}>
          {badge.label}
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-strong)]">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">{message}</p>
        <div className="mt-5 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-4 text-[0.78rem] leading-6 text-[var(--text-body)]">
          <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">Captured error</div>
          <p className="mt-2 font-mono text-[0.72rem] text-[var(--text-subtle)] break-all">
            {error.digest || error.message || "Unknown route error"}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
          >
            {retryLabel}
          </button>
          <Link
            href={fallbackHref}
            className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
          >
            {fallbackLabel}
          </Link>
        </div>
      </article>

      <aside className="space-y-5">
        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
          <div className="border-b border-[var(--border-soft)] px-5 py-4">
            <h3 className="text-sm font-medium text-[var(--text-strong)]">What this blocks</h3>
          </div>
          <div className="space-y-2 p-4">
            {notes.map((note) => (
              <div key={note} className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-body)]">
                {note}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Suggested next move</h3>
          <p className="mt-3 text-[0.78rem] leading-6 text-[var(--text-body)]">
            Retry first. If the route keeps failing, use the fallback workspace for the raw data path while this surface recovers.
          </p>
        </section>
      </aside>
    </div>
  );
}