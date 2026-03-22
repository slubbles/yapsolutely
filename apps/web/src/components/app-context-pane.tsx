"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  type ConsoleShellContextAction,
  type ConsoleShellContextItem,
  isContextItemActive,
} from "./console-shell-context";

type AppContextPaneProps = {
  title: string;
  description: string;
  items: ConsoleShellContextItem[];
  actions?: ConsoleShellContextAction[];
};

export function AppContextPane({ title, description, items, actions = [] }: AppContextPaneProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() || "";

  return (
    <aside className="hidden xl:flex xl:w-[270px] xl:shrink-0 xl:flex-col xl:border-r xl:border-[var(--border-soft)] xl:bg-[var(--surface-panel)]">
      <div className="sticky top-0 p-4">
        <div className="rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/65 p-4 shadow-[var(--shadow-sm)]">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            Section
          </div>
          <h2 className="mt-3 font-display text-[1.02rem] font-semibold tracking-[-0.02em] text-[var(--text-strong)]">
            {title}
          </h2>
          <p className="mt-2 text-[0.78rem] leading-6 text-[var(--text-subtle)]">{description}</p>
        </div>

        <div className="mt-4 rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-3 shadow-[var(--shadow-sm)]">
          <div className="px-2 pb-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Context
          </div>
          <div className="space-y-1">
            {items.map((item) => {
              const active = isContextItemActive(pathname, search, item);

              if (!item.href) {
                return (
                  <div
                    key={item.label}
                    className="rounded-[16px] px-3 py-3 text-[0.78rem] text-[var(--text-body)]"
                  >
                    <div className="font-medium text-[var(--text-strong)]">{item.label}</div>
                    {item.note ? <div className="mt-1 text-[0.7rem] leading-6 text-[var(--text-subtle)]">{item.note}</div> : null}
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={[
                    "block rounded-[16px] px-3 py-3 transition-colors",
                    active
                      ? "bg-[var(--surface-subtle)] text-[var(--text-strong)]"
                      : "text-[var(--text-body)] hover:bg-[var(--surface-subtle)]/75 hover:text-[var(--text-strong)]",
                  ].join(" ")}
                >
                  <div className="text-[0.78rem] font-medium">{item.label}</div>
                  {item.note ? <div className="mt-1 text-[0.7rem] leading-6 text-[var(--text-subtle)]">{item.note}</div> : null}
                </Link>
              );
            })}
          </div>
        </div>

        {actions.length > 0 ? (
          <div className="mt-4 rounded-[24px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-3 shadow-[var(--shadow-sm)]">
            <div className="px-2 pb-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
              Quick actions
            </div>
            <div className="space-y-2">
              {actions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={[
                    "flex items-center justify-between rounded-[16px] px-3 py-3 text-[0.78rem] font-medium transition-colors",
                    action.style === "primary"
                      ? "bg-[var(--text-strong)] text-white hover:bg-[color:rgba(22,24,29,0.92)]"
                      : "bg-[var(--surface-subtle)] text-[var(--text-body)] hover:text-[var(--text-strong)]",
                  ].join(" ")}
                >
                  <span>{action.label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}