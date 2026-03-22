"use client";

import { useState, useMemo, useRef, Suspense } from "react";
import { Search, Plus, Upload, Bot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import EmptyState from "@/components/dashboard/EmptyState";
import { importAgentAction } from "@/app/_actions/agents";
import type { AgentListItem } from "@/lib/agent-data";

const statusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE": return "Active";
    case "PAUSED": return "Paused";
    case "DRAFT": return "Draft";
    case "ARCHIVED": return "Archived";
    default: return status;
  }
};

const statusDot = (status: string) => {
  switch (status) {
    case "ACTIVE": return "bg-emerald-400";
    case "PAUSED": return "bg-accent-warm";
    default: return "bg-text-subtle/25";
  }
};

const statusPill = (status: string) => {
  switch (status) {
    case "ACTIVE": return "bg-emerald-400/10 text-emerald-600";
    case "PAUSED": return "bg-accent-warm/10 text-accent-warm-dim";
    default: return "bg-surface-subtle text-text-subtle";
  }
};

function timeAgo(date: Date) {
  const ms = Date.now() - new Date(date).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AgentsClient({ agents }: { agents: AgentListItem[] }) {
  return (
    <Suspense>
      <AgentsClientInner agents={agents} />
    </Suspense>
  );
}

function AgentsClientInner({ agents }: { agents: AgentListItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showOnboarding, setShowOnboarding] = useState(searchParams.get("onboarding") === "true");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => {
    const all = agents.length;
    const active = agents.filter((a) => a.status === "ACTIVE").length;
    const paused = agents.filter((a) => a.status === "PAUSED").length;
    const draft = agents.filter((a) => a.status === "DRAFT").length;
    return { all, active, paused, draft };
  }, [agents]);

  const filtered = useMemo(() => {
    let result = agents;
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.phoneNumber?.includes(q) ||
          a.voiceModel?.toLowerCase().includes(q),
      );
    }
    return result;
  }, [agents, query, statusFilter]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.replace("/agents");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const formData = new FormData();
      formData.set("agentJson", text);
      importAgentAction(formData);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const filterTabs: { key: string; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "ACTIVE", label: "Active", count: counts.active },
    { key: "PAUSED", label: "Paused", count: counts.paused },
    { key: "DRAFT", label: "Draft", count: counts.draft },
  ];

  return (
    <DashboardLayout>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-[1.12rem] font-semibold tracking-[-0.02em] text-text-strong">
              Agents
            </h1>
            <span className="font-body text-[0.72rem] text-text-subtle tabular-nums">
              {counts.all} total
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="sm"
              className="font-body text-text-subtle text-[0.75rem] gap-1.5 h-8"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button
              onClick={() => router.push("/agents/new")}
              variant="hero"
              size="sm"
              className="rounded-lg gap-1.5 text-[0.78rem] h-8"
            >
              <Plus className="w-3.5 h-3.5" />
              Create agent
            </Button>
          </div>
        </div>

        {agents.length === 0 ? (
          <div className="bg-surface-panel rounded-card border border-border-soft">
            <EmptyState
              icon={Bot}
              title="No agents yet"
              description="Create your first voice agent to start handling calls."
              actionLabel="Create your first agent"
              onAction={() => router.push("/agents/new")}
              secondaryLabel="Browse templates"
            />
          </div>
        ) : (
          <>
            {/* ── Control row ── */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-1">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`h-7 px-2.5 rounded-md font-body text-[0.72rem] transition-all flex items-center gap-1.5 ${
                      statusFilter === tab.key
                        ? "bg-foreground text-background font-medium"
                        : "text-text-subtle hover:text-text-body hover:bg-surface-subtle"
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[0.62rem] tabular-nums ${
                      statusFilter === tab.key ? "text-background/60" : "text-text-subtle/50"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-subtle/50" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search agents..."
                  className="w-full h-7 pl-8 pr-3 rounded-md border border-border-soft/60 bg-transparent font-body text-[0.75rem] text-text-strong placeholder:text-text-subtle/40 focus:outline-none focus:border-foreground/20 transition-colors"
                />
              </div>
            </div>

            {/* ── Table ── */}
            {filtered.length === 0 ? (
              <div className="bg-surface-panel rounded-card border border-border-soft p-8 text-center">
                <p className="font-body text-[0.82rem] text-text-subtle">No agents match your filters.</p>
              </div>
            ) : (
              <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-soft/80">
                        <th className="text-left pl-4 pr-3 py-2 font-body text-[0.62rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Name</th>
                        <th className="text-left px-3 py-2 font-body text-[0.62rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Status</th>
                        <th className="text-left px-3 py-2 font-body text-[0.62rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Phone</th>
                        <th className="text-left px-3 py-2 font-body text-[0.62rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Voice</th>
                        <th className="text-right px-3 py-2 font-body text-[0.62rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Calls</th>
                        <th className="text-right pl-3 pr-4 py-2 font-body text-[0.62rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((agent) => (
                        <tr
                          key={agent.id}
                          onClick={() => router.push(`/agents/${agent.slug ?? agent.id}`)}
                          className="border-b border-border-soft/50 last:border-0 hover:bg-surface-subtle/30 transition-colors cursor-pointer group"
                        >
                          <td className="pl-4 pr-3 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(agent.status)}`} />
                              <span className="font-body text-[0.78rem] font-medium text-text-strong group-hover:text-text-strong/80 truncate max-w-[200px]">
                                {agent.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex px-1.5 py-px rounded text-[0.64rem] font-body font-medium ${statusPill(agent.status)}`}>
                              {statusLabel(agent.status)}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[0.7rem] text-text-subtle">
                            {agent.phoneNumber ?? "—"}
                          </td>
                          <td className="px-3 py-2.5 font-body text-[0.72rem] text-text-body">
                            {agent.voiceModel ?? "Default"}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-[0.7rem] text-text-subtle tabular-nums">
                            {agent.callCount}
                          </td>
                          <td className="pl-3 pr-4 py-2.5 text-right font-body text-[0.68rem] text-text-subtle/70">
                            {timeAgo(agent.updatedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
