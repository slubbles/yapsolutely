"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface ContextItem {
  label: string;
  href: string;
  count?: number;
}

interface SectionConfig {
  title: string;
  items: ContextItem[];
}

/**
 * Section-specific context pane configurations.
 * Each top-level route area gets its own set of contextual filters / sub-nav.
 */
function getSectionConfig(pathname: string): SectionConfig | null {
  if (pathname.startsWith("/agents")) {
    // Agent detail subpages — show agent workspace nav
    const agentMatch = pathname.match(/^\/agents\/([^/]+)/);
    if (agentMatch && agentMatch[1] !== "new") {
      const agentSlug = agentMatch[1];
      return {
        title: "Agent",
        items: [
          { label: "All agents", href: "/agents" },
          { label: "Overview", href: `/agents/${agentSlug}` },
          { label: "Build", href: `/agents/${agentSlug}/edit` },
          { label: "Flow", href: `/agents/${agentSlug}/flow` },
          { label: "Test", href: `/agents/${agentSlug}/test` },
        ],
      };
    }
    return {
      title: "Agents",
      items: [
        { label: "All agents", href: "/agents" },
        { label: "Create new", href: "/agents/new" },
      ],
    };
  }

  if (pathname.startsWith("/calls")) {
    return {
      title: "Call History",
      items: [
        { label: "All calls", href: "/calls" },
      ],
    };
  }

  if (pathname.startsWith("/numbers")) {
    return {
      title: "Numbers",
      items: [
        { label: "All numbers", href: "/numbers" },
      ],
    };
  }

  if (pathname.startsWith("/settings")) {
    return {
      title: "Settings",
      items: [
        { label: "General", href: "/settings" },
      ],
    };
  }

  if (pathname.startsWith("/dashboard")) {
    return {
      title: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard" },
      ],
    };
  }

  if (pathname.startsWith("/analytics")) {
    return {
      title: "Analytics",
      items: [
        { label: "Overview", href: "/analytics" },
      ],
    };
  }

  if (pathname.startsWith("/knowledge-base")) {
    return {
      title: "Knowledge Base",
      items: [
        { label: "All sources", href: "/knowledge-base" },
      ],
    };
  }

  if (pathname.startsWith("/billing")) {
    return {
      title: "Billing",
      items: [
        { label: "Plan & usage", href: "/billing" },
      ],
    };
  }

  return null;
}

const SectionContextPane = () => {
  const pathname = usePathname();
  const config = getSectionConfig(pathname);

  if (!config) return null;

  return (
    <div className="hidden lg:flex w-[200px] shrink-0 h-screen sticky top-0 bg-surface-subtle/50 border-r border-border-soft/40 flex-col">
      <div className="px-4 h-14 flex items-center">
        <h2 className="font-display text-[1.02rem] font-semibold text-text-strong tracking-[-0.01em]">
          {config.title}
        </h2>
      </div>
      <nav className="flex-1 px-3 py-1">
        <div className="space-y-px">
          {config.items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-[0.4rem] rounded-lg font-body text-[0.84rem] transition-colors ${
                  active
                    ? "bg-surface-panel text-text-strong font-medium shadow-surface-xs"
                    : "text-text-subtle hover:text-text-body hover:bg-surface-panel/60"
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-[0.79rem] font-body text-text-subtle/70 tabular-nums">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default SectionContextPane;
