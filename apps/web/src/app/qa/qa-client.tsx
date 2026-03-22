"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ShieldCheck } from "lucide-react";

const metrics = [
  { label: "Reviewed", value: "—", sub: "Calls scored" },
  { label: "Passed", value: "—", sub: "Met criteria" },
  { label: "Flagged", value: "—", sub: "Needs review" },
  { label: "Avg Score", value: "—", sub: "Out of 100" },
];

const emptyRows = Array.from({ length: 5 }, (_, i) => i);

export default function QAClient() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="mb-5">
          <h1 className="font-display text-[1.12rem] font-semibold tracking-[-0.02em] text-text-strong">Quality Assurance</h1>
          <p className="font-body text-[0.72rem] text-text-subtle mt-0.5">Review agent performance and flag issues.</p>
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

        {/* ── Review queue ── */}
        <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-border-soft/60 flex items-center justify-between">
            <h3 className="font-display text-[0.8rem] font-medium text-text-strong">Review Queue</h3>
            <div className="flex items-center gap-1.5">
              {["All", "Flagged", "Passed"].map((tab, i) => (
                <button
                  key={tab}
                  className={`font-body text-[0.64rem] px-2 py-0.5 rounded ${i === 0 ? "bg-foreground text-background" : "text-text-subtle hover:text-text-body"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft/40">
                {["Call", "Agent", "Score", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left font-body text-[0.62rem] text-text-subtle/60 uppercase tracking-[0.08em] pl-4 pr-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emptyRows.map((i) => (
                <tr key={i} className="border-b border-border-soft/30 last:border-0">
                  <td className="pl-4 pr-3 py-2.5 font-mono text-[0.72rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.78rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-mono text-[0.72rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.72rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.72rem] text-text-subtle/50">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Empty state overlay ── */}
        <div className="bg-surface-panel rounded-card border border-border-soft px-6 py-10 text-center">
          <ShieldCheck className="w-5 h-5 text-text-subtle/30 mx-auto mb-2" />
          <h3 className="font-display text-[0.82rem] font-medium text-text-strong mb-0.5">No reviews yet</h3>
          <p className="font-body text-[0.72rem] text-text-subtle max-w-xs mx-auto">
            QA reviews evaluate completed calls against quality criteria. Results appear after calls are processed.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
