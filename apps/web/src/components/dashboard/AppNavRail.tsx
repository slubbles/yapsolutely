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

const allNavItems = navGroups.flatMap((g) => g.items);

const AppNavRail = ({ user }: { user?: { name?: string | null; email?: string | null } }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  const handleSignOut = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    signOutAction();
  };

  const NavLink = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => {
    const active = isActive(item.url);
    return (
      <Link
        href={item.url}
        onClick={onClick}
        className={`relative flex items-center gap-2.5 px-3 py-[0.38rem] rounded-lg font-body text-[0.76rem] transition-all duration-150 ${
          active
            ? "bg-canvas text-text-strong font-medium shadow-xs"
            : "text-text-subtle hover:text-text-body hover:bg-canvas/50"
        }`}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3.5 rounded-full bg-foreground/70" />
        )}
        <item.icon className={`w-[0.85rem] h-[0.85rem] shrink-0 ${active ? "text-text-strong" : ""}`} />
        <span>{item.title}</span>
      </Link>
    );
  };

  const GroupedNav = ({ onClick }: { onClick?: () => void }) => (
    <div className="space-y-4">
      {navGroups.map((group) => (
        <div key={group.label}>
          <div className="px-3 mb-1">
            <span className="font-body text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-text-subtle/50">
              {group.label}
            </span>
          </div>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink key={item.url} item={item} onClick={onClick} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] shrink-0 h-screen sticky top-0 bg-surface-panel border-r border-border-soft/50 flex-col">
        <Link href="/dashboard" className="px-5 h-14 flex items-center hover:opacity-80 transition-opacity">
          <span className="font-display text-[0.95rem] font-semibold tracking-[-0.02em] text-text-strong">
            Yapsolutely
          </span>
        </Link>

        <nav className="flex-1 px-3 py-1 overflow-y-auto">
          <GroupedNav />
        </nav>

        {/* Account footer */}
        <div className="relative px-3 pb-3 pt-2 border-t border-border-soft/40" ref={menuRef}>
          {menuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1.5 bg-surface-panel rounded-xl border border-border-soft shadow-popover overflow-hidden z-50">
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 font-body text-[0.78rem] text-text-body hover:bg-surface-subtle transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-text-subtle" />
                Settings
              </Link>
              <div className="border-t border-border-soft/50" />
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 font-body text-[0.78rem] text-text-body hover:bg-surface-subtle transition-colors"
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
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
              menuOpen ? "bg-canvas" : "hover:bg-canvas/60"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-foreground/[0.06] flex items-center justify-center shrink-0">
              <span className="font-display text-[0.6rem] font-semibold text-text-strong">{initials}</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-body text-[0.72rem] font-medium text-text-strong truncate">{user?.name ?? "User"}</div>
              <div className="font-body text-[0.58rem] text-text-subtle truncate">{user?.email ?? ""}</div>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 text-text-subtle shrink-0 transition-transform duration-200 ${menuOpen ? "" : "rotate-180"}`} />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface-panel/95 backdrop-blur-lg border-b border-border-soft">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/dashboard" className="flex items-center">
            <span className="font-display text-[0.9rem] font-semibold tracking-[-0.02em] text-text-strong">
              Yapsolutely
            </span>
          </Link>
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

      {/* Mobile slide-out nav */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} role="presentation" />
          <div className="absolute top-14 left-0 right-0 bg-surface-panel border-b border-border-soft shadow-xl max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <nav className="px-4 py-3">
              <GroupedNav onClick={() => setMobileOpen(false)} />
            </nav>
            <div className="border-t border-border-soft/40 px-4 py-3">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-full bg-foreground/[0.07] flex items-center justify-center shrink-0">
                  <span className="font-display text-[0.6rem] font-semibold text-text-strong">{initials}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-body text-[0.75rem] font-medium text-text-strong truncate">{user?.name ?? "User"}</div>
                  <div className="font-body text-[0.6rem] text-text-subtle truncate">{user?.email ?? ""}</div>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 font-body text-[0.78rem] text-text-subtle hover:text-text-body transition-colors"
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
