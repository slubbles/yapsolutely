"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ConsoleShell } from "@/components/console-shell";

type AgentWorkspaceStateStats = Array<{
  label: string;
  value: string;
}>;

type AgentWorkspaceLoadingStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  stats: AgentWorkspaceStateStats;
  mainCards?: number;
  sideCards?: number;
};

type AgentWorkspaceErrorStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  error: Error & { digest?: string };
  reset: () => void;
  retryLabel: string;
  fallbackHref?: string;
  fallbackLabel?: string;
  message: string;
};

function SkeletonBlock({ className }: { className: string }) {
  return <div className={["animate-pulse rounded bg-[var(--surface-subtle)]", className].join(" ")} />;
}

export function AgentWorkspaceLoadingState({
  eyebrow,
  title,
  description,
  stats,
  mainCards = 3,
  sideCards = 3,
}: AgentWorkspaceLoadingStateProps) {
  return (
    <ConsoleShell
      section="agents"
      eyebrow={eyebrow}
      title={title}
      description={description}
      userEmail="Loading session..."
    >
      <div className="space-y-5">
        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface-subtle)]" />
          <div className="mt-4 h-8 w-56 animate-pulse rounded bg-[var(--surface-subtle)]/85" />
          <div className="mt-4 grid gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-[18px] bg-[var(--surface-subtle)]/85" />
            ))}
          </div>
        </article>

        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="h-6 w-28 animate-pulse rounded-full border border-white/10 bg-white/10" />
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
            <div>
              <div className="h-10 w-[34rem] max-w-full animate-pulse rounded bg-white/10" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-white/5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                  <div className="mt-3 h-6 w-24 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.85fr)]">
          <div className="space-y-5">
            {Array.from({ length: mainCards }).map((_, index) => (
              <article
                key={index}
                className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
              >
                <SkeletonBlock className="h-5 w-36" />
                <div className="mt-4 space-y-3">
                  {Array.from({ length: index === 0 ? 4 : 3 }).map((__, rowIndex) => (
                    <SkeletonBlock key={rowIndex} className="h-14 rounded-[18px]" />
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-5">
            {Array.from({ length: sideCards }).map((_, index) => (
              <article
                key={index}
                className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
              >
                <SkeletonBlock className="h-5 w-32" />
                <div className="mt-4 space-y-3">
                  {Array.from({ length: index === sideCards - 1 ? 2 : 3 }).map((__, rowIndex) => (
                    <SkeletonBlock key={rowIndex} className="h-16 rounded-[18px]" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}

export function AgentWorkspaceErrorState({
  eyebrow,
  title,
  description,
  error,
  reset,
  retryLabel,
  fallbackHref = "/agents",
  fallbackLabel = "Back to agents",
  message,
}: AgentWorkspaceErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ConsoleShell
      section="agents"
      eyebrow={eyebrow}
      title={title}
      description={description}
      userEmail="Workspace session"
    >
      <article className="rounded-[var(--radius-card)] border border-[color:rgba(160,91,65,0.18)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
        <div className="inline-flex rounded-full border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8d6336]">
          Route error
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-strong)]">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">{message}</p>
        <div className="mt-5 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-4 text-[0.78rem] leading-6 text-[var(--text-body)]">
          <div className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">Captured error</div>
          <p className="mt-2 break-all font-mono text-[0.72rem] text-[var(--text-subtle)]">
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
    </ConsoleShell>
  );
}