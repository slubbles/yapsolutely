"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard } from "lucide-react";

const metrics = [
  { label: "Plan", value: "Beta", sub: "Full access" },
  { label: "Call Minutes", value: "0", sub: "Unlimited" },
  { label: "Agent Slots", value: "0", sub: "Unlimited" },
  { label: "Next Invoice", value: "—", sub: "No billing" },
];

const drivers = [
  { label: "Telephony (Twilio)", value: "—", detail: "Per-minute call charges" },
  { label: "Transcription (Deepgram)", value: "—", detail: "Per-minute STT charges" },
  { label: "AI (Anthropic)", value: "—", detail: "Token-based LLM charges" },
];

export default function BillingClient() {
  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="mb-5">
          <h1 className="font-display text-[1.38rem] font-semibold tracking-[-0.02em] text-text-strong">Billing</h1>
          <p className="font-body text-[0.89rem] text-text-subtle mt-0.5">Plan details, usage tracking, and cost drivers.</p>
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

        {/* ── Cost drivers ── */}
        <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden mb-5">
          <div className="px-4 py-3 border-b border-border-soft/60">
            <h3 className="font-display text-[0.89rem] font-medium text-text-strong">Cost Drivers</h3>
          </div>
          <div className="divide-y divide-border-soft/30">
            {drivers.map((d) => (
              <div key={d.label} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="font-body text-[0.87rem] text-text-body">{d.label}</div>
                  <div className="font-body text-[0.79rem] text-text-subtle/60">{d.detail}</div>
                </div>
                <span className="font-mono text-[0.87rem] text-text-strong">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Payment method ── */}
        <div className="bg-surface-panel rounded-card border border-border-soft px-6 py-10 text-center">
          <CreditCard className="w-5 h-5 text-text-subtle/30 mx-auto mb-2" />
          <h3 className="font-display text-[1.02rem] font-medium text-text-strong mb-0.5">No payment method</h3>
          <p className="font-body text-[0.89rem] text-text-subtle max-w-xs mx-auto">
            A payment method will be required when the beta transitions to paid plans.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
