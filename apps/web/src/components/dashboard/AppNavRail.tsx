"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  Phone,
  PhoneIncoming,
  Settings,
  LogOut,
  ChevronUp,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  PhoneOutgoing,
  BarChart3,
  ShieldCheck,
  Bell,
  CreditCard,
} from "lucide-react";
import { signOutAction } from "@/app/_actions/auth";
import ThemeToggle from "@/components/theme-toggle";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Build",
    items: [
      { title: "Agents", url: "/agents", icon: Bot },
      { title: "Knowledge Base", url: "/knowledge-base", icon: BookOpen },
    ],
  },
  {
    label: "Deploy",
    items: [
      { title: "Numbers", url: "/numbers", icon: Phone },
      { title: "Batch Calls", url: "/batch-calls", icon: PhoneOutgoing },
    ],
  },
  {
    label: "Monitor",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
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

function NavLinkItem({ item, onClick, pathname }: { item: NavItem; onClick?: () => void; pathname: string }) {
  const active = pathname === item.url || pathname.startsWith(item.url + "/");
  return (
    <Link
      href={item.url}
      onClick={onClick}
      className={`relative flex items-center gap-2.5 px-3 py-[0.38rem] rounded-lg font-body text-[0.84rem] transition-all duration-150 focus-ring ${
        active
          ? "bg-canvas text-text-strong font-medium shadow-xs"
          : "text-text-subtle hover:text-text-body hover:bg-canvas/50 hover:translate-x-0.5"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3.5 rounded-full bg-foreground/70" />
      )}
      <item.icon className={`w-[0.85rem] h-[0.85rem] shrink-0 ${active ? "text-text-strong" : ""}`} />
      <span>{item.title}</span>
    </Link>
  );
}

function GroupedNav({ onClick, pathname }: { onClick?: () => void; pathname: string }) {
  return (
    <div className="space-y-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <div className="px-3 mb-1">
            <span className="font-body text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-text-subtle/50">
              {group.label}
            </span>
          </div>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLinkItem key={item.url} item={item} onClick={onClick} pathname={pathname} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const AppNavRail = ({ user }: { user?: { name?: string | null; email?: string | null; plan?: string | null } }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const menuRef = useRef<HTMLDivElement>(null);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleSignOut = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    signOutAction();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] shrink-0 h-screen sticky top-0 bg-surface-panel border-r border-border-soft/50 flex-col">
        <div className="px-5 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
            <span className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-text-strong">
              Yapsolutely
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <nav className="flex-1 px-3 py-1 overflow-y-auto">
          <GroupedNav pathname={pathname} />
        </nav>

        {/* Plan indicator */}
        <div className="px-3 pb-2">
          <Link
            href="/billing"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-canvas/80 border border-border-soft/40 hover:border-border-soft transition-colors group"
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              user?.plan === "PRO" || user?.plan === "ENTERPRISE" ? "bg-emerald-400" :
              user?.plan === "STARTER" ? "bg-blue-400" : "bg-amber-400 animate-pulse"
            }`} />
            <div className="flex-1 min-w-0">
              <span className="font-body text-[0.72rem] font-medium text-text-strong block truncate">
                {user?.plan === "PRO" ? "Pro plan" :
                 user?.plan === "ENTERPRISE" ? "Enterprise" :
                 user?.plan === "STARTER" ? "Starter plan" : "Free trial"}
              </span>
              <span className="font-body text-[0.62rem] text-text-subtle/60 block">
                {user?.plan === "PRO" || user?.plan === "ENTERPRISE" ? "Active subscription" :
                 user?.plan === "STARTER" ? "Basic features" : "Upgrade for more"}
              </span>
            </div>
          </Link>
        </div>

        {/* Account footer */}
        <div className="relative px-3 pb-3 pt-2 border-t border-border-soft/40" ref={menuRef}>
          {menuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1.5 bg-surface-panel rounded-xl border border-border-soft shadow-popover overflow-hidden z-50">
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 font-body text-[0.87rem] text-text-body hover:bg-surface-subtle transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-text-subtle" />
                Settings
              </Link>
              <div className="border-t border-border-soft/50" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 font-body text-[0.87rem] text-text-body hover:bg-surface-subtle transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-text-subtle" />
                Sign out
              </button>
            </div>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Account menu"
            aria-expanded={menuOpen}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors focus-ring ${
              menuOpen ? "bg-canvas" : "hover:bg-canvas/60"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-foreground/[0.06] flex items-center justify-center shrink-0">
              <span className="font-display text-[0.77rem] font-semibold text-text-strong">{initials}</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-body text-[0.89rem] font-medium text-text-strong truncate">{user?.name ?? "User"}</div>
              <div className="font-body text-[0.67rem] text-text-subtle truncate">{user?.email ?? ""}</div>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 text-text-subtle shrink-0 transition-transform duration-200 ${menuOpen ? "" : "rotate-180"}`} />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface-panel/95 backdrop-blur-lg border-b border-border-soft">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/dashboard" className="flex items-center">
            <span className="font-display text-[1.1rem] font-semibold tracking-[-0.02em] text-text-strong">
              Yapsolutely
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              className="p-2 rounded-lg hover:bg-canvas transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5 text-text-strong" /> : <Menu className="w-5 h-5 text-text-strong" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-out nav */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} role="presentation" />
          <div className="absolute top-14 left-0 right-0 bg-surface-panel border-b border-border-soft shadow-xl max-h-[calc(100vh-3.5rem)] overflow-y-auto animate-slide-down">
            <nav className="px-4 py-3">
              <GroupedNav onClick={() => setMobileOpen(false)} pathname={pathname} />
            </nav>
            <div className="border-t border-border-soft/40 px-4 py-3">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-full bg-foreground/[0.07] flex items-center justify-center shrink-0">
                  <span className="font-display text-[0.77rem] font-semibold text-text-strong">{initials}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-body text-[0.84rem] font-medium text-text-strong truncate">{user?.name ?? "User"}</div>
                  <div className="font-body text-[0.77rem] text-text-subtle truncate">{user?.email ?? ""}</div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 font-body text-[0.87rem] text-text-subtle hover:text-text-body transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppNavRail;
