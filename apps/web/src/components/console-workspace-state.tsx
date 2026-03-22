"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ConsoleShell } from "@/components/console-shell";

type ConsoleWorkspaceLoadingVariant = "dashboard" | "agents" | "builder" | "settings";

type ConsoleWorkspaceLoadingStateProps = {
  section: "dashboard" | "agents" | "settings";
  eyebrow: string;
  title: string;
  description: string;
  variant: ConsoleWorkspaceLoadingVariant;
};

type ConsoleWorkspaceErrorStateProps = {
  section: "dashboard" | "agents" | "settings";
  eyebrow: string;
  title: string;
  description: string;
  error: Error & { digest?: string };
  reset: () => void;
  retryLabel: string;
  fallbackHref: string;
  fallbackLabel: string;
  message: string;
  cardTitle: string;
};

function SkeletonBlock({ className }: { className: string }) {
  return <div className={["animate-pulse rounded bg-[var(--surface-subtle)]", className].join(" ")} />;
}

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <article className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 shadow-[var(--shadow-md)] sm:p-7">
          <div className="h-6 w-28 animate-pulse rounded bg-white/10" />
          <div className="mt-5 h-12 w-96 max-w-full animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-5 w-[32rem] max-w-full animate-pulse rounded bg-white/10" />
          <div className="mt-6 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-[18px] bg-white/10" />
            ))}
          </div>
        </article>

        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <SkeletonBlock className="h-6 w-36" />
          <SkeletonBlock className="mt-4 h-28 rounded-[18px]" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-16 rounded-[16px]" />
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <article className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
            <div className="space-y-2">
              <SkeletonBlock className="h-5 w-36" />
              <SkeletonBlock className="h-4 w-64" />
            </div>
            <SkeletonBlock className="h-4 w-20" />
          </div>
          <div className="divide-y divide-[var(--border-soft)]">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-40" />
                  <SkeletonBlock className="h-3 w-56" />
                </div>
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="h-3 w-10" />
                  <SkeletonBlock className="h-6 w-24 rounded-[10px]" />
                  <SkeletonBlock className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <article
              key={index}
              className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
            >
              <SkeletonBlock className="h-5 w-40" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 3 }).map((__, rowIndex) => (
                  <SkeletonBlock key={rowIndex} className="h-16 rounded-[16px]" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function AgentsLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <SkeletonBlock className="h-7 w-48" />
          <SkeletonBlock className="mt-3 h-5 w-80 max-w-full" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-20 rounded-[18px]" />
            ))}
          </div>
        </article>

        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <SkeletonBlock className="h-5 w-28" />
          <SkeletonBlock className="mt-4 h-11 rounded-[16px]" />
          <SkeletonBlock className="mt-3 h-11 w-32 rounded-[16px]" />
        </article>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
        <div className="grid grid-cols-5 gap-4 border-b border-[var(--border-soft)] px-5 py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-4" />
          ))}
        </div>
        <div className="space-y-3 px-5 py-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((__, cellIndex) => (
                <SkeletonBlock key={cellIndex} className="h-14 rounded-[18px]" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuilderLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-5 py-5 shadow-[var(--shadow-sm)]">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:items-end">
          <div>
            <SkeletonBlock className="h-8 w-72 max-w-full" />
            <div className="mt-3 space-y-2">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-20 rounded-[18px]" />
            ))}
          </div>
        </div>
      </article>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.95fr)]">
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={index}
              className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
            >
              <SkeletonBlock className={`h-5 ${index === 2 ? "w-44" : index === 1 ? "w-32" : "w-24"}`} />
              <div className="mt-4 space-y-3">
                {Array.from({ length: index === 1 ? 5 : index === 3 ? 2 : 3 }).map((__, rowIndex) => (
                  <SkeletonBlock key={rowIndex} className="h-14 rounded-[16px]" />
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <article
              key={index}
              className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
            >
              <SkeletonBlock className="h-5 w-40" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((__, rowIndex) => (
                  <SkeletonBlock key={rowIndex} className="h-16 rounded-[18px]" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_320px]">
        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <SkeletonBlock className="h-6 w-44" />
              <SkeletonBlock className="h-4 w-[34rem] max-w-full" />
            </div>
            <SkeletonBlock className="h-7 w-44 rounded-full" />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/65 p-4"
              >
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="mt-3 h-9 w-20" />
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-4 w-36" />
                    <SkeletonBlock className="h-4 w-[28rem] max-w-full" />
                  </div>
                  <SkeletonBlock className="h-7 w-24 rounded-full" />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {Array.from({ length: index === 1 ? 4 : 3 }).map((__, chipIndex) => (
                    <SkeletonBlock key={chipIndex} className="h-4 w-24" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 p-4">
            <SkeletonBlock className="h-4 w-60" />
            <div className="mt-3 flex flex-wrap gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-9 w-44 rounded-[14px]" />
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-4 w-64 max-w-full" />
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <SkeletonBlock className="h-5 w-36" />
          <div className="mt-4 space-y-2.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-10 rounded-[14px]" />
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <article
            key={index}
            className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
          >
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="mt-3 h-4 w-[24rem] max-w-full" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((__, rowIndex) => (
                <SkeletonBlock key={rowIndex} className="h-20 rounded-[18px]" />
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ConsoleWorkspaceLoadingState({
  section,
  eyebrow,
  title,
  description,
  variant,
}: ConsoleWorkspaceLoadingStateProps) {
  const content =
    variant === "dashboard"
      ? <DashboardLoadingSkeleton />
      : variant === "agents"
        ? <AgentsLoadingSkeleton />
        : variant === "builder"
          ? <BuilderLoadingSkeleton />
          : <SettingsLoadingSkeleton />;

  return (
    <ConsoleShell
      section={section}
      eyebrow={eyebrow}
      title={title}
      description={description}
      userEmail="Loading session..."
    >
      {content}
    </ConsoleShell>
  );
}

export function ConsoleWorkspaceErrorState({
  section,
  eyebrow,
  title,
  description,
  error,
  reset,
  retryLabel,
  fallbackHref,
  fallbackLabel,
  message,
  cardTitle,
}: ConsoleWorkspaceErrorStateProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ConsoleShell
      section={section}
      eyebrow={eyebrow}
      title={title}
      description={description}
      userEmail="Workspace session"
    >
      <article className="rounded-[var(--radius-card)] border border-[color:rgba(160,91,65,0.18)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
        <div className="inline-flex rounded-full border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8d6336]">
          Route error
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-strong)]">{cardTitle}</h2>
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