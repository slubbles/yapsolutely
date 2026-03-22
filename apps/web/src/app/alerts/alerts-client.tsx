"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Bell, CheckCircle2 } from "lucide-react";

const metrics = [
  { label: "Active", value: "0", sub: "Unresolved" },
  { label: "Critical", value: "0", sub: "Immediate" },
  { label: "Warning", value: "0", sub: "Needs attention" },
  { label: "Resolved", value: "—", sub: "Last 30d" },
];

const emptyRows = Array.from({ length: 4 }, (_, i) => i);

export default function AlertsClient() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-[1.12rem] font-semibold tracking-[-0.02em] text-text-strong">Alerts</h1>
            <p className="font-body text-[0.72rem] text-text-subtle mt-0.5">Warnings, failures, and operational notices.</p>
          </div>
          <div className="flex items-center gap-1.5">
            {["All", "Active", "Resolved"].map((tab, i) => (
              <button
                key={tab}
                className={`font-body text-[0.64rem] px-2 py-0.5 rounded ${i === 0 ? "bg-foreground text-background" : "text-text-subtle hover:text-text-body"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Metrics strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {metrics.map((m) => (
            <div key={m.label} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
              <div className="font-body text-[0.58rem] text-text-subtle/70 uppercase tracking-[0.1em] mb-0.5">{m.label}</div>
              <div className="font-mono text-[1rem] font-semibold text-text-strong">{m.value}</div>
              <div className="font-body text-[0.58rem] text-text-subtle/50 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Alert history table ── */}
        <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-border-soft/60">
            <h3 className="font-display text-[0.8rem] font-medium text-text-strong">Alert History</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft/40">
                {["Severity", "Message", "Agent", "Time"].map((h) => (
                  <th key={h} className="text-left font-body text-[0.62rem] text-text-subtle/60 uppercase tracking-[0.08em] pl-4 pr-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emptyRows.map((i) => (
                <tr key={i} className="border-b border-border-soft/30 last:border-0">
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.72rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.78rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.72rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.72rem] text-text-subtle/50">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── All-clear state ── */}
        <div className="bg-surface-panel rounded-card border border-border-soft px-6 py-10 text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-500/60 mx-auto mb-2" />
          <h3 className="font-display text-[0.82rem] font-medium text-text-strong mb-0.5">All clear</h3>
          <p className="font-body text-[0.72rem] text-text-subtle max-w-xs mx-auto">
            No active alerts. Failed calls, runtime errors, and agent misconfigurations will appear here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
