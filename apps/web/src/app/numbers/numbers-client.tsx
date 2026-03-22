"use client";

import { useState, Suspense } from "react";
import { Search, Plus, Hash, X, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import EmptyState from "@/components/dashboard/EmptyState";
import { registerPhoneNumberAction, reassignPhoneNumberAction, deletePhoneNumberAction } from "@/app/_actions/phone-numbers";

type AgentOption = {
  id: string;
  name: string;
};

type NumberItem = {
  id: string;
  phoneNumber: string;
  friendlyName: string | null;
  twilioSid: string | null;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  createdAt: string;
};

function getStatus(n: NumberItem): string {
  if (n.assignedAgentId) return "Assigned";
  if (n.friendlyName) return "Unassigned";
  return "Needs setup";
}

const statusStyle = (status: string) => {
  switch (status) {
    case "Assigned":
      return "text-emerald-600 bg-emerald-400/10";
    case "Unassigned":
      return "text-text-subtle bg-surface-subtle";
    case "Needs setup":
      return "text-accent-warm-dim bg-accent-warm/10";
    default:
      return "text-text-subtle bg-surface-subtle";
  }
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function NumbersInner({ numbers, agents }: { numbers: NumberItem[]; agents: AgentOption[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = query.trim()
    ? numbers.filter(
        (n) =>
          n.phoneNumber.includes(query) ||
          n.friendlyName?.toLowerCase().includes(query.toLowerCase()) ||
          n.assignedAgentName?.toLowerCase().includes(query.toLowerCase()),
      )
    : numbers;

  const totalNumbers = numbers.length;
  const assigned = numbers.filter((n) => n.assignedAgentId).length;
  const unassigned = totalNumbers - assigned;
  const needsSetup = numbers.filter((n) => !n.assignedAgentId && !n.friendlyName).length;

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1100px]">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-[1.38rem] font-semibold tracking-[-0.02em] text-text-strong">
              Numbers
              {totalNumbers > 0 && <span className="ml-2 font-body text-[0.89rem] text-text-subtle font-normal">{totalNumbers}</span>}
            </h1>
            <p className="font-body text-[0.89rem] text-text-subtle mt-0.5">Assign phone numbers to agents and manage routing.</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} variant="hero" size="sm" className="rounded-lg gap-1 text-[0.89rem] h-7 px-3">
            <Plus className="w-3 h-3" />Add number
          </Button>
        </div>

        {numbers.length === 0 ? (
          <div className="bg-surface-panel rounded-card border border-border-soft">
            <EmptyState
              icon={Hash}
              title="No numbers yet"
              description="Add a phone number to route inbound calls to your agents."
              actionLabel="Add your first number"
              onAction={() => setShowAddDialog(true)}
            />
          </div>
        ) : (
          <>
            {/* ── Metrics strip ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Total", value: String(totalNumbers) },
                { label: "Assigned", value: String(assigned) },
                { label: "Unassigned", value: String(unassigned) },
                { label: "Needs Setup", value: String(needsSetup) },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-panel rounded-lg border border-border-soft/60 px-4 py-3">
                  <div className="font-body text-[0.67rem] text-text-subtle/70 uppercase tracking-[0.1em] mb-0.5">{stat.label}</div>
                  <div className="font-mono text-[1rem] font-semibold text-text-strong">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* ── Search ── */}
            <div className="flex items-center justify-end mb-3">
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-subtle/50" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search numbers…"
                  className="w-full h-7 pl-7 pr-2 rounded-md border border-border-soft/60 bg-surface-panel font-body text-[0.89rem] text-text-strong placeholder:text-text-subtle/40 focus:outline-none focus:ring-1 focus:ring-text-strong/10"
                />
              </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-surface-panel rounded-card border border-border-soft overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-soft/40">
                    <th className="text-left pl-4 pr-3 py-2 font-body text-[0.79rem] text-text-subtle/60 uppercase tracking-[0.08em]">Number</th>
                    <th className="text-left pl-4 pr-3 py-2 font-body text-[0.79rem] text-text-subtle/60 uppercase tracking-[0.08em]">Name</th>
                    <th className="text-left pl-4 pr-3 py-2 font-body text-[0.79rem] text-text-subtle/60 uppercase tracking-[0.08em]">Agent</th>
                    <th className="text-left pl-4 pr-3 py-2 font-body text-[0.79rem] text-text-subtle/60 uppercase tracking-[0.08em]">Status</th>
                    <th className="text-right pl-4 pr-4 py-2 font-body text-[0.79rem] text-text-subtle/60 uppercase tracking-[0.08em]">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((n) => {
                    const status = getStatus(n);
                    const isEditing = editingId === n.id;
                    return (
                      <tr key={n.id} className="border-b border-border-soft/30 last:border-0 hover:bg-surface-subtle/40 transition-colors group">
                        <td className="pl-4 pr-3 py-2.5 font-mono text-[0.89rem] text-text-body">{n.phoneNumber}</td>
                        <td className="pl-4 pr-3 py-2.5 font-body text-[0.87rem] text-text-body">{n.friendlyName ?? "—"}</td>
                        <td className="pl-4 pr-3 py-2.5">
                          {isEditing ? (
                            <form action={reassignPhoneNumberAction} onSubmit={() => setEditingId(null)}>
                              <input type="hidden" name="phoneNumberId" value={n.id} />
                              <select
                                name="agentId"
                                defaultValue={n.assignedAgentId ?? ""}
                                onChange={(e) => e.currentTarget.form?.requestSubmit()}
                                onBlur={() => setEditingId(null)}
                                autoFocus
                                className="h-6 px-1.5 rounded border border-border-soft bg-surface-panel font-body text-[0.89rem] text-text-strong focus:outline-none focus:ring-1 focus:ring-text-strong/10"
                              >
                                <option value="">No agent</option>
                                {agents.map((a) => (
                                  <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                              </select>
                            </form>
                          ) : (
                            <button
                              onClick={() => setEditingId(n.id)}
                              className="font-body text-[0.87rem] text-text-body hover:text-text-strong hover:underline transition-colors text-left"
                            >
                              {n.assignedAgentName ?? <span className="text-text-subtle italic text-[0.89rem]">Assign</span>}
                            </button>
                          )}
                        </td>
                        <td className="pl-4 pr-3 py-2.5">
                          <span className={`inline-flex px-1.5 py-px rounded text-[0.8rem] font-body font-medium ${statusStyle(status)}`}>{status}</span>
                        </td>
                        <td className="pl-4 pr-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="font-body text-[0.89rem] text-text-subtle">{formatDate(n.createdAt)}</span>
                            <form action={deletePhoneNumberAction}>
                              <input type="hidden" name="phoneNumberId" value={n.id} />
                              <button
                                type="submit"
                                className="p-0.5 rounded text-text-subtle/0 group-hover:text-text-subtle hover:!text-red-500 hover:bg-red-50 transition-all"
                                title="Delete number"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add number dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowAddDialog(false)} />
          <div className="relative w-full max-w-md mx-4 bg-surface-panel rounded-xl border border-border-soft overflow-hidden">
            <div className="px-5 pt-5 pb-2 flex items-center justify-between">
              <h2 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-text-strong">Add phone number</h2>
              <button onClick={() => setShowAddDialog(false)} className="p-1 rounded hover:bg-surface-subtle transition-colors">
                <X className="w-3.5 h-3.5 text-text-subtle" />
              </button>
            </div>
            <form action={registerPhoneNumberAction} className="px-5 pb-5">
              <div className="space-y-3.5 mt-3">
                <div>
                  <Label htmlFor="phoneNumber" className="font-body text-[0.89rem] text-text-body mb-1 block">Phone number</Label>
                  <Input id="phoneNumber" name="phoneNumber" placeholder="+1 (555) 123-4567" required className="font-mono text-[0.87rem] h-8" />
                  <p className="font-body text-[0.79rem] text-text-subtle mt-0.5">Include country code.</p>
                </div>
                <div>
                  <Label htmlFor="friendlyName" className="font-body text-[0.89rem] text-text-body mb-1 block">Friendly name</Label>
                  <Input id="friendlyName" name="friendlyName" placeholder="e.g. Main Office Line" className="text-[0.87rem] h-8" />
                </div>
                <div>
                  <Label htmlFor="twilioSid" className="font-body text-[0.89rem] text-text-body mb-1 block">Twilio SID <span className="text-text-subtle">(optional)</span></Label>
                  <Input id="twilioSid" name="twilioSid" placeholder="PNxxxxxxxxxxxxxxxx" className="font-mono text-[0.87rem] h-8" />
                </div>
                <div>
                  <Label htmlFor="agentId" className="font-body text-[0.89rem] text-text-body mb-1 block">Assign to agent <span className="text-text-subtle">(optional)</span></Label>
                  <select id="agentId" name="agentId" className="w-full h-8 px-2.5 rounded-md border border-border-soft bg-surface-panel font-body text-[0.87rem] text-text-strong focus:outline-none focus:ring-1 focus:ring-text-strong/10">
                    <option value="">No agent</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-border-soft/60">
                <Button type="button" variant="ghost" size="sm" className="text-[0.89rem] h-7" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button type="submit" variant="hero" size="sm" className="rounded-lg text-[0.89rem] h-7 px-3">Add number</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function NumbersClient({ numbers, agents }: { numbers: NumberItem[]; agents: AgentOption[] }) {
  return (
    <Suspense>
      <NumbersInner numbers={numbers} agents={agents} />
    </Suspense>
  );
}
