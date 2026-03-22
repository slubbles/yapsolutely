"use client";

import { useState, useMemo, useRef, Suspense } from "react";
import { Search, Plus, Download, Upload, Bot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import EmptyState from "@/components/dashboard/EmptyState";
import { importAgentAction } from "@/app/_actions/agents";
import type { AgentListItem } from "@/lib/agent-data";

const templates = [
  { name: "Front Desk", description: "Greets callers, routes to the right department, and takes messages." },
  { name: "Lead Qualifier", description: "Qualifies inbound leads by asking discovery questions and booking demos." },
  { name: "Appointment Booking", description: "Helps callers schedule, reschedule, or cancel appointments." },
];

const statusLabel = (status: string) => {
  switch (status) {
    case "ACTIVE": return "Active";
    case "PAUSED": return "Paused";
    case "DRAFT": return "Draft";
    case "ARCHIVED": return "Archived";
    default: return status;
  }
};

const statusStyle = (status: string) => {
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

  return (
    <DashboardLayout>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <div className="p-5 sm:p-8 max-w-[1200px]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-[1.5rem] font-semibold tracking-[-0.025em] text-text-strong mb-1">Agents</h1>
            <p className="font-body text-[0.82rem] text-text-subtle">Create, configure, and manage your voice agents.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="ghost" size="sm" className="font-body text-text-subtle text-[0.78rem] gap-1.5">
              <Upload className="w-3.5 h-3.5" />Import
            </Button>
            <Button onClick={() => router.push("/agents/new")} variant="hero" size="default" className="rounded-lg gap-1.5 text-[0.8rem]">
              <Plus className="w-3.5 h-3.5" />Create agent
            </Button>
          </div>
        </div>

        {agents.length === 0 ? (
          <div className="bg-surface-panel rounded-card border border-border-soft">
            <EmptyState
              icon={Bot}
              title="No agents yet"
              description="Create your first voice agent to start handling calls. Use AI to generate a system prompt in seconds."
              actionLabel="Create your first agent"
              onAction={() => router.push("/agents/new")}
              secondaryLabel="Browse templates"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-subtle" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search agents..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-border-soft bg-surface-panel font-body text-[0.8rem] text-text-strong placeholder:text-text-subtle/50 focus:outline-none focus:ring-1 focus:ring-text-strong/10 transition-shadow"
                />
              </div>
              <div className="flex items-center gap-1.5">
                {["all", "ACTIVE", "PAUSED", "DRAFT"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`h-9 px-3 rounded-lg border font-body text-[0.78rem] transition-all ${
                      statusFilter === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border-soft bg-surface-panel text-text-subtle hover:text-text-body hover:border-foreground/15"
                    }`}
                  >
                    {s === "all" ? "All" : statusLabel(s)}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-surface-panel rounded-card border border-border-soft p-8 text-center mb-6">
                <p className="font-body text-[0.85rem] text-text-subtle">No agents match your search.</p>
              </div>
            ) : (
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-soft">
                      <th className="text-left px-5 py-2.5 font-body text-[0.65rem] font-medium text-text-subtle uppercase tracking-[0.1em]">Agent</th>
                      <th className="text-left px-5 py-2.5 font-body text-[0.65rem] font-medium text-text-subtle uppercase tracking-[0.1em]">Status</th>
                      <th className="text-left px-5 py-2.5 font-body text-[0.65rem] font-medium text-text-subtle uppercase tracking-[0.1em]">Number</th>
                      <th className="text-left px-5 py-2.5 font-body text-[0.65rem] font-medium text-text-subtle uppercase tracking-[0.1em]">Voice</th>
                      <th className="text-left px-5 py-2.5 font-body text-[0.65rem] font-medium text-text-subtle uppercase tracking-[0.1em]">Calls</th>
                      <th className="text-right px-5 py-2.5 font-body text-[0.65rem] font-medium text-text-subtle uppercase tracking-[0.1em]">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((agent) => (
                      <tr key={agent.id} onClick={() => router.push(`/agents/${agent.slug ?? agent.id}`)} className="border-b border-border-soft last:border-0 hover:bg-surface-subtle/40 transition-colors cursor-pointer group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "ACTIVE" ? "bg-emerald-400" : agent.status === "PAUSED" ? "bg-accent-warm" : "bg-text-subtle/20"}`} />
                            <span className="font-body text-[0.82rem] font-medium text-text-strong group-hover:text-text-strong/90">{agent.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[0.68rem] font-body font-medium ${statusStyle(agent.status)}`}>{statusLabel(agent.status)}</span>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-text-subtle">{agent.phoneNumber ?? "—"}</td>
                        <td className="px-5 py-3.5 font-body text-[0.78rem] text-text-body">{agent.voiceModel ?? "Default"}</td>
                        <td className="px-5 py-3.5 font-mono text-xs text-text-subtle">{agent.callCount}</td>
                        <td className="px-5 py-3.5 text-right font-body text-[0.75rem] text-text-subtle">{timeAgo(agent.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </>
        )}

        <div className="bg-surface-panel rounded-card border border-border-soft">
          <div className="px-5 py-4 border-b border-border-soft flex items-center justify-between">
            <h3 className="font-display text-sm font-medium text-text-strong">Templates</h3>
            <button onClick={() => router.push("/agents/new")} className="font-body text-[0.72rem] text-text-subtle hover:text-text-body transition-colors">Browse all &rarr;</button>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {templates.map((t) => (
              <div key={t.name} onClick={() => router.push("/agents/new")} className="p-4 rounded-lg border border-border-soft hover:bg-surface-subtle/40 hover:border-foreground/15 transition-all cursor-pointer">
                <div className="font-body text-[0.8rem] font-medium text-text-strong mb-1">{t.name}</div>
                <p className="font-body text-[0.72rem] text-text-subtle leading-relaxed">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
