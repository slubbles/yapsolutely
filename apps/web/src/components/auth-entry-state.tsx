"use client";

import Link from "next/link";
import { ReactNode, useEffect } from "react";
import { AuthEntryShell } from "@/components/auth-entry-shell";

type AuthEntryLoadingProps = {
  mode: "sign-in" | "sign-up";
  eyebrow: string;
  title: string;
  description: string;
  asideTitle: string;
  asideBody: string;
  stats: Array<{
    label: string;
    value: string;
    note: string;
  }>;
  children?: ReactNode;
};

type AuthEntryErrorProps = {
  mode: "sign-in" | "sign-up";
  eyebrow: string;
  title: string;
  description: string;
  asideTitle: string;
  asideBody: string;
  stats: Array<{
    label: string;
    value: string;
    note: string;
  }>;
  error: Error & { digest?: string };
  reset: () => void;
  retryLabel: string;
  fallbackHref: string;
  fallbackLabel: string;
  message: string;
};

function SkeletonBlock({ className }: { className: string }) {
  return <div className={["animate-pulse rounded bg-[var(--surface-subtle)]", className].join(" ")} />;
}

export function AuthEntryLoadingState({
  mode,
  eyebrow,
  title,
  description,
  asideTitle,
  asideBody,
  stats,
  children,
}: AuthEntryLoadingProps) {
  return (
    <AuthEntryShell
      mode={mode}
      eyebrow={eyebrow}
      title={title}
      description={description}
      asideTitle={asideTitle}
      asideBody={asideBody}
      stats={stats}
    >
      <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-md)] sm:p-7">
        <div className="mb-5 rounded-[18px] bg-[var(--surface-subtle)] px-4 py-4">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="mt-3 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-4/5" />
        </div>

        <SkeletonBlock className="h-12 w-full rounded-xl" />
        <SkeletonBlock className="mx-auto mb-6 mt-3 h-4 w-56" />

        <div className="mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--border-soft)]" />
          <SkeletonBlock className="h-3 w-8" />
          <div className="h-px flex-1 bg-[var(--border-soft)]" />
        </div>

        <div className="space-y-4">
          {children ?? (
            <>
              <div>
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="mt-2 h-11 w-full rounded-xl" />
              </div>
              <div>
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="mt-2 h-11 w-full rounded-xl" />
              </div>
            </>
          )}
          <SkeletonBlock className="h-11 w-full rounded-xl" />
        </div>

        <SkeletonBlock className="mx-auto mt-6 h-4 w-44" />
      </div>
    </AuthEntryShell>
  );
}

export function AuthEntryErrorState({
  mode,
  eyebrow,
  title,
  description,
  asideTitle,
  asideBody,
  stats,
  error,
  reset,
  retryLabel,
  fallbackHref,
  fallbackLabel,
  message,
}: AuthEntryErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AuthEntryShell
      mode={mode}
      eyebrow={eyebrow}
      title={title}
      description={description}
      asideTitle={asideTitle}
      asideBody={asideBody}
      stats={stats}
    >
      <div className="rounded-[30px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-md)] sm:p-7">
        <div className="inline-flex rounded-full border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8d6336]">
          Route error
        </div>

        <div className="mt-5 rounded-[18px] bg-[var(--surface-subtle)] px-4 py-4">
          <div className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-subtle)]">What happened</div>
          <p className="mt-2 text-[0.82rem] leading-6 text-[var(--text-body)]">{message}</p>
          <p className="mt-3 break-all font-mono text-[0.68rem] leading-6 text-[var(--text-subtle)]">
            {error.digest || error.message || "Unknown route error"}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
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
      </div>
    </AuthEntryShell>
  );
}