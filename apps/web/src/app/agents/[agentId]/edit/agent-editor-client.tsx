"use client";

import { useState } from "react";
import { ArrowLeft, Save, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AgentWorkspaceTabs from "@/components/dashboard/AgentWorkspaceTabs";
import PromptComposer from "@/components/dashboard/PromptComposer";
import { updateAgentAction, createAgentAction } from "@/app/_actions/agents";

type AgentEditData = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  systemPrompt: string;
  firstMessage: string | null;
  voiceModel: string | null;
  status: string;
  transferNumber: string | null;
  phoneNumber: string | null;
};

const voiceOptions = ["Nova", "Aria", "Ember", "Sage", "Onyx"];

export default function AgentEditorClient({ agent, isNew }: { agent: AgentEditData; isNew: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const slug = agent.slug ?? agent.id;

  const [name, setName] = useState(agent.name);
  const [voice, setVoice] = useState(agent.voiceModel ?? "Nova");
  const [description, setDescription] = useState(agent.description ?? "");
  const [firstMessage, setFirstMessage] = useState(agent.firstMessage ?? "");
  const [transferNumber, setTransferNumber] = useState(agent.transferNumber ?? "");
  const [prompt, setPrompt] = useState(agent.systemPrompt);
  const [showComposer, setShowComposer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  const hasPrompt = prompt.trim().length > 0;

  const handleSave = async () => {
    if (!name.trim()) {
      setNameError("Agent name is required");
      return;
    }
    if (!prompt.trim()) {
      toast({ title: "System prompt required", description: "Add a system prompt before saving." });
      return;
    }
    setNameError("");
    setIsSaving(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    formData.set("systemPrompt", prompt);
    formData.set("firstMessage", firstMessage);
    formData.set("voiceModel", voice);
    formData.set("transferNumber", transferNumber);

    try {
      if (isNew) {
        await createAgentAction(formData);
      } else {
        formData.set("agentId", agent.id);
        formData.set("status", agent.status);
        formData.set("returnTo", `/agents/${slug}`);
        await updateAgentAction(formData);
      }
    } catch {
      // Server actions redirect on success, which throws NEXT_REDIRECT
      // If we get here without redirect, show success toast
    }
    setIsSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1000px]">
        {/* Header */}
        <div className="mb-5">
          <Link
            href={isNew ? "/agents" : `/agents/${slug}`}
            className="inline-flex font-body text-[0.7rem] text-text-subtle hover:text-text-body transition-colors mb-3"
          >
            &larr; {isNew ? "Agents" : agent.name}
          </Link>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display text-[1.12rem] font-semibold tracking-[-0.02em] text-text-strong mb-0.5">
                {isNew ? "Create agent" : `Build — ${name}`}
              </h1>
              <p className="font-body text-[0.75rem] text-text-subtle">
                {isNew
                  ? "Configure your agent\u2019s identity, behavior, and system prompt."
                  : "Edit configuration, prompt, and behavior."}
              </p>
            </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-foreground text-background hover:bg-foreground/90 font-display font-medium tracking-[-0.01em] text-[0.78rem] h-8 rounded-lg px-5 gap-1.5"
          >
            {isSaving ? (
              <>
                <span className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                {isNew ? "Creating\u2026" : "Saving\u2026"}
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                {isNew ? "Create agent" : "Save changes"}
              </>
            )}
          </Button>
          </div>
          {!isNew && <AgentWorkspaceTabs slug={slug} />}
        </div>

        {/* Identity */}
        <section className="bg-surface-panel rounded-card border border-border-soft mb-5">
          <div className="px-6 py-4 border-b border-border-soft">
            <h2 className="font-display text-[0.92rem] font-semibold text-text-strong tracking-[-0.01em]">Identity</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="font-body text-[0.72rem] text-text-subtle">Agent name</Label>
                <Input
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (nameError) setNameError(""); }}
                  placeholder="e.g. Inbound Sales"
                  className={`h-10 rounded-lg border-border-soft bg-background font-body text-[0.85rem] ${nameError ? "border-destructive ring-1 ring-destructive/20" : ""}`}
                />
                {nameError && <p className="font-body text-[0.72rem] text-destructive">{nameError}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-[0.72rem] text-text-subtle">Voice</Label>
                <div className="flex gap-1.5">
                  {voiceOptions.map((v) => (
                    <button
                      key={v}
                      onClick={() => setVoice(v)}
                      className={`flex-1 h-10 rounded-lg border font-body text-[0.78rem] transition-all duration-150 ${
                        voice === v
                          ? "border-foreground bg-foreground text-background"
                          : "border-border-soft bg-background text-text-body hover:border-foreground/20"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-[0.72rem] text-text-subtle">Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this agent"
                  className="h-10 rounded-lg border-border-soft bg-background font-body text-[0.85rem]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-[0.72rem] text-text-subtle">First message</Label>
                <Input
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  placeholder="What the agent says when it answers"
                  className="h-10 rounded-lg border-border-soft bg-background font-body text-[0.85rem]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-[0.72rem] text-text-subtle">Transfer number</Label>
                <Input
                  value={transferNumber}
                  onChange={(e) => setTransferNumber(e.target.value)}
                  placeholder="e.g. +14155550123"
                  className="h-10 rounded-lg border-border-soft bg-background font-body text-[0.85rem] font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-[0.72rem] text-text-subtle">Assigned number</Label>
                <Input
                  value={agent.phoneNumber || "Not assigned"}
                  readOnly
                  className="h-10 rounded-lg border-border-soft bg-muted font-mono text-[0.8rem] text-text-subtle"
                />
              </div>
            </div>
          </div>
        </section>

        {/* System Prompt */}
        <section className="bg-surface-panel rounded-card border border-border-soft mb-5 overflow-hidden">
          <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between">
            <div>
              <h2 className="font-display text-[0.92rem] font-semibold text-text-strong tracking-[-0.01em]">System prompt</h2>
              <p className="font-body text-[0.72rem] text-text-subtle mt-0.5">
                {hasPrompt
                  ? "The core instructions that define how your agent behaves on every call."
                  : "Start with a blank canvas or generate a first draft with AI."}
              </p>
            </div>
            {!showComposer && (
              <Button
                onClick={() => setShowComposer(true)}
                variant={hasPrompt ? "outline" : "default"}
                size="sm"
                className={`gap-2 rounded-lg font-body text-[0.78rem] ${
                  hasPrompt
                    ? "border-border-soft text-text-body hover:border-foreground/20"
                    : "bg-foreground text-background hover:bg-foreground/90 font-display font-medium"
                }`}
              >
                {hasPrompt ? (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    Improve with AI
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate with AI
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="px-6 py-5">
            {!hasPrompt && !showComposer ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-10 h-10 rounded-xl bg-foreground/[0.04] flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-text-subtle" />
                </div>
                <p className="font-display text-[0.95rem] font-semibold text-text-strong mb-1">No prompt yet</p>
                <p className="font-body text-[0.8rem] text-text-subtle mb-5 max-w-xs">
                  Write your own or let AI generate a strong first draft based on your agent&apos;s purpose.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowComposer(true)}
                    className="bg-foreground text-background hover:bg-foreground/90 font-display font-medium tracking-[-0.01em] text-[0.82rem] h-10 rounded-lg px-5 gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate with AI
                  </Button>
                  <button
                    onClick={() => {
                      const el = document.getElementById("prompt-textarea");
                      if (el) el.focus();
                    }}
                    className="font-body text-[0.8rem] text-text-subtle hover:text-text-body transition-colors"
                  >
                    or write manually
                  </button>
                </div>
              </div>
            ) : (
              <textarea
                id="prompt-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="You are a voice agent for..."
                rows={hasPrompt ? 10 : 4}
                className="w-full rounded-lg border border-border-soft bg-background px-4 py-3.5 font-body text-[0.82rem] text-text-body leading-[1.75] placeholder:text-text-subtle/40 focus:outline-none focus:ring-1 focus:ring-text-strong/10 transition-shadow resize-y"
              />
            )}
            {hasPrompt && (
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="font-mono text-[0.6rem] text-text-subtle/40">{prompt.length} characters</span>
              </div>
            )}
          </div>

          {showComposer && (
            <PromptComposer
              currentPrompt={prompt}
              agentName={name}
              agentId={agent.id || undefined}
              onApply={(generated) => {
                setPrompt(generated);
                setShowComposer(false);
                toast({
                  title: "Prompt applied",
                  description: "The generated prompt has been added to your agent.",
                });
              }}
              onClose={() => setShowComposer(false)}
            />
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
