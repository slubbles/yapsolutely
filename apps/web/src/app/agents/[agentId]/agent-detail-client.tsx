"use client";

import { ArrowLeft, Pencil, Pause, Play, Copy, Phone, ExternalLink, MessageSquare, Workflow, Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toggleAgentStatusAction, duplicateAgentAction } from "@/app/_actions/agents";

type AgentCall = {
  id: string;
  callerNumber: string | null;
  status: string;
  durationSeconds: number | null;
  createdAt: string;
};

type AgentPhone = {
  id: string;
  phoneNumber: string;
  friendlyName: string | null;
};

type AgentDetail = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  systemPrompt: string;
  firstMessage: string | null;
  voiceModel: string | null;
  status: string;
  isActive: boolean;
  transferNumber: string | null;
  createdAt: string;
  updatedAt: string;
  phoneNumbers: AgentPhone[];
  calls: AgentCall[];
  totalCalls: number;
  completedCalls: number;
};

const statusLabel = (s: string) => {
  switch (s) {
    case "ACTIVE": return "Active";
    case "PAUSED": return "Paused";
    case "DRAFT": return "Draft";
    case "ARCHIVED": return "Archived";
    default: return s;
  }
};

const statusStyle = (s: string) => {
  switch (s) {
    case "ACTIVE": return "bg-emerald-400/10 text-emerald-600";
    case "PAUSED": return "bg-accent-warm/10 text-accent-warm-dim";
    default: return "bg-surface-subtle text-text-subtle";
  }
};

const callStatusLabel = (s: string) => {
  switch (s) {
    case "COMPLETED": return "Completed";
    case "IN_PROGRESS": return "In progress";
    case "FAILED": return "Failed";
    case "NO_ANSWER": return "No answer";
    default: return s.toLowerCase().replace(/_/g, " ");
  }
};

const callStatusStyle = (s: string) => {
  switch (s) {
    case "FAILED": case "NO_ANSWER": return "text-text-subtle";
    case "IN_PROGRESS": return "text-emerald-600";
    default: return "text-text-subtle/70";
  }
};

