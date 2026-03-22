"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ConsoleShell } from "@/components/console-shell";

type CallDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CallDetailError({ error, reset }: CallDetailErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ConsoleShell
      section="calls"
      eyebrow="Call detail"
      title="This call detail view ran into trouble."
      description="The transcript review surface could not finish loading the requested record."
      userEmail="Workspace session"
    >
      <article className="rounded-[var(--radius-card)] border border-[color:rgba(160,91,65,0.18)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
        <div className="inline-flex rounded-full border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8d6336]">
          Record error
        </div>
        <h2 className="mt-4 text-lg font-semibold text-[var(--text-strong)]">Unable to open this call right now</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">
          Retry the route first. If it keeps failing, the call record may be missing or the database may be temporarily unavailable.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
          >
            Retry call detail
          </button>
          <Link
            href="/calls"
            className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
          >
            Back to calls
          </Link>
        </div>
      </article>
    </ConsoleShell>
  );
}