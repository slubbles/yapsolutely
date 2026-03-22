"use client";

import { Pause, Play, Copy, Phone, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AgentWorkspaceTabs from "@/components/dashboard/AgentWorkspaceTabs";
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

const statusPill = (s: string) => {
  switch (s) {
    case "ACTIVE": return "bg-emerald-400/10 text-emerald-600";
    case "PAUSED": return "bg-accent-warm/10 text-accent-warm-dim";
    default: return "bg-surface-subtle text-text-subtle";
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
  const slug = agent.slug ?? agent.id;
  const primaryNumber = agent.phoneNumbers[0]?.phoneNumber ?? "—";
  const avgDuration =
    agent.calls.length > 0
      ? formatDuration(Math.round(agent.calls.reduce((sum, c) => sum + (c.durationSeconds ?? 0), 0) / agent.calls.length))
      : "—";

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
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Workspace header ── */}
        <div className="mb-5">
          <Link
            href="/agents"
            className="inline-flex font-body text-[0.79rem] text-text-subtle hover:text-text-body transition-colors mb-3"
          >
            &larr; Agents
          </Link>

          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="font-display text-[1.38rem] font-semibold tracking-[-0.02em] text-text-strong truncate">
                  {agent.name}
                </h1>
                <span className={`inline-flex px-1.5 py-px rounded text-[0.8rem] font-body font-medium shrink-0 ${statusPill(agent.status)}`}>
                  {statusLabel(agent.status)}
                </span>
              </div>
              {agent.description && (
                <p className="font-body text-[0.87rem] text-text-subtle leading-relaxed max-w-lg truncate">
                  {agent.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button onClick={handleExport} variant="ghost" size="sm" className="font-body text-text-subtle text-[0.89rem] gap-1 h-7 px-2">
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <form action={duplicateAgentAction}>
                <input type="hidden" name="agentId" value={agent.id} />
                <Button type="submit" variant="ghost" size="sm" className="font-body text-text-subtle text-[0.89rem] gap-1 h-7 px-2">
                  <Copy className="w-3 h-3" />
                  <span className="hidden sm:inline">Duplicate</span>
                </Button>
              </form>
              <form action={toggleAgentStatusAction}>
                <input type="hidden" name="agentId" value={agent.id} />
                <input type="hidden" name="newStatus" value={agent.status === "ACTIVE" ? "PAUSED" : "ACTIVE"} />
                <Button type="submit" variant="outline" size="sm" className="font-body text-[0.89rem] gap-1 h-7 px-2.5 rounded-md border-border-soft">
                  {agent.status === "ACTIVE" ? (
                    <><Pause className="w-3 h-3" />Pause</>
                  ) : (
                    <><Play className="w-3 h-3" />Activate</>
                  )}
                </Button>
              </form>
            </div>
          </div>

          <AgentWorkspaceTabs slug={slug} />
        </div>

        {/* ── Metrics strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Calls handled", value: agent.totalCalls.toString() },
            { label: "Avg. duration", value: avgDuration },
            { label: "Completed", value: agent.completedCalls.toString() },
            { label: "Numbers", value: agent.phoneNumbers.length.toString() },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
              <div className="font-body text-[0.67rem] text-text-subtle/70 uppercase tracking-[0.1em] mb-0.5">{stat.label}</div>
              <div className="font-mono text-[1rem] font-semibold text-text-strong">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ── Two-column content ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Left — primary */}
          <div className="xl:col-span-8 space-y-4">
            {/* Prompt preview */}
            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 py-3 border-b border-border-soft/60 flex items-center justify-between">
                <h3 className="font-display text-[0.89rem] font-medium text-text-strong">System prompt</h3>
                <Link
                  href={`/agents/${slug}/edit`}
                  className="font-body text-[0.77rem] text-text-subtle hover:text-text-body transition-colors"
                >
                  Edit &rarr;
                </Link>
              </div>
              <div className="p-4">
                <p className="font-body text-[0.87rem] text-text-body leading-[1.7] whitespace-pre-wrap line-clamp-6">
                  {agent.systemPrompt}
                </p>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Configuration</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  {[
                    { label: "Voice model", value: agent.voiceModel ?? "Default" },
                    { label: "First message", value: agent.firstMessage ?? "Not set" },
                    { label: "Assigned number", value: primaryNumber, mono: true },
                    { label: "Transfer number", value: agent.transferNumber ?? "Not set", mono: true },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="font-body text-[0.77rem] text-text-subtle/70 uppercase tracking-[0.08em] mb-0.5">{item.label}</div>
                      <div className={`font-body text-[0.87rem] text-text-body ${item.mono ? "font-mono text-[0.92rem]" : ""}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent calls */}
            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 py-3 border-b border-border-soft/60 flex items-center justify-between">
                <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Recent calls</h3>
                <Link href="/calls" className="font-body text-[0.77rem] text-text-subtle hover:text-text-body transition-colors">
                  View all &rarr;
                </Link>
              </div>
              {agent.calls.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="font-body text-[0.87rem] text-text-subtle">No calls yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-border-soft/50">
                  {agent.calls.map((call) => (
                    <Link
                      key={call.id}
                      href={`/calls/${call.id}`}
                      className="px-4 py-2.5 hover:bg-surface-subtle/30 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-text-subtle/25" />
                        <div>
                          <div className="font-mono text-[0.79rem] text-text-body">{call.callerNumber ?? "Unknown"}</div>
                          <div className="font-body text-[0.79rem] text-text-subtle">{formatTime(call.createdAt)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[0.84rem] text-text-subtle">{formatDuration(call.durationSeconds)}</div>
                        <div className={`font-body text-[0.77rem] font-medium ${callStatusStyle(call.status)}`}>
                          {call.status === "COMPLETED" ? "Completed" : call.status === "IN_PROGRESS" ? "In progress" : call.status.toLowerCase().replace(/_/g, " ")}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — sidecar */}
          <div className="xl:col-span-4 space-y-4">
            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Details</h3>
              </div>
              <div className="p-4 space-y-1">
                {[
                  { label: "Agent ID", value: agent.id, mono: true },
                  { label: "Status", value: statusLabel(agent.status) },
                  { label: "Voice", value: agent.voiceModel ?? "Default" },
                  { label: "Number", value: primaryNumber, mono: true },
                  { label: "Created", value: formatDate(agent.createdAt) },
                  { label: "Updated", value: timeAgo(agent.updatedAt) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <span className="font-body text-[0.77rem] text-text-subtle">{item.label}</span>
                    <span className={`text-[0.77rem] text-text-body truncate max-w-[160px] text-right ${item.mono ? "font-mono" : "font-body"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Quick actions</h3>
              </div>
              <div className="p-3 space-y-1">
                {[
                  { label: "Edit prompt", href: `/agents/${slug}/edit` },
                  { label: "Flow builder", href: `/agents/${slug}/flow` },
                  { label: "Test agent", href: `/agents/${slug}/test` },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between px-3 py-2 rounded-lg font-body text-[0.84rem] text-text-body hover:bg-surface-subtle/40 transition-colors"
                  >
                    {action.label}
                    <span className="text-text-subtle/40">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Numbers */}
            {agent.phoneNumbers.length > 0 && (
              <div className="bg-surface-panel rounded-card border border-border-soft">
                <div className="px-4 py-3 border-b border-border-soft/60">
                  <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Assigned numbers</h3>
                </div>
                <div className="p-3 space-y-1">
                  {agent.phoneNumbers.map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-3 py-1.5">
                      <span className="font-mono text-[0.79rem] text-text-body">{p.phoneNumber}</span>
                      {p.friendlyName && (
                        <span className="font-body text-[0.8rem] text-text-subtle">{p.friendlyName}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
