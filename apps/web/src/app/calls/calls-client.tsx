"use client";

import { useState, useMemo, Suspense } from "react";
import { Search, Phone, PhoneIncoming, Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EmptyState from "@/components/dashboard/EmptyState";

type CallItem = {
  id: string;
  externalCallId: string | null;
  callerNumber: string | null;
  toNumber: string | null;
  status: string;
  durationSeconds: number | null;
  createdAt: string;
  agentName: string | null;
  transcriptPreview: string | null;
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
    case "COMPLETED":
      return "text-text-subtle/70 bg-surface-subtle";
    default:
      return "text-text-subtle/70 bg-surface-subtle";
  }
};

function CallsInner({ calls }: { calls: CallItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const counts = useMemo(() => {
    const all = calls.length;
    const completed = calls.filter((c) => c.status === "COMPLETED").length;
    const inProgress = calls.filter((c) => c.status === "IN_PROGRESS" || c.status === "RINGING").length;
    const failed = calls.filter((c) => c.status === "FAILED" || c.status === "NO_ANSWER" || c.status === "BUSY" || c.status === "CANCELED").length;
    return { all, completed, inProgress, failed };
  }, [calls]);

  const filtered = useMemo(() => {
    let result = query.trim()
      ? calls.filter(
          (c) =>
            c.callerNumber?.includes(query) ||
            c.agentName?.toLowerCase().includes(query.toLowerCase()) ||
            c.id.includes(query),
        )
      : calls;
    if (statusFilter !== "all") {
      if (statusFilter === "FAILED") {
        result = result.filter((c) => ["FAILED", "NO_ANSWER", "BUSY", "CANCELED"].includes(c.status));
      } else if (statusFilter === "IN_PROGRESS") {
        result = result.filter((c) => ["IN_PROGRESS", "RINGING"].includes(c.status));
      } else {
        result = result.filter((c) => c.status === statusFilter);
      }
    }
    return result;
  }, [calls, query, statusFilter]);

  const handleExportCsv = () => {
    const headers = ["ID", "Caller", "To", "Agent", "Status", "Duration (s)", "Date", "Transcript Preview"];
    const rows = filtered.map((c) => [
      c.id,
      c.callerNumber ?? "",
      c.toNumber ?? "",
      c.agentName ?? "",
      c.status,
      c.durationSeconds?.toString() ?? "",
      c.createdAt,
      (c.transcriptPreview ?? "").replace(/"/g, '""'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yapsolutely-calls-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterTabs: { key: string; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "COMPLETED", label: "Completed", count: counts.completed },
    { key: "IN_PROGRESS", label: "Active", count: counts.inProgress },
    { key: "FAILED", label: "Failed", count: counts.failed },
  ];

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-3">
            <h1 className="font-display text-[1.38rem] font-semibold tracking-[-0.02em] text-text-strong">
              Calls
            </h1>
            <span className="font-body text-[0.89rem] text-text-subtle tabular-nums">
              {counts.all} total
            </span>
          </div>
          {calls.length > 0 && (
            <Button
              onClick={handleExportCsv}
              variant="ghost"
              size="sm"
              className="font-body text-text-subtle text-[0.84rem] gap-1.5 h-8"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          )}
        </div>

        {calls.length === 0 ? (
          <div className="bg-surface-panel rounded-card border border-border-soft">
            <EmptyState
              icon={PhoneIncoming}
              title="No calls yet"
              description="Calls will appear here once your agents are live and handling conversations."
              actionLabel="Go to Agents"
              onAction={() => router.push("/agents")}
            />
          </div>
        ) : (
          <>
            {/* ── Stats strip ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Total calls", value: counts.all.toString() },
                { label: "Completed", value: counts.completed.toString() },
                { label: "Active", value: counts.inProgress.toString() },
                { label: "Failed", value: counts.failed.toString() },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
                  <div className="font-body text-[0.67rem] text-text-subtle/70 uppercase tracking-[0.1em] mb-0.5">{stat.label}</div>
                  <div className="font-mono text-[1rem] font-semibold text-text-strong">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* ── Control row ── */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-1">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`h-7 px-2.5 rounded-md font-body text-[0.89rem] transition-all flex items-center gap-1.5 focus-ring ${
                      statusFilter === tab.key
                        ? "bg-foreground text-primary-foreground font-medium"
                        : "text-text-subtle hover:text-text-body hover:bg-surface-subtle"
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[0.79rem] tabular-nums ${
                      statusFilter === tab.key ? "text-primary-foreground/60" : "text-text-subtle/50"
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
                  placeholder="Search calls..."
                  className="w-full h-7 pl-8 pr-3 rounded-md border border-border-soft/60 bg-transparent font-body text-[0.84rem] text-text-strong placeholder:text-text-subtle/40 focus:outline-none focus:border-foreground/20 transition-colors"
                />
              </div>
            </div>

            {/* ── Table ── */}
            {filtered.length === 0 ? (
              <div className="bg-surface-panel rounded-card border border-border-soft p-8 text-center">
                <p className="font-body text-[1.02rem] text-text-subtle">No calls match your filters.</p>
              </div>
            ) : (
              <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-soft/80">
                        <th className="text-left pl-4 pr-3 py-2 font-body text-[0.79rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Caller</th>
                        <th className="text-left px-3 py-2 font-body text-[0.79rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Agent</th>
                        <th className="text-left px-3 py-2 font-body text-[0.79rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Status</th>
                        <th className="text-right px-3 py-2 font-body text-[0.79rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Duration</th>
                        <th className="text-right pl-3 pr-4 py-2 font-body text-[0.79rem] font-medium text-text-subtle/70 uppercase tracking-[0.08em]">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((call) => (
                        <tr
                          key={call.id}
                          onClick={() => router.push(`/calls/${call.id}`)}
                          className="border-b border-border-soft/50 last:border-0 hover:bg-surface-subtle/30 transition-colors cursor-pointer group focus-ring"
                        >
                          <td className="pl-4 pr-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-text-subtle/30 shrink-0" />
                              <span className="font-body text-[0.87rem] text-text-body">{call.callerNumber ?? "Unknown"}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 font-body text-[0.84rem] text-text-body">{call.agentName ?? "—"}</td>
                          <td className="px-3 py-2.5">
                            <span className={`inline-flex px-1.5 py-px rounded text-[0.8rem] font-body font-medium ${statusPill(call.status)}`}>
                              {statusLabel(call.status)}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-[0.79rem] text-text-subtle tabular-nums">
                            {formatDuration(call.durationSeconds)}
                          </td>
                          <td className="pl-3 pr-4 py-2.5 text-right font-body text-[0.77rem] text-text-subtle/70">
                            {formatTime(call.createdAt)}
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

export default function CallsClient({ calls }: { calls: CallItem[] }) {
  return (
    <Suspense>
      <CallsInner calls={calls} />
    </Suspense>
  );
}
