"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Pencil, Workflow, MessageSquare } from "lucide-react";

interface AgentWorkspaceTabsProps {
  slug: string;
}

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutDashboard, pathSuffix: "" },
  { key: "build", label: "Build", icon: Pencil, pathSuffix: "/edit" },
  { key: "flow", label: "Flow", icon: Workflow, pathSuffix: "/flow" },
  { key: "test", label: "Test", icon: MessageSquare, pathSuffix: "/test" },
];

export default function AgentWorkspaceTabs({ slug }: AgentWorkspaceTabsProps) {
  const pathname = usePathname();
  const base = `/agents/${slug}`;

  const activeKey = (() => {
    if (pathname.endsWith("/edit")) return "build";
    if (pathname.endsWith("/flow")) return "flow";
    if (pathname.endsWith("/test")) return "test";
    return "overview";
  })();

  return (
    <div className="flex items-center gap-0.5 border-b border-border-soft/60">
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.key}
            href={`${base}${tab.pathSuffix}`}
            className={`flex items-center gap-1.5 px-3 py-2 font-body text-[0.75rem] transition-colors relative ${
              active
                ? "text-text-strong font-medium"
                : "text-text-subtle hover:text-text-body"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {tab.label}
            {active && (
              <span className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-foreground rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
