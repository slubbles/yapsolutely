"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

type CallEvent = {
  id: string;
  role: string;
  sequence: number;
  text: string | null;
  createdAt: string;
};

type CallDetail = {
  id: string;
  callerNumber: string | null;
  toNumber: string | null;
  status: string;
  durationSeconds: number | null;
  summary: string | null;
  transcriptText: string | null;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  agentName: string | null;
  phoneNumber: string | null;
  events: CallEvent[];
};

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    QUEUED: "Queued",
    RINGING: "Ringing",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    FAILED: "Failed",
    BUSY: "Busy",
    NO_ANSWER: "No answer",
    CANCELED: "Canceled",
  };
  return map[status] ?? status;
}

const statusPill = (status: string) => {
  switch (status) {
    case "FAILED":
    case "NO_ANSWER":
    case "BUSY":
    case "CANCELED":
      return "text-text-subtle bg-surface-subtle";
    case "IN_PROGRESS":
    case "RINGING":
      return "text-emerald-600 bg-emerald-400/10";
    default:
      return "text-text-subtle/70 bg-surface-subtle";
  }
};

const speakerStyle = (role: string) => {
  switch (role) {
    case "AGENT":
      return { label: "Agent", labelClass: "text-text-strong", bgClass: "" };
    case "USER":
      return { label: "Caller", labelClass: "text-text-body", bgClass: "" };
    case "TOOL":
      return { label: "System", labelClass: "text-accent-warm-dim", bgClass: "bg-accent-warm/[0.04] border border-accent-warm/10 rounded-lg px-3 py-2.5" };
    case "SYSTEM":
      return { label: "System", labelClass: "text-text-subtle/60", bgClass: "bg-surface-subtle/60 rounded-lg px-3 py-2.5" };
    default:
      return { label: role, labelClass: "text-text-subtle", bgClass: "" };
  }
};

