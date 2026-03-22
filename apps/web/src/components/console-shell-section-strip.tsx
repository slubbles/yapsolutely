"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  type ConsoleShellContextAction,
  type ConsoleShellContextItem,
  isContextItemActive,
} from "./console-shell-context";

type ConsoleShellSectionStripProps = {
  items: ConsoleShellContextItem[];
  actions?: ConsoleShellContextAction[];
};

export function ConsoleShellSectionStrip({ items, actions = [] }: ConsoleShellSectionStripProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() || "";

  const linkItems = items.filter((item) => item.href);

  if (linkItems.length === 0 && actions.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 border-t border-[var(--border-soft)] pt-4 xl:hidden">
      {linkItems.length > 0 ? (
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Section navigation
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {linkItems.map((item) => {
              const active = isContextItemActive(pathname, search, item);

              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href!}
                  className={[
                    "rounded-full px-3.5 py-2 text-[0.76rem] font-medium transition-colors",
                    active
                      ? "bg-[var(--text-strong)] text-white"
                      : "bg-[var(--surface-subtle)] text-[var(--text-body)] hover:text-[var(--text-strong)]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

      {actions.length > 0 ? (
        <div className={linkItems.length > 0 ? "mt-4" : ""}>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            Quick actions
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => (
              <Link
                key={`${action.label}-${action.href}`}
                href={action.href}
                className={[
                  "rounded-full px-3.5 py-2 text-[0.76rem] font-medium transition-colors",
                  action.style === "primary"
                    ? "bg-[var(--text-strong)] text-white hover:bg-[color:rgba(22,24,29,0.92)]"
                    : "bg-[var(--surface-subtle)] text-[var(--text-body)] hover:text-[var(--text-strong)]",
                ].join(" ")}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}