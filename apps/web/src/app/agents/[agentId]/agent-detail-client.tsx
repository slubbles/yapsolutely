"use client";

import { useState } from "react";
import { Pause, Play, Copy, Phone, Download, Plus, Unplug, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AgentWorkspaceTabs from "@/components/dashboard/AgentWorkspaceTabs";
import { toggleAgentStatusAction, duplicateAgentAction } from "@/app/_actions/agents";
import { connectNumberToAgentAction, disconnectNumberFromAgentAction } from "@/app/_actions/phone-numbers";

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

// ─── Phone Number Section ──────────────────────────

function PhoneNumberSection({ agentId, slug, phoneNumbers }: { agentId: string; slug: string; phoneNumbers: AgentPhone[] }) {
  const [showForm, setShowForm] = useState(false);
  const hasNumbers = phoneNumbers.length > 0;

  return (
    <div className={`bg-surface-panel rounded-card border ${hasNumbers ? "border-border-soft" : "border-dashed border-border-soft/80"}`}>
      <div className="px-4 py-3 border-b border-border-soft/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-3.5 h-3.5 text-text-subtle" />
          <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Phone number</h3>
        </div>
        {hasNumbers && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="font-body text-[0.77rem] text-text-subtle hover:text-text-body transition-colors"
          >
            + Add another
          </button>
        )}
      </div>

      {hasNumbers ? (
        <div className="divide-y divide-border-soft/40">
          {phoneNumbers.map((p) => (
            <div key={p.id} className="px-4 py-2.5 flex items-center justify-between">
              <div>
                <div className="font-mono text-[0.87rem] text-text-body">{p.phoneNumber}</div>
                {p.friendlyName && (
                  <div className="font-body text-[0.77rem] text-text-subtle">{p.friendlyName}</div>
                )}
              </div>
              <form action={disconnectNumberFromAgentAction}>
                <input type="hidden" name="phoneNumberId" value={p.id} />
                <input type="hidden" name="agentSlug" value={slug} />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="submit" className="p-1.5 rounded-md hover:bg-surface-subtle transition-colors">
                      <Unplug className="w-3.5 h-3.5 text-text-subtle" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="font-body text-[0.77rem]">Disconnect number</TooltipContent>
                </Tooltip>
              </form>
            </div>
          ))}
        </div>
      ) : !showForm ? (
        <div className="p-5 text-center">
          <div className="w-10 h-10 rounded-full bg-surface-subtle flex items-center justify-center mx-auto mb-3">
            <Phone className="w-4 h-4 text-text-subtle" />
          </div>
          <p className="font-body text-[0.87rem] text-text-body mb-1">No phone number connected</p>
          <p className="font-body text-[0.77rem] text-text-subtle mb-3">Connect a Twilio phone number to start receiving inbound calls.</p>
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-lg font-body text-[0.84rem] h-7 px-3 border-border-soft"
          >
            <Plus className="w-3 h-3" />
            Connect number
          </Button>
        </div>
      ) : null}

      {showForm && (
        <form action={connectNumberToAgentAction} className="p-4 border-t border-border-soft/40">
          <input type="hidden" name="agentId" value={agentId} />
          <input type="hidden" name="agentSlug" value={slug} />
          <div className="space-y-3">
            <div>
              <Label htmlFor="cn-phone" className="font-body text-[0.84rem] text-text-body mb-1 block">Phone number</Label>
              <Input id="cn-phone" name="phoneNumber" placeholder="+1 (555) 123-4567" required className="font-mono text-[0.87rem] h-8" />
              <p className="font-body text-[0.72rem] text-text-subtle mt-0.5">Your Twilio phone number with country code</p>
            </div>
            <div>
              <Label htmlFor="cn-name" className="font-body text-[0.84rem] text-text-body mb-1 block">
                Friendly name <span className="text-text-subtle">(optional)</span>
              </Label>
              <Input id="cn-name" name="friendlyName" placeholder="e.g. Main Office Line" className="text-[0.87rem] h-8" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border-soft/40">
            <Button type="button" variant="ghost" size="sm" className="text-[0.84rem] h-7" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" variant="hero" size="sm" className="rounded-lg text-[0.84rem] h-7 px-3">Connect</Button>
          </div>
        </form>
      )}
    </div>
  );
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
              <Tooltip>
                <TooltipTrigger asChild>
              <Button onClick={handleExport} variant="ghost" size="sm" className="font-body text-text-subtle text-[0.89rem] gap-1 h-7 px-2">
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Export</span>
              </Button>
                </TooltipTrigger>
                <TooltipContent className="font-body text-[0.77rem]">Export agent config as JSON</TooltipContent>
              </Tooltip>
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
            { label: "Calls handled", value: agent.totalCalls.toString(), tip: "Total inbound calls routed to this agent" },
            { label: "Avg. duration", value: avgDuration, tip: "Average call length across completed calls" },
            { label: "Completed", value: agent.completedCalls.toString(), tip: "Calls that ended normally" },
            { label: "Numbers", value: agent.phoneNumbers.length.toString(), tip: "Phone numbers assigned to this agent" },
          ].map((stat, i) => (
            <Tooltip key={stat.label}>
              <TooltipTrigger asChild>
            <div className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3 stagger-item" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="font-body text-[0.67rem] text-text-subtle/70 uppercase tracking-[0.1em] mb-0.5">{stat.label}</div>
              <div className="font-mono text-[1rem] font-semibold text-text-strong">{stat.value}</div>
            </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-body text-[0.77rem]">{stat.tip}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* ── Two-column content ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Left — primary */}
          <div className="xl:col-span-8 space-y-4">
            {/* Prompt preview */}
            <div className="bg-surface-panel rounded-card border border-border-soft transition-all duration-200 hover:border-border-soft/80 hover:shadow-surface-sm">
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
            <div className="bg-surface-panel rounded-card border border-border-soft transition-all duration-200 hover:border-border-soft/80 hover:shadow-surface-sm">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Configuration</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
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
            <div className="bg-surface-panel rounded-card border border-border-soft transition-all duration-200 hover:border-border-soft/80 hover:shadow-surface-sm">
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

            {/* Phone number — interactive */}
            <PhoneNumberSection agentId={agent.id} slug={slug} phoneNumbers={agent.phoneNumbers} />

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
                  { label: "Manage all numbers", href: "/numbers" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center justify-between px-3 py-2 rounded-lg font-body text-[0.84rem] text-text-body hover:bg-surface-subtle/40 transition-all duration-150 hover:translate-x-0.5"
                  >
                    {action.label}
                    <span className="text-text-subtle/40">&rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
