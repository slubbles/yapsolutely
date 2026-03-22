"use client";

import Link from "next/link";
import { Bot, Phone, PhoneIncoming, Settings, ArrowRight, Zap } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

type RecentCall = {
  id: string;
  callerNumber: string | null;
  status: string;
  createdAt: string;
  durationSeconds: number | null;
  agentName: string | null;
  toolEvents: number;
};

type DailyCallVolume = {
  date: string;
  count: number;
};

type DashboardProps = {
  metrics: {
    activeAgents: number;
    assignedNumbers: number;
    callsToday: number;
    completedCalls: number;
    failedCalls: number;
    toolActionsToday: number;
    runtimeStatus: string;
    callVolume: DailyCallVolume[];
    recentCalls: RecentCall[];
  };
};

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const statusStyle = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "text-emerald-600 bg-emerald-400/10";
    case "FAILED":
    case "NO_ANSWER":
    case "BUSY":
      return "text-text-subtle bg-surface-subtle";
    case "IN_PROGRESS":
    case "RINGING":
      return "text-emerald-600 bg-emerald-400/10";
    default:
      return "text-text-subtle/70 bg-surface-subtle";
  }
};

const statusLabel = (s: string): string => {
  const map: Record<string, string> = {
    COMPLETED: "Completed",
    IN_PROGRESS: "In progress",
    FAILED: "Failed",
    NO_ANSWER: "No answer",
    RINGING: "Ringing",
    QUEUED: "Queued",
    BUSY: "Busy",
    CANCELED: "Canceled",
  };
  return map[s] ?? s;
};

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function CallVolumeChart({ data }: { data: DailyCallVolume[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      <div className="flex items-end gap-1.5 h-28">
        {data.map((day) => {
          const pct = (day.count / max) * 100;
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="font-mono text-[0.67rem] text-text-subtle/70">{day.count}</span>
              <div className="w-full flex items-end justify-center" style={{ height: "68px" }}>
                <div
                  className="w-full max-w-[32px] rounded-t bg-emerald-500/70 transition-all duration-300 hover:bg-emerald-500"
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
              </div>
              <span className="font-body text-[0.74rem] text-text-subtle/60">{formatDayLabel(day.date)}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-border-soft/40 flex items-center gap-4">
        <span className="font-body text-[0.79rem] text-text-subtle">Total: <span className="font-mono text-text-body">{total}</span></span>
        <span className="font-body text-[0.79rem] text-text-subtle">Avg: <span className="font-mono text-text-body">{data.length > 0 ? (total / data.length).toFixed(1) : 0}</span>/day</span>
      </div>
    </div>
  );
}

export default function DashboardHome({ metrics }: DashboardProps) {
  const cards = [
    { label: "Active agents", value: metrics.activeAgents, icon: Bot, href: "/agents", sub: "Deployed" },
    { label: "Assigned numbers", value: metrics.assignedNumbers, icon: Phone, href: "/numbers", sub: "Mapped" },
    { label: "Calls today", value: metrics.callsToday, icon: PhoneIncoming, href: "/calls", sub: "Inbound" },
    { label: "Tool actions", value: metrics.toolActionsToday, icon: Zap, href: "/calls", sub: "Today" },
  ];

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="mb-5">
          <h1 className="font-display text-[1.38rem] font-semibold tracking-[-0.02em] text-text-strong">Dashboard</h1>
          <p className="font-body text-[0.89rem] text-text-subtle mt-0.5">Overview of your workspace activity.</p>
        </div>

        {/* ── Metrics strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {cards.map((card) => (
            <Link key={card.label} href={card.href} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3 card-lift hover:bg-surface-subtle/40 group focus-ring">
              <div className="font-body text-[0.67rem] text-text-subtle/70 uppercase tracking-[0.1em] mb-0.5">{card.label}</div>
              <div className="font-mono text-[1rem] font-semibold text-text-strong">{card.value}</div>
              <div className="font-body text-[0.67rem] text-text-subtle/50 mt-0.5">{card.sub}</div>
            </Link>
          ))}
        </div>

        {/* ── Call volume chart ── */}
        {metrics.callVolume.length > 0 && (
          <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden mb-5">
            <div className="px-4 py-3 border-b border-border-soft/60 flex items-center justify-between">
              <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Call Volume</h3>
              <span className="font-body text-[0.79rem] text-text-subtle/60">Last 7 days</span>
            </div>
            <div className="px-4 py-3">
              <CallVolumeChart data={metrics.callVolume} />
            </div>
          </div>
        )}

        {/* ── Split: recent calls + sidebar ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60 flex items-center justify-between">
                <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Recent Calls</h3>
                <Link href="/calls" className="font-body text-[0.79rem] text-text-subtle hover:text-text-body transition-colors">
                  View all &rarr;
                </Link>
              </div>
              {metrics.recentCalls.length === 0 ? (
                <div className="p-6 text-center">
                  <PhoneIncoming className="w-6 h-6 text-text-subtle/20 mx-auto mb-2" />
                  <p className="font-body text-[0.87rem] text-text-subtle mb-0.5">No calls yet</p>
                  <p className="font-body text-[0.79rem] text-text-subtle/60">Calls will appear here once your agents start handling conversations.</p>
                </div>
              ) : (
                <div className="divide-y divide-border-soft/30">
                  {metrics.recentCalls.map((call) => (
                    <Link key={call.id} href={`/calls/${call.id}`} className="px-4 py-2.5 hover:bg-surface-subtle/40 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3 h-3 text-text-subtle/30" />
                        <div>
                          <div className="font-body text-[0.87rem] text-text-body">{call.callerNumber ?? "Unknown"}</div>
                          <div className="font-body text-[0.79rem] text-text-subtle/60">{call.agentName ?? "—"} · {formatTime(call.createdAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[0.82rem] text-text-subtle">{formatDuration(call.durationSeconds)}</span>
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[0.67rem] font-body font-medium ${statusStyle(call.status)}`}>{statusLabel(call.status)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Call Summary</h3>
              </div>
              <div className="px-4 py-2 space-y-0.5">
                {[
                  { label: "Completed", value: metrics.completedCalls },
                  { label: "Failed", value: metrics.failedCalls },
                  { label: "Today", value: metrics.callsToday },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <span className="font-body text-[0.89rem] text-text-body">{item.label}</span>
                    <span className="font-mono text-[0.89rem] text-text-subtle">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Quick Actions</h3>
              </div>
              <div className="px-2 py-2 space-y-0.5">
                {[
                  { label: "Create new agent", href: "/agents/new", icon: Bot },
                  { label: "View phone numbers", href: "/numbers", icon: Phone },
                  { label: "Check settings", href: "/settings", icon: Settings },
                ].map((action) => (
                  <Link key={action.label} href={action.href} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-subtle/60 transition-colors focus-ring">
                    <action.icon className="w-3 h-3 text-text-subtle" />
                    <span className="font-body text-[0.89rem] text-text-body">{action.label}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-text-subtle/30 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Runtime status */}
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${metrics.runtimeStatus === "Online" ? "bg-emerald-400 animate-pulse-dot" : "bg-text-subtle/30"}`} />
                <span className="font-body text-[0.89rem] font-medium text-text-strong">Runtime</span>
                <span className="font-body text-[0.79rem] text-text-subtle ml-auto">{metrics.runtimeStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
