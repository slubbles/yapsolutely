import Link from "next/link";

type WorkspacePlaceholderAction = {
  label: string;
  href: string;
  style?: "primary" | "secondary";
};

type WorkspacePlaceholderProps = {
  badge: string;
  heading: string;
  body: string;
  actions?: WorkspacePlaceholderAction[];
  highlights: Array<{
    title: string;
    body: string;
  }>;
  roadmap: string[];
};

export function WorkspacePlaceholder({
  badge,
  heading,
  body,
  actions = [],
  highlights,
  roadmap,
}: WorkspacePlaceholderProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-[var(--radius-panel)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)] sm:p-7">
        <div className="inline-flex rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
          {badge}
        </div>
        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:items-end">
          <div>
            <h2 className="font-display text-[1.4rem] font-semibold tracking-[-0.03em] text-[var(--text-strong)] sm:text-[1.7rem]">
              {heading}
            </h2>
            <p className="mt-3 max-w-3xl text-[0.88rem] leading-7 text-[var(--text-body)]">{body}</p>
          </div>

          {actions.length > 0 ? (
            <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={[
                    "inline-flex items-center justify-center rounded-[18px] px-4 py-3 text-sm font-medium transition",
                    action.style === "secondary"
                      ? "border border-[var(--border-soft)] bg-[var(--surface-subtle)] text-[var(--text-body)] hover:text-[var(--text-strong)]"
                      : "bg-[var(--text-strong)] text-white hover:bg-[color:rgba(22,24,29,0.92)]",
                  ].join(" ")}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.8fr)]">
        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">What this surface is for</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {highlights.map((highlight) => (
              <article
                key={highlight.title}
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 p-4"
              >
                <h4 className="text-[0.82rem] font-medium text-[var(--text-strong)]">{highlight.title}</h4>
                <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-subtle)]">{highlight.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <h3 className="text-[0.98rem] font-semibold text-[var(--text-strong)]">Next implementation steps</h3>
          <div className="mt-4 space-y-2.5">
            {roadmap.map((item, index) => (
              <div
                key={item}
                className="flex gap-3 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/45 px-4 py-3"
              >
                <span className="font-mono text-[0.68rem] text-[var(--text-subtle)]">0{index + 1}</span>
                <p className="text-[0.76rem] leading-6 text-[var(--text-body)]">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}