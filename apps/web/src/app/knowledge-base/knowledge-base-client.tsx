"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BookOpen } from "lucide-react";

const metrics = [
  { label: "Webpages", value: "0", sub: "Crawled" },
  { label: "Documents", value: "0", sub: "Uploaded" },
  { label: "Custom Data", value: "0", sub: "Imported" },
  { label: "Total Sources", value: "0", sub: "All types" },
];

const emptyRows = Array.from({ length: 4 }, (_, i) => i);

export default function KnowledgeBaseClient() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-[1.38rem] font-semibold tracking-[-0.02em] text-text-strong">Knowledge Base</h1>
            <p className="font-body text-[0.89rem] text-text-subtle mt-0.5">Sources that inform your agents&apos; responses.</p>
          </div>
          <button className="font-body text-[0.89rem] text-text-subtle/50 px-2.5 py-1 rounded border border-border-soft/40 cursor-not-allowed">
            Add source
          </button>
        </div>

        {/* ── Metrics strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {metrics.map((m) => (
            <div key={m.label} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
              <div className="font-body text-[0.67rem] text-text-subtle/70 uppercase tracking-[0.1em] mb-0.5">{m.label}</div>
              <div className="font-mono text-[1rem] font-semibold text-text-strong">{m.value}</div>
              <div className="font-body text-[0.67rem] text-text-subtle/50 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Source table ── */}
        <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-border-soft/60">
            <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Sources</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-soft/40">
                {["Name", "Type", "Items", "Last Updated"].map((h) => (
                  <th key={h} className="text-left font-body text-[0.79rem] text-text-subtle/60 uppercase tracking-[0.08em] pl-4 pr-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emptyRows.map((i) => (
                <tr key={i} className="border-b border-border-soft/30 last:border-0">
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.87rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.89rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-mono text-[0.89rem] text-text-subtle/50">—</td>
                  <td className="pl-4 pr-3 py-2.5 font-body text-[0.89rem] text-text-subtle/50">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Empty state ── */}
        <div className="bg-surface-panel rounded-card border border-border-soft px-6 py-10 text-center">
          <BookOpen className="w-5 h-5 text-text-subtle/30 mx-auto mb-2" />
          <h3 className="font-display text-[1.02rem] font-medium text-text-strong mb-0.5">No sources yet</h3>
          <p className="font-body text-[0.89rem] text-text-subtle max-w-xs mx-auto">
            Add webpages, documents, or custom data to build context that flows into your agents automatically.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
