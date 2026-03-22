import { ReactNode, Suspense } from "react";
import { AppContextPane } from "@/components/app-context-pane";
import { AppNavRail } from "@/components/app-nav-rail";
import { getConsoleShellContext, type ConsoleShellSection } from "./console-shell-context";
import { ConsoleShellSectionStrip } from "./console-shell-section-strip";

type ConsoleShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  userEmail?: string;
  section?: ConsoleShellSection;
  children?: ReactNode;
};

export function ConsoleShell({
  eyebrow,
  title,
  description,
  userEmail,
  section,
  children,
}: ConsoleShellProps) {
  const contextPane = getConsoleShellContext(section, eyebrow);

  return (
    <div className="flex min-h-screen bg-[var(--canvas)] text-[var(--foreground)]">
      <AppNavRail userEmail={userEmail} />
      <Suspense fallback={null}>
        <AppContextPane
          title={contextPane.title}
          description={contextPane.description}
          items={contextPane.items}
          actions={contextPane.actions}
        />
      </Suspense>

      <main className="min-w-0 flex-1 overflow-auto pt-14 md:pt-0">
        <div className="p-5 sm:p-8">
          <div className="mx-auto max-w-[1180px]">
            <header className="mb-8 rounded-[var(--radius-panel)] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-5 py-5 shadow-[var(--shadow-sm)] sm:px-6 sm:py-6">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.18em] text-[var(--text-subtle)]">
                {eyebrow}
              </p>
              <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <h1 className="font-display text-[1.55rem] font-semibold tracking-[-0.03em] text-[var(--text-strong)] sm:text-[1.82rem]">
                    {title}
                  </h1>
                  <p className="mt-3 max-w-3xl text-[0.9rem] leading-7 text-[var(--text-body)]">
                    {description}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[var(--surface-subtle)] px-4 py-3 text-sm text-[var(--text-body)]">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
                    Session
                  </p>
                  <p className="mt-1 text-[0.8rem] font-medium text-[var(--text-strong)]">
                    {userEmail || "Demo workspace"}
                  </p>
                </div>
              </div>
              <Suspense fallback={null}>
                <ConsoleShellSectionStrip items={contextPane.items} actions={contextPane.actions} />
              </Suspense>
            </header>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