function formatDuration(seconds: number | null) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(dateStr: string) {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function AgentDetailClient({ agent }: { agent: AgentDetail }) {
  const router = useRouter();
  const slug = agent.slug ?? agent.id;
  const primaryNumber = agent.phoneNumbers[0]?.phoneNumber ?? "—";

  const handleExport = () => {
    const exportData = {
      name: agent.name,
      description: agent.description,
      systemPrompt: agent.systemPrompt,
      firstMessage: agent.firstMessage,
      voiceModel: agent.voiceModel,
      transferNumber: agent.transferNumber,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agent.slug ?? agent.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-8 max-w-[1200px]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <Link href="/agents" className="inline-flex items-center gap-1.5 font-body text-[0.75rem] text-text-subtle hover:text-text-body transition-colors mb-4">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to agents
            </Link>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="font-display text-[1.35rem] sm:text-[1.65rem] font-semibold tracking-[-0.03em] text-text-strong">
                {agent.name}
              </h1>
              <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[0.7rem] font-body font-medium ${statusStyle(agent.status)}`}>
                {statusLabel(agent.status)}
              </span>
            </div>
            <p className="font-body text-[0.82rem] sm:text-[0.85rem] text-text-subtle leading-relaxed max-w-xl">
              {agent.description ?? "No description set."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={handleExport} variant="ghost" size="sm" className="font-body text-text-subtle text-[0.78rem] gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <form action={duplicateAgentAction}>
              <input type="hidden" name="agentId" value={agent.id} />
              <Button type="submit" variant="ghost" size="sm" className="font-body text-text-subtle text-[0.78rem] gap-1.5">
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Duplicate</span>
              </Button>
            </form>
            <form action={toggleAgentStatusAction}>
              <input type="hidden" name="agentId" value={agent.id} />
              <input type="hidden" name="newStatus" value={agent.status === "ACTIVE" ? "PAUSED" : "ACTIVE"} />
              <Button type="submit" variant="outline" size="sm" className="font-body text-[0.78rem] gap-1.5 rounded-lg border-border-soft">
                {agent.status === "ACTIVE" ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Activate</span>
                  </>
                )}
              </Button>
            </form>
            <Button onClick={() => router.push(`/agents/${slug}/flow`)} variant="outline" size="default" className="rounded-lg gap-1.5 text-[0.8rem] border-border-soft">
              <Workflow className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flow builder</span>
            </Button>
            <Button onClick={() => router.push(`/agents/${slug}/test`)} variant="outline" size="default" className="rounded-lg gap-1.5 text-[0.8rem] border-border-soft">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test agent</span>
            </Button>
            <Button onClick={() => router.push(`/agents/${slug}/edit`)} variant="hero" size="default" className="rounded-lg gap-1.5 text-[0.8rem]">
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit prompt</span>
            </Button>
          </div>
        </div>

        {/* Performance strip */}
        <div className="bg-surface-panel rounded-card border border-border-soft p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Calls handled", value: agent.totalCalls.toString() },
              { label: "Avg. duration", value: agent.calls.length > 0 ? formatDuration(Math.round(agent.calls.reduce((sum, c) => sum + (c.durationSeconds ?? 0), 0) / agent.calls.length)) : "—" },
              { label: "Completed", value: agent.completedCalls.toString() },
              { label: "Numbers assigned", value: agent.phoneNumbers.length.toString() },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-body text-[0.6rem] text-text-subtle uppercase tracking-[0.12em] mb-1">{stat.label}</div>
                <div className="text-[1.05rem] sm:text-[1.1rem] font-semibold text-text-strong font-mono">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            {/* Prompt */}
            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 sm:px-5 py-4 border-b border-border-soft flex items-center justify-between">
                <h3 className="font-display text-sm font-medium text-text-strong">Prompt</h3>
                <button className="font-body text-[0.72rem] text-text-subtle hover:text-text-body transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  View full
                </button>
              </div>
              <div className="p-4 sm:p-5">
                <p className="font-body text-[0.82rem] text-text-body leading-[1.75] whitespace-pre-wrap">{agent.systemPrompt}</p>
              </div>
            </div>

            {/* Voice and behavior */}
            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 sm:px-5 py-4 border-b border-border-soft">
                <h3 className="font-display text-sm font-medium text-text-strong">Voice &amp; behavior</h3>
              </div>
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    { label: "Voice model", value: agent.voiceModel ?? "Default" },
                    { label: "First message", value: agent.firstMessage ?? "Not set" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="font-body text-[0.65rem] text-text-subtle uppercase tracking-[0.1em] mb-1">{item.label}</div>
                      <div className="font-body text-[0.82rem] text-text-body">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Routing */}
            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 sm:px-5 py-4 border-b border-border-soft">
                <h3 className="font-display text-sm font-medium text-text-strong">Routing</h3>
              </div>
              <div className="p-4 sm:p-5 space-y-3">
                {[
                  { label: "Assigned number", value: primaryNumber, mono: true },
                  { label: "Transfer number", value: agent.transferNumber ?? "Not set", mono: true },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col sm:flex-row sm:items-start sm:justify-between py-1 gap-1">
                    <span className="font-body text-[0.75rem] text-text-subtle sm:w-32 shrink-0">{item.label}</span>
                    <span className={`font-body text-[0.82rem] text-text-body sm:text-right ${item.mono ? "font-mono text-[0.78rem]" : ""}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 sm:px-5 py-4 border-b border-border-soft">
                <h3 className="font-display text-sm font-medium text-text-strong">Details</h3>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { label: "Agent ID", value: agent.id, mono: true },
                  { label: "Status", value: statusLabel(agent.status), mono: false },
                  { label: "Voice", value: agent.voiceModel ?? "Default", mono: false },
                  { label: "Number", value: primaryNumber, mono: true },
                  { label: "Created", value: formatDate(agent.createdAt), mono: false },
                  { label: "Last updated", value: timeAgo(agent.updatedAt), mono: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 px-1">
                    <span className="font-body text-[0.72rem] text-text-subtle">{item.label}</span>
                    <span className={`text-[0.72rem] text-text-body ${item.mono ? "font-mono" : "font-body"}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 sm:px-5 py-4 border-b border-border-soft flex items-center justify-between">
                <h3 className="font-display text-sm font-medium text-text-strong">Recent calls</h3>
                <Link href="/calls" className="font-body text-[0.72rem] text-text-subtle hover:text-text-body transition-colors">
                  View all &rarr;
                </Link>
              </div>
              {agent.calls.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="font-body text-[0.78rem] text-text-subtle">No calls yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-border-soft">
                  {agent.calls.map((call) => (
                    <Link key={call.id} href={`/calls/${call.id}`} className="px-4 sm:px-5 py-3 hover:bg-surface-subtle/40 transition-colors cursor-pointer flex items-center justify-between block">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3 h-3 text-text-subtle/30" />
                        <div>
                          <div className="font-mono text-[0.72rem] text-text-body">{call.callerNumber ?? "Unknown"}</div>
                          <div className="font-body text-[0.65rem] text-text-subtle">{formatTime(call.createdAt)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[0.68rem] text-text-subtle">{formatDuration(call.durationSeconds)}</div>
                        <div className={`font-body text-[0.65rem] font-medium ${callStatusStyle(call.status)}`}>{callStatusLabel(call.status)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
