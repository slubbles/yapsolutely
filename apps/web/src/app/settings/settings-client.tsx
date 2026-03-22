"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, AlertCircle, Save } from "lucide-react";
import { updateProfileAction } from "@/app/_actions/auth";

type ReadinessCheck = {
  key: string;
  label: string;
  status: "configured" | "missing";
  detail: string;
};

type ReadinessSection = {
  title: string;
  description: string;
  checks: ReadinessCheck[];
};

type SettingsProps = {
  userEmail: string;
  userName: string;
  sections: ReadinessSection[];
  configuredCount: number;
  totalCount: number;
};

export default function SettingsClient({
  userEmail,
  userName,
  sections,
  configuredCount,
  totalCount,
}: SettingsProps) {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[800px]">
        {/* ── Header ── */}
        <div className="mb-5">
          <h1 className="font-display text-[1.38rem] font-semibold tracking-[-0.02em] text-text-strong">Settings</h1>
          <p className="font-body text-[0.89rem] text-text-subtle mt-0.5">Workspace configuration, readiness, and security.</p>
        </div>

        {/* ── Workspace ── */}
        <section className="bg-surface-panel border border-border-soft rounded-card overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-border-soft/60">
            <h2 className="font-display text-[0.89rem] font-medium text-text-strong">Workspace</h2>
          </div>
          <form action={updateProfileAction} onSubmit={() => setIsSaving(true)} className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="font-body text-[0.77rem] text-text-subtle">Display name</Label>
                <Input id="name" name="name" defaultValue={userName} className="h-8 rounded-md text-[0.87rem]" required />
              </div>
              <div className="space-y-1">
                <Label className="font-body text-[0.77rem] text-text-subtle">Email</Label>
                <Input defaultValue={userEmail} readOnly className="h-8 rounded-md bg-surface-subtle font-mono text-[0.89rem] text-text-subtle" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} size="sm" className="gap-1.5 h-7 text-[0.89rem]">
                {isSaving ? (
                  <>
                    <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-background rounded-full animate-spin" />
                    Saving&hellip;
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </section>

        {/* ── Readiness ── */}
        <section className="bg-surface-panel border border-border-soft rounded-card overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-border-soft/60 flex items-center justify-between">
            <h2 className="font-display text-[0.89rem] font-medium text-text-strong">Readiness</h2>
            <span className="font-mono text-[0.8rem] text-text-subtle">{configuredCount}/{totalCount}</span>
          </div>
          <div className="p-4">
            {sections.map((section) => (
              <div key={section.title} className="mb-3 last:mb-0">
                <h3 className="font-body text-[0.77rem] font-medium text-text-body mb-1.5">{section.title}</h3>
                <div className="space-y-0.5">
                  {section.checks.map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-surface-subtle/40 transition-colors">
                      <div>
                        <span className="font-body text-[0.84rem] text-text-body">{item.label}</span>
                        <p className="font-body text-[0.79rem] text-text-subtle">{item.detail}</p>
                      </div>
                      {item.status === "configured" ? (
                        <span className="flex items-center gap-1 font-body text-[0.8rem] text-emerald-600"><Check className="w-3 h-3" />Ready</span>
                      ) : (
                        <span className="flex items-center gap-1 font-body text-[0.8rem] text-accent-warm-dim"><AlertCircle className="w-3 h-3" />Missing</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Security ── */}
        <section className="bg-surface-panel border border-border-soft rounded-card overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-border-soft/60">
            <h2 className="font-display text-[0.89rem] font-medium text-text-strong">Security</h2>
          </div>
          <div className="p-4 space-y-0.5">
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-surface-subtle/40 transition-colors">
              <div>
                <p className="font-body text-[0.84rem] text-text-body font-medium">Sign-in method</p>
                <p className="font-body text-[0.79rem] text-text-subtle">Email-based session</p>
              </div>
              <span className="font-body text-[0.79rem] text-emerald-600 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">Active</span>
            </div>
            <Separator className="bg-border-soft/40" />
            <div className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-surface-subtle/40 transition-colors">
              <div>
                <p className="font-body text-[0.84rem] text-text-body font-medium">Session</p>
                <p className="font-body text-[0.79rem] text-text-subtle">Signed in as {userEmail}</p>
              </div>
              <form action="/sign-in">
                <Button variant="outline" size="sm" type="submit" className="h-6 text-[0.8rem] px-2">Sign out</Button>
              </form>
            </div>
          </div>
        </section>

        {/* ── Integrations ── */}
        <section className="bg-surface-panel border border-border-soft rounded-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border-soft/60">
            <h2 className="font-display text-[0.89rem] font-medium text-text-strong">Integrations</h2>
          </div>
          <div className="p-4 space-y-1.5">
            {[
              { name: "Twilio", description: "Phone number provisioning and call routing", connected: true },
              { name: "Deepgram", description: "Speech-to-text transcription", connected: true },
              { name: "Anthropic", description: "AI conversation engine", connected: true },
            ].map((integration) => (
              <div key={integration.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border-soft/40 hover:bg-surface-subtle/30 transition-colors">
                <div>
                  <p className="font-body text-[0.84rem] text-text-body font-medium">{integration.name}</p>
                  <p className="font-body text-[0.79rem] text-text-subtle">{integration.description}</p>
                </div>
                {integration.connected ? (
                  <span className="font-body text-[0.79rem] text-emerald-600 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">Connected</span>
                ) : (
                  <Button variant="outline" size="sm" className="h-6 text-[0.8rem] px-2">Connect</Button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
