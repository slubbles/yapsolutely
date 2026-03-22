"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Bot, Phone, PhoneIncoming, Settings, LogOut, ChevronUp, Menu, X, LayoutDashboard } from "lucide-react";
import { signOutAction } from "@/app/_actions/auth";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Agents", url: "/agents", icon: Bot },
  { title: "Numbers", url: "/numbers", icon: Phone },
  { title: "Calls", url: "/calls", icon: PhoneIncoming },
  { title: "Settings", url: "/settings", icon: Settings },
];

const AppNavRail = ({ user }: { user?: { name?: string | null; email?: string | null } }) => {
  const pathname = usePathname();
  const router = useRouter();
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

  const isActive = (url: string) => pathname.startsWith(url);

  const handleSignOut = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    signOutAction();
  };

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <div className="space-y-0.5">
      {navItems.map((item) => {
        const active = isActive(item.url);
        return (
          <Link
            key={item.url}
            href={item.url}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-[0.8rem] transition-colors ${
              active
                ? "bg-canvas text-text-strong font-medium"
                : "text-text-subtle hover:text-text-strong hover:bg-canvas/60"
            }`}
          >
            <item.icon className={`w-4 h-4 ${active ? "text-text-strong" : ""}`} />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] shrink-0 h-screen sticky top-0 bg-surface-panel border-r border-border-soft flex-col">
        <Link href="/agents" className="px-5 h-14 flex items-center hover:opacity-80 transition-opacity">
          <span className="font-display text-[0.95rem] font-semibold tracking-[-0.02em] text-text-strong">
            Yapsolutely
          </span>
        </Link>
        <nav className="flex-1 px-3 py-2">
          <NavLinks />
        </nav>
        {/* Account footer */}
        <div className="relative px-3 pb-3" ref={menuRef}>
          {menuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1.5 bg-surface-panel rounded-xl border border-border-soft shadow-lg overflow-hidden z-50">
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 font-body text-[0.78rem] text-text-body hover:bg-surface-subtle transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-text-subtle" />
                Settings
              </Link>
              <div className="border-t border-border-soft" />
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
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
              menuOpen ? "bg-canvas" : "hover:bg-canvas/60"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-foreground/[0.07] flex items-center justify-center shrink-0">
              <span className="font-display text-[0.6rem] font-semibold text-text-strong">{initials}</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-body text-[0.75rem] font-medium text-text-strong truncate">{user?.name ?? "User"}</div>
              <div className="font-body text-[0.6rem] text-text-subtle truncate">{user?.email ?? ""}</div>
            </div>
            <ChevronUp className={`w-3.5 h-3.5 text-text-subtle shrink-0 transition-transform duration-200 ${menuOpen ? "" : "rotate-180"}`} />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface-panel/95 backdrop-blur-lg border-b border-border-soft">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/agents" className="flex items-center">
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
          <div className="absolute top-14 left-0 right-0 bg-surface-panel border-b border-border-soft shadow-xl">
            <nav className="px-4 py-3">
              <NavLinks onClick={() => setMobileOpen(false)} />
            </nav>
            <div className="border-t border-border-soft px-4 py-3">
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
