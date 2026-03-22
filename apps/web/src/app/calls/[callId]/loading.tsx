import { ConsoleShell } from "@/components/console-shell";

export default function CallDetailLoading() {
  return (
    <ConsoleShell
      section="calls"
      eyebrow="Call detail"
      title="Loading transcript review..."
      description="Pulling the call timeline, metadata, and transcript text into the review surface."
      userEmail="Loading session..."
    >
      <div className="space-y-5">
        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="h-6 w-48 animate-pulse rounded bg-[var(--surface-subtle)]" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-20 animate-pulse rounded-[18px] bg-[var(--surface-subtle)]/85" />
            ))}
          </div>
        </article>

        <article className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="h-6 w-40 animate-pulse rounded bg-[var(--surface-subtle)]" />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-5 animate-pulse rounded bg-[var(--surface-subtle)]/85" />
            ))}
          </div>
        </article>
      </div>
    </ConsoleShell>
  );
}