export default function CallDetailClient({ call }: { call: CallDetail }) {
  const toolEvents = call.events.filter((e) => e.role === "TOOL");

  const handleExport = () => {
    const lines: string[] = [
      `Call ${call.id}`,
      `Date: ${formatDate(call.createdAt)}`,
      `Status: ${statusLabel(call.status)}`,
      `Duration: ${formatDuration(call.durationSeconds)}`,
      `Caller: ${call.callerNumber ?? "Unknown"}`,
      `Agent: ${call.agentName ?? "—"}`,
      "",
      "--- Transcript ---",
      "",
    ];
    if (call.events.length > 0) {
      for (const e of call.events) {
        const style = speakerStyle(e.role);
        lines.push(`[${style.label}] ${e.text ?? ""}`);
      }
    } else if (call.transcriptText) {
      lines.push(call.transcriptText);
    } else {
      lines.push("No transcript available.");
    }
    if (call.summary) {
      lines.push("", "--- Summary ---", "", call.summary);
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `call-${call.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="mb-5">
          <Link
            href="/calls"
            className="inline-flex font-body text-[0.7rem] text-text-subtle hover:text-text-body transition-colors mb-3"
          >
            &larr; Calls
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-0.5">
                <h1 className="font-display text-[1.12rem] font-semibold tracking-[-0.02em] text-text-strong">
                  {call.callerNumber ?? "Unknown caller"}
                </h1>
                <span className={`inline-flex px-1.5 py-px rounded text-[0.64rem] font-body font-medium ${statusPill(call.status)}`}>
                  {statusLabel(call.status)}
                </span>
              </div>
              <p className="font-body text-[0.75rem] text-text-subtle">
                {call.agentName ? `Handled by ${call.agentName}` : "Call detail"} &middot; {formatDate(call.createdAt)}
              </p>
            </div>
            <Button onClick={handleExport} variant="ghost" size="sm" className="font-body text-text-subtle text-[0.72rem] gap-1 h-7 px-2">
              <Download className="w-3 h-3" />
              Export
            </Button>
          </div>
        </div>

        {/* ── Metrics strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Duration", value: formatDuration(call.durationSeconds) },
            { label: "Started", value: formatTime(call.startedAt ?? call.createdAt) },
            { label: "Ended", value: formatTime(call.endedAt) },
            { label: "Events", value: call.events.length.toString() },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
              <div className="font-body text-[0.58rem] text-text-subtle/70 uppercase tracking-[0.1em] mb-0.5">{stat.label}</div>
              <div className="font-mono text-[1rem] font-semibold text-text-strong">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* ── Two-column content ── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Transcript — primary */}
          <div className="xl:col-span-8">
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <h3 className="font-display text-[0.8rem] font-medium text-text-strong">Transcript</h3>
              </div>
              <div className="p-4 space-y-1">
                {call.events.length > 0 ? (
                  call.events.map((event) => {
                    const style = speakerStyle(event.role);
                    const isConversation = event.role === "AGENT" || event.role === "USER";
                    return (
                      <div key={event.id} className={`${style.bgClass} ${isConversation ? "py-2" : "my-1.5"}`}>
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-[0.58rem] text-text-subtle/30 w-6 shrink-0 pt-0.5 text-right tabular-nums">{event.sequence}</span>
                          <div className="flex-1 min-w-0">
                            <span className={`font-body text-[0.64rem] font-medium ${style.labelClass} mr-1.5`}>{style.label}</span>
                            <span className={`font-body text-[0.78rem] leading-[1.65] ${event.role === "TOOL" || event.role === "SYSTEM" ? "text-text-subtle" : "text-text-body"}`}>
                              {event.text ?? ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : call.transcriptText ? (
                  <p className="font-body text-[0.78rem] text-text-body leading-[1.7] whitespace-pre-wrap">{call.transcriptText}</p>
                ) : (
                  <p className="font-body text-[0.78rem] text-text-subtle py-4 text-center">No transcript available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidecar */}
          <div className="xl:col-span-4 space-y-4">
            {call.summary && (
              <div className="bg-surface-panel rounded-card border border-border-soft">
                <div className="px-4 py-3 border-b border-border-soft/60">
                  <h3 className="font-display text-[0.8rem] font-medium text-text-strong">Summary</h3>
                </div>
                <div className="p-4">
                  <p className="font-body text-[0.75rem] text-text-body leading-[1.7]">{call.summary}</p>
                </div>
              </div>
            )}

            {toolEvents.length > 0 && (
              <div className="bg-surface-panel rounded-card border border-border-soft">
                <div className="px-4 py-3 border-b border-border-soft/60">
                  <h3 className="font-display text-[0.8rem] font-medium text-text-strong">Tool actions</h3>
                </div>
                <div className="p-3 space-y-1.5">
                  {toolEvents.map((e) => (
                    <div key={e.id} className="p-2.5 rounded-lg bg-surface-subtle/50">
                      <p className="font-body text-[0.68rem] text-text-subtle leading-relaxed">{e.text}</p>
                      <span className="font-mono text-[0.56rem] text-text-subtle/30 mt-0.5 block">seq {e.sequence}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-surface-panel rounded-card border border-border-soft">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <h3 className="font-display text-[0.8rem] font-medium text-text-strong">Details</h3>
              </div>
              <div className="p-4 space-y-1">
                {[
                  { label: "Caller", value: call.callerNumber ?? "Unknown", mono: true },
                  { label: "Destination", value: call.toNumber ?? "—", mono: true },
                  { label: "Agent", value: call.agentName ?? "—" },
                  { label: "Number", value: call.phoneNumber ?? call.toNumber ?? "—", mono: true },
                  { label: "Status", value: statusLabel(call.status) },
                  { label: "Date", value: formatDate(call.createdAt) },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-1.5">
                    <span className="font-body text-[0.68rem] text-text-subtle">{item.label}</span>
                    <span className={`text-[0.68rem] text-text-body truncate max-w-[140px] text-right ${item.mono ? "font-mono" : "font-body"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
