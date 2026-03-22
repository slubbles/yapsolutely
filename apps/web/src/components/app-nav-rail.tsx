"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Bell,
  Bot,
  ChevronUp,
  CreditCard,
  Database,
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  PhoneIncoming,
  Send,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";
import { signOutAction } from "@/app/_actions/auth";

const navGroups = [
  {
    label: "Home",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Build",
    items: [
      { title: "Agents", url: "/agents", icon: Bot },
      { title: "Knowledge base", url: "/knowledge-base", icon: Database },
    ],
  },
  {
    label: "Deploy",
    items: [
      { title: "Numbers", url: "/numbers", icon: Phone },
      { title: "Batch calls", url: "/batch-calls", icon: Send },
    ],
  },
  {
    label: "Monitor",
    items: [
      { title: "Calls", url: "/calls", icon: PhoneIncoming },
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
      { title: "QA", url: "/qa", icon: ShieldCheck },
      { title: "Alerts", url: "/alerts", icon: Bell },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Billing", url: "/billing", icon: CreditCard },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

type AppNavRailProps = {
  userEmail?: string;
};

function initialsFromEmail(email?: string) {
  if (!email) {
    return "YS";
  }

  const localPart = email.split("@")[0] || "";
  const words = localPart
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) {
    return "YS";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export function AppNavRail({ userEmail }: AppNavRailProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userInitials = useMemo(() => initialsFromEmail(userEmail), [userEmail]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  const isActive = (url: string) => pathname === url || pathname.startsWith(`${url}/`);

  const navLinks = (onClick?: () => void) => (
    <div className="space-y-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <div className="px-3 pb-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-subtle)]">
            {group.label}
          </div>
          <div className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(item.url);

              return (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => {
                    onClick?.();
                    setMenuOpen(false);
                  }}
                  className={[
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.82rem] transition-colors",
                    active
                      ? "bg-[var(--surface-subtle)] text-[var(--text-strong)] font-medium"
                      : "text-[var(--text-subtle)] hover:bg-[color-mix(in_srgb,var(--surface-subtle)_72%,transparent)] hover:text-[var(--text-strong)]",
                  ].join(" ")}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-[236px] md:shrink-0 md:flex-col md:border-r md:border-[var(--border-soft)] md:bg-[var(--surface-panel)]">
        <Link href="/dashboard" className="flex h-14 items-center px-5 transition-opacity hover:opacity-80">
          <span className="font-display text-[0.98rem] font-semibold tracking-[-0.02em] text-[var(--text-strong)]">
            Yapsolutely
          </span>
        </Link>

        <nav className="flex-1 px-3 py-2">{navLinks()}</nav>

        <div className="relative px-3 pb-3" ref={menuRef}>
          {menuOpen ? (
            <div className="absolute inset-x-3 bottom-full z-50 mb-2 overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-popover)]">
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-4 py-3 text-[0.8rem] text-[var(--text-body)] transition-colors hover:bg-[var(--surface-subtle)]"
              >
                <Settings className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
                Settings
              </Link>
              <div className="border-t border-[var(--border-soft)]" />
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 px-4 py-3 text-[0.8rem] text-[var(--text-body)] transition-colors hover:bg-[var(--surface-subtle)]"
                >
                  <LogOut className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
                  Sign out
                </button>
              </form>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className={[
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors",
              menuOpen ? "bg-[var(--surface-subtle)]" : "hover:bg-[var(--surface-subtle)]/70",
            ].join(" ")}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--text-strong)_7%,transparent)]">
              <span className="font-display text-[0.64rem] font-semibold text-[var(--text-strong)]">{userInitials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[0.78rem] font-medium text-[var(--text-strong)]">
                {userEmail?.split("@")[0] || "Workspace session"}
              </div>
              <div className="truncate text-[0.66rem] text-[var(--text-subtle)]">
                {userEmail || "demo@yapsolutely.ai"}
              </div>
            </div>
            <ChevronUp
              className={[
                "h-3.5 w-3.5 shrink-0 text-[var(--text-subtle)] transition-transform duration-200",
                menuOpen ? "" : "rotate-180",
              ].join(" ")}
            />
          </button>
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface-panel)_95%,transparent)] backdrop-blur-xl md:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="font-display text-[0.92rem] font-semibold tracking-[-0.02em] text-[var(--text-strong)]">
            Yapsolutely
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-lg p-2 transition-colors hover:bg-[var(--surface-subtle)]"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-[var(--text-strong)]" />
            ) : (
              <Menu className="h-5 w-5 text-[var(--text-strong)]" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--text-strong)_18%,transparent)] backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close mobile navigation"
          />
          <div className="absolute inset-x-0 top-14 border-b border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-xl)]">
            <nav className="px-4 py-3">{navLinks(() => setMobileOpen(false))}</nav>
            <div className="border-t border-[var(--border-soft)] px-4 py-3">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--text-strong)_7%,transparent)]">
                  <span className="font-display text-[0.64rem] font-semibold text-[var(--text-strong)]">{userInitials}</span>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-[0.78rem] font-medium text-[var(--text-strong)]">
                    {userEmail?.split("@")[0] || "Workspace session"}
                  </div>
                  <div className="truncate text-[0.66rem] text-[var(--text-subtle)]">
                    {userEmail || "demo@yapsolutely.ai"}
                  </div>
                </div>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-[0.8rem] text-[var(--text-subtle)] transition-colors hover:text-[var(--text-body)]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}