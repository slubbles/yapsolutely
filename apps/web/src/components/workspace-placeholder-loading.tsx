type WorkspacePlaceholderLoadingProps = {
  variant?: "knowledge" | "monitor" | "qa" | "alerts" | "billing" | "deploy";
};

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-[var(--surface-subtle)] ${className}`} />;
}

function DarkHeroSkeleton() {
  return (
    <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
      <div className="h-6 w-28 animate-pulse rounded-full border border-white/10 bg-white/10" />
      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:items-end">
        <div>
          <div className="h-10 w-[32rem] max-w-full animate-pulse rounded bg-white/10" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-white/5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
              <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-7 w-16 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterBarSkeleton() {
  return (
    <div className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)] md:grid-cols-[1fr_180px_auto]">
      <div>
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="mt-3 h-11 w-full rounded-[18px]" />
      </div>
      <div>
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="mt-3 h-11 w-full rounded-[18px]" />
      </div>
      <div className="flex items-end gap-3">
        <SkeletonBlock className="h-11 w-28 rounded-[18px]" />
        <SkeletonBlock className="h-11 w-20 rounded-[18px]" />
      </div>
    </div>
  );
}

function SummaryCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className={`grid gap-4 ${count === 3 ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"}`}>
      {Array.from({ length: count }).map((_, index) => (
        <section
          key={index}
          className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
        >
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-3 h-9 w-20" />
          <div className="mt-3 space-y-2">
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-4/5" />
          </div>
        </section>
      ))}
    </div>
  );
}

function TableShellSkeleton({ columns = 6, rows = 4 }: { columns?: number; rows?: number }) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
        <div>
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="mt-2 h-3 w-64" />
        </div>
        <SkeletonBlock className="h-4 w-20" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-[var(--border-soft)]">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-5 py-3 text-left">
                  <SkeletonBlock className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[var(--border-soft)] last:border-b-0">
                {Array.from({ length: columns }).map((_, columnIndex) => (
                  <td key={columnIndex} className="px-5 py-4">
                    <SkeletonBlock className={columnIndex === 0 ? "h-4 w-40" : "h-4 w-20"} />
                    {columnIndex === 0 ? <SkeletonBlock className="mt-2 h-3 w-56" /> : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SideListSkeleton({ titleWidth = "w-32", items = 3 }: { titleWidth?: string; items?: number }) {
  return (
    <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
      <div className="border-b border-[var(--border-soft)] px-5 py-4">
        <SkeletonBlock className={`h-4 ${titleWidth}`} />
      </div>
      <div className="space-y-2 p-4">
        {Array.from({ length: items }).map((_, index) => (
          <div key={index} className="rounded-lg border border-[var(--border-soft)] bg-[var(--surface-subtle)]/35 p-3">
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="mt-2 h-3 w-full" />
            <SkeletonBlock className="mt-2 h-3 w-4/5" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function WorkspacePlaceholderLoading({ variant = "monitor" }: WorkspacePlaceholderLoadingProps) {
  if (variant === "knowledge") {
    return (
      <div className="space-y-5">
        <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
          <FilterBarSkeleton />
          <SummaryCardsSkeleton count={3} />
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <TableShellSkeleton columns={6} rows={5} />
            <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="mt-3 h-3 w-full" />
              <SkeletonBlock className="mt-2 h-3 w-5/6" />
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="mt-2 h-3 w-5/6" />
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="space-y-5">
            <SideListSkeleton titleWidth="w-28" items={4} />
            <SideListSkeleton titleWidth="w-32" items={2} />
            <SideListSkeleton titleWidth="w-24" items={3} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "billing") {
    return (
      <div className="space-y-5">
        <DarkHeroSkeleton />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <SummaryCardsSkeleton count={4} />
            <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
                <div>
                  <SkeletonBlock className="h-5 w-32" />
                  <SkeletonBlock className="mt-2 h-3 w-72" />
                </div>
                <SkeletonBlock className="h-4 w-20" />
              </div>
              <div className="space-y-3 p-5">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <SkeletonBlock className="h-4 w-32" />
                        <SkeletonBlock className="mt-2 h-3 w-full" />
                      </div>
                      <div className="w-24">
                        <SkeletonBlock className="h-5 w-full" />
                        <SkeletonBlock className="mt-2 h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="space-y-5">
            <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <SkeletonBlock className="h-5 w-24" />
              <div className="mt-4 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <SkeletonBlock className="h-3 w-20" />
                      <SkeletonBlock className="h-3 w-12" />
                    </div>
                    <SkeletonBlock className="h-2.5 w-full rounded-full" />
                    <SkeletonBlock className="mt-2 h-3 w-full" />
                  </div>
                ))}
              </div>
            </section>
            <SideListSkeleton titleWidth="w-32" items={4} />
            <SideListSkeleton titleWidth="w-24" items={2} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "deploy") {
    return (
      <div className="space-y-5">
        <DarkHeroSkeleton />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <FilterBarSkeleton />
          <SummaryCardsSkeleton count={3} />
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <TableShellSkeleton columns={6} rows={3} />
            <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
              <SkeletonBlock className="h-5 w-44" />
              <SkeletonBlock className="mt-3 h-3 w-full" />
              <SkeletonBlock className="mt-2 h-3 w-5/6" />
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="mt-2 h-3 w-4/5" />
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="space-y-5">
            <SideListSkeleton titleWidth="w-36" items={3} />
            <SideListSkeleton titleWidth="w-32" items={3} />
            <SideListSkeleton titleWidth="w-24" items={2} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DarkHeroSkeleton />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <FilterBarSkeleton />
        <SummaryCardsSkeleton count={3} />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          {variant === "qa" ? <TableShellSkeleton columns={7} rows={4} /> : <TableShellSkeleton columns={5} rows={4} />}
          {variant === "monitor" ? (
            <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <SkeletonBlock className="h-5 w-40" />
                  <SkeletonBlock className="mt-2 h-3 w-72" />
                </div>
                <SkeletonBlock className="h-4 w-28" />
              </div>
              <div className="mt-6 grid grid-cols-7 gap-3">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center gap-3">
                    <div className="flex h-36 w-full items-end rounded-[20px] bg-[var(--surface-subtle)]/55 px-3 py-3">
                      <div className="w-full animate-pulse rounded-[14px] bg-[var(--surface-subtle)]/90" style={{ height: `${20 + ((index % 4) + 1) * 15}%` }} />
                    </div>
                    <SkeletonBlock className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
        <div className="space-y-5">
          <SideListSkeleton titleWidth={variant === "alerts" ? "w-28" : "w-32"} items={variant === "qa" ? 3 : 4} />
          <SideListSkeleton titleWidth="w-36" items={3} />
          <SideListSkeleton titleWidth="w-24" items={2} />
        </div>
      </div>
    </div>
  );
}