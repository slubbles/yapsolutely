"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BarChart3, TrendingUp, Clock, PhoneIncoming } from "lucide-react";

const metrics = [
  { label: "Total Calls", value: "—", sub: "All time" },
  { label: "Avg Duration", value: "—", sub: "Completed" },
  { label: "Success Rate", value: "—", sub: "Completed / total" },
  { label: "Avg Sentiment", value: "—", sub: "Positive callers" },
];

const emptyRows = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  agent: "—",
  calls: "—",
  duration: "—",
  success: "—",
}));

export default function AnalyticsClient() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-[1.12rem] font-semibold tracking-[-0.02em] text-text-strong">Analytics</h1>
            <p className="font-body text-[0.72rem] text-text-subtle mt-0.5">Usage metrics and performance trends.</p>
          </div>
          <div className="flex items-center gap-1.5">
            {["7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                className={`font-body text-[0.64rem] px-2 py-0.5 rounded ${range === "30d" ? "bg-foreground text-background" : "text-text-subtle hover:text-text-body"}`}
              >
                {range}
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

        {/* ── Charts placeholder ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {["Call Volume", "Duration Distribution"].map((title) => (
            <div key={title} className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <div className="px-4 py-3 border-b border-border-soft/60">
                <h3 className="font-display text-[0.8rem] font-medium text-text-strong">{title}</h3>
              </div>
              <div className="px-4 py-12 flex flex-col items-center justify-center">
                <BarChart3 className="w-5 h-5 text-text-subtle/30 mb-2" />
                <p className="font-body text-[0.72rem] text-text-subtle/60">Chart data appears after calls</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Agent performance table ── */}
        <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
          <div className="px-4 py-3 border-b border-border-soft/60">
            <h3 className="font-display text-[0.8rem] font-medium text-text-strong">Agent Performance</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft/40">
                {["Agent", "Calls", "Avg Duration", "Success"].map((h) => (
                  <th key={h} className="text-left font-body text-[0.62rem] text-text-subtle/60 uppercase tracking-[0.08em] pl-4 pr-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emptyRows.map((row) => (
                <tr key={row.id} className="border-b border-border-soft/30 last:border-0">
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.78rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-mono text-[0.72rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-mono text-[0.72rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-mono text-[0.72rem] text-text-subtle/50">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
