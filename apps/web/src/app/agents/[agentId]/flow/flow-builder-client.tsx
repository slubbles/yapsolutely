"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  Save,
  GripVertical,
  MessageSquare,
  HelpCircle,
  ClipboardList,
  CalendarDays,
  PhoneForwarded,
  PhoneOff,
  FileText,
  Loader2,
  Check,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AgentWorkspaceTabs from "@/components/dashboard/AgentWorkspaceTabs";
import { saveFlowAction, generatePromptFromFlowAction } from "@/app/_actions/agents";

// ─── Block type definitions ──────────────────────────

export type BlockType = "greet" | "qualify" | "faq" | "book_appointment" | "transfer" | "close_call" | "custom";

export type FlowBlock = {
  id: string;
  type: BlockType;
  fields: Record<string, string>;
};

type BlockDefinition = {
  type: BlockType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  defaultFields: Record<string, string>;
  fieldConfig: Array<{
    key: string;
    label: string;
    placeholder: string;
    multiline?: boolean;
  }>;
};

const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: "greet",
    label: "Greet",
    description: "Open the call with a warm greeting",
    icon: MessageSquare,
    color: "text-emerald-600 bg-emerald-50",
    defaultFields: { greeting: "", agentIntro: "" },
    fieldConfig: [
      { key: "greeting", label: "Greeting line", placeholder: "Hi, thanks for calling! How can I help you today?" },
      { key: "agentIntro", label: "Agent introduction", placeholder: "I'm Alex, your booking assistant." },
    ],
  },
  {
    type: "qualify",
    label: "Qualify",
    description: "Ask qualifying questions to understand the caller",
    icon: ClipboardList,
    color: "text-blue-600 bg-blue-50",
    defaultFields: { questions: "", collectInfo: "" },
    fieldConfig: [
      { key: "questions", label: "Questions to ask", placeholder: "What service are you interested in?\nIs this your first time?", multiline: true },
      { key: "collectInfo", label: "Info to collect", placeholder: "Name, email, preferred contact method" },
    ],
  },
  {
    type: "faq",
    label: "FAQ",
    description: "Handle common questions with prepared answers",
    icon: HelpCircle,
    color: "text-purple-600 bg-purple-50",
    defaultFields: { topics: "", fallback: "" },
    fieldConfig: [
      { key: "topics", label: "FAQ topics and answers", placeholder: "Hours: Mon-Fri 9am-5pm\nPricing: Starting at $99/month\nLocation: 123 Main St", multiline: true },
      { key: "fallback", label: "If question not covered", placeholder: "I'll connect you with someone who can help with that." },
    ],
  },
  {
    type: "book_appointment",
    label: "Book appointment",
    description: "Capture booking or appointment details",
    icon: CalendarDays,
    color: "text-amber-600 bg-amber-50",
    defaultFields: { services: "", availability: "", confirmation: "" },
    fieldConfig: [
      { key: "services", label: "Available services", placeholder: "Consultation, Follow-up, New patient visit" },
      { key: "availability", label: "Availability info", placeholder: "Monday to Friday, 9 AM to 5 PM" },
      { key: "confirmation", label: "Confirmation message", placeholder: "Great, I've noted your appointment. You'll receive a confirmation shortly." },
    ],
  },
  {
    type: "transfer",
    label: "Transfer to human",
    description: "Escalate the call to a live person",
    icon: PhoneForwarded,
    color: "text-orange-600 bg-orange-50",
    defaultFields: { condition: "", message: "" },
    fieldConfig: [
      { key: "condition", label: "When to transfer", placeholder: "If the caller asks for a manager or the issue is complex" },
      { key: "message", label: "Transfer message", placeholder: "Let me connect you with a team member who can help." },
    ],
  },
  {
    type: "close_call",
    label: "Close call",
    description: "Wrap up and end the conversation",
    icon: PhoneOff,
    color: "text-rose-600 bg-rose-50",
    defaultFields: { summary: "", signoff: "" },
    fieldConfig: [
      { key: "summary", label: "Summary behavior", placeholder: "Recap the key points discussed and any next steps." },
      { key: "signoff", label: "Closing line", placeholder: "Thanks for calling! Have a great day." },
    ],
  },
  {
    type: "custom",
    label: "Custom instruction",
    description: "Add any custom behavior or instruction",
    icon: FileText,
    color: "text-slate-600 bg-slate-50",
    defaultFields: { instruction: "" },
    fieldConfig: [
      { key: "instruction", label: "Custom instruction", placeholder: "Describe what the agent should do in this step…", multiline: true },
    ],
  },
];

function getBlockDef(type: BlockType): BlockDefinition {
  return BLOCK_DEFINITIONS.find((d) => d.type === type) ?? BLOCK_DEFINITIONS[BLOCK_DEFINITIONS.length - 1];
}

function createId() {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Types ──────────────────────────

type AgentSummary = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  systemPrompt: string;
  firstMessage: string | null;
};

// ─── Block palette ──────────────────────────

function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  return (
    <div className="bg-surface-panel rounded-card border border-border-soft">
      <div className="px-4 py-3 border-b border-border-soft">
        <h3 className="font-display text-sm font-medium text-text-strong">Add block</h3>
        <p className="font-body text-[0.68rem] text-text-subtle mt-0.5">Click to add a step to your flow</p>
      </div>
      <div className="p-3 grid grid-cols-1 gap-1.5">
        {BLOCK_DEFINITIONS.map((def) => {
          const Icon = def.icon;
          return (
            <button
              key={def.type}
              type="button"
              onClick={() => onAdd(def.type)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-subtle/60 transition-colors text-left group"
            >
              <div className={`w-7 h-7 rounded-md flex items-center justify-center ${def.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="font-body text-[0.78rem] font-medium text-text-strong group-hover:text-text-strong/90">
                  {def.label}
                </div>
                <div className="font-body text-[0.65rem] text-text-subtle truncate">{def.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Single flow block (sortable) ──────────────────────────

function SortableFlowBlock({
  block,
  index,
  total,
  onUpdate,
  onRemove,
}: {
  block: FlowBlock;
  index: number;
  total: number;
  onUpdate: (id: string, fields: Record<string, string>) => void;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.4 : 1,
  };

  const def = getBlockDef(block.type);
  const Icon = def.icon;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`bg-surface-panel rounded-card border group transition-shadow ${
          isDragging
            ? "border-accent-warm/50 shadow-lg ring-2 ring-accent-warm/20"
            : "border-border-soft hover:shadow-surface-sm"
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-soft">
          {/* Drag handle */}
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing p-0.5 -ml-1 rounded hover:bg-surface-subtle transition-colors touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-text-subtle/50 hover:text-text-subtle" />
          </button>
          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${def.color}`}>
            <Icon className="w-3 h-3" />
          </div>
          <span className="font-body text-[0.78rem] font-medium text-text-strong flex-1">
            {def.label}
          </span>
          <span className="font-mono text-[0.62rem] text-text-subtle/50 tabular-nums mr-2">
            Step {index + 1}/{total}
          </span>
          <button
            type="button"
            onClick={() => onRemove(block.id)}
            className="p-1 rounded hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove block"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          {def.fieldConfig.map((field) => (
            <div key={field.key}>
              <Label className="font-body text-[0.7rem] text-text-subtle mb-1.5 block">
                {field.label}
              </Label>
              {field.multiline ? (
                <Textarea
                  value={block.fields[field.key] ?? ""}
                  onChange={(e) =>
                    onUpdate(block.id, { ...block.fields, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  rows={3}
                  className="font-body text-[0.8rem] resize-none"
                />
              ) : (
                <Input
                  value={block.fields[field.key] ?? ""}
                  onChange={(e) =>
                    onUpdate(block.id, { ...block.fields, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className="font-body text-[0.8rem]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Drag overlay (ghost shown while dragging) ──────────────

function DragOverlayBlock({ block }: { block: FlowBlock }) {
  const def = getBlockDef(block.type);
  const Icon = def.icon;

  return (
    <div className="bg-surface-panel rounded-card border border-accent-warm/40 shadow-xl ring-2 ring-accent-warm/20 opacity-90 rotate-1 scale-[1.02]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-soft">
        <GripVertical className="w-4 h-4 text-accent-warm" />
        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${def.color}`}>
          <Icon className="w-3 h-3" />
        </div>
        <span className="font-body text-[0.78rem] font-medium text-text-strong flex-1">
          {def.label}
        </span>
      </div>
      <div className="p-4">
        <div className="text-[0.72rem] text-text-subtle italic">{def.description}</div>
      </div>
    </div>
  );
}

// ─── Step connector line ──────────────────────────

function StepConnector() {
  return (
    <div className="flex flex-col items-center py-1" aria-hidden="true">
      <div className="w-px h-3 bg-gradient-to-b from-border-soft to-accent-warm/30" />
      <ArrowDown className="w-3 h-3 text-accent-warm/40 -my-0.5" />
      <div className="w-px h-3 bg-gradient-to-b from-accent-warm/30 to-border-soft" />
    </div>
  );
}

// ─── Main flow builder ──────────────────────────

export default function FlowBuilderClient({
  agent,
  savedFlow,
}: {
  agent: AgentSummary;
  savedFlow: FlowBlock[];
}) {
  const router = useRouter();
  const slug = agent.slug ?? agent.id;

  const [blocks, setBlocks] = useState<FlowBlock[]>(() =>
    savedFlow.length > 0 ? savedFlow : [],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks]);
  const activeBlock = activeId ? blocks.find((b) => b.id === activeId) ?? null : null;

  const addBlock = useCallback((type: BlockType) => {
    const def = getBlockDef(type);
    setBlocks((prev) => [
      ...prev,
      { id: createId(), type, fields: { ...def.defaultFields } },
    ]);
    setSaved(false);
  }, []);

  const updateBlock = useCallback((id: string, fields: Record<string, string>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, fields } : b)));
    setSaved(false);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSaved(false);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((prev) => {
        const oldIndex = prev.findIndex((b) => b.id === active.id);
        const newIndex = prev.findIndex((b) => b.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
      setSaved(false);
    }
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.set("agentId", agent.id);
      formData.set("flow", JSON.stringify(blocks));
      await saveFlowAction(formData);
      setSaved(true);
    } catch {
      // saveFlowAction may redirect on success
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePrompt = async () => {
    if (blocks.length === 0) return;
    setIsGenerating(true);
    setGeneratedPrompt(null);
    try {
      const res = await fetch("/api/runtime/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          messages: [
            {
              role: "user",
              content: buildPromptGenerationRequest(agent, blocks),
            },
          ],
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.reply) {
        setGeneratedPrompt(data.reply);
      } else {
        setGeneratedPrompt(generatePromptLocally(agent, blocks));
      }
    } catch {
      setGeneratedPrompt(generatePromptLocally(agent, blocks));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyPrompt = async () => {
    if (!generatedPrompt) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.set("agentId", agent.id);
      formData.set("flow", JSON.stringify(blocks));
      formData.set("generatedPrompt", generatedPrompt);
      await generatePromptFromFlowAction(formData);
      router.push(`/agents/${slug}?updated=1`);
    } catch {
      // action may redirect
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-5 sm:p-6 lg:p-8 max-w-[1200px]">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/agents/${slug}`}
            className="inline-flex font-body text-[0.7rem] text-text-subtle hover:text-text-body transition-colors mb-3"
          >
            &larr; {agent.name}
          </Link>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display text-[1.2rem] font-semibold tracking-[-0.02em] text-text-strong mb-0.5">
                Flow builder
              </h1>
              <p className="font-body text-[0.75rem] text-text-subtle max-w-lg">
                Design your agent&apos;s conversation flow visually, then generate a system prompt.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || blocks.length === 0}
                className="rounded-md gap-1.5 text-[0.72rem] border-border-soft h-8"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : saved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                {saved ? "Saved" : "Save flow"}
              </Button>
              <Button
                variant="hero"
                size="sm"
                onClick={handleGeneratePrompt}
                disabled={isGenerating || blocks.length === 0}
                className="rounded-md gap-1.5 text-[0.72rem] h-8"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Generate prompt
              </Button>
            </div>
          </div>
          <AgentWorkspaceTabs slug={slug} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          {/* Block palette — sidebar */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <BlockPalette onAdd={addBlock} />
          </div>

          {/* Flow canvas */}
          <div className="xl:col-span-3 order-1 xl:order-2">
            {blocks.length === 0 ? (
              <div className="bg-surface-panel rounded-card border border-dashed border-border-soft p-12 text-center">
                <div className="w-14 h-14 bg-surface-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-6 h-6 text-text-subtle" />
                </div>
                <h3 className="font-display text-sm font-semibold text-text-strong mb-1">
                  Start building your flow
                </h3>
                <p className="font-body text-[0.78rem] text-text-subtle max-w-sm mx-auto mb-5">
                  Add blocks from the palette to define how your agent handles calls. Drag to reorder steps.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {BLOCK_DEFINITIONS.slice(0, 4).map((def) => {
                    const Icon = def.icon;
                    return (
                      <Button
                        key={def.type}
                        variant="outline"
                        size="sm"
                        onClick={() => addBlock(def.type)}
                        className="rounded-lg gap-1.5 text-[0.75rem] border-border-soft"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {def.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-0">
                    {blocks.map((block, i) => (
                      <div key={block.id}>
                        <SortableFlowBlock
                          block={block}
                          index={i}
                          total={blocks.length}
                          onUpdate={updateBlock}
                          onRemove={removeBlock}
                        />
                        {i < blocks.length - 1 && <StepConnector />}
                      </div>
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay dropAnimation={{
                  duration: 200,
                  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                }}>
                  {activeBlock ? <DragOverlayBlock block={activeBlock} /> : null}
                </DragOverlay>

                {/* Quick-add after last block */}
                <div className="flex justify-center pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-[0.72rem] text-text-subtle border border-dashed border-border-soft px-4 gap-1.5 hover:border-accent-warm/40 hover:text-accent-warm"
                    onClick={() => addBlock("custom")}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add step
                  </Button>
                </div>
              </DndContext>
            )}

            {/* Generated prompt result */}
            {generatedPrompt && (
              <div className="mt-6 bg-surface-panel rounded-card border border-accent-warm/30">
                <div className="px-4 py-3 border-b border-accent-warm/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-warm" />
                    <h3 className="font-display text-sm font-medium text-text-strong">Generated system prompt</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGeneratePrompt}
                      disabled={isGenerating}
                      className="text-[0.72rem] text-text-subtle gap-1"
                    >
                      Regenerate
                    </Button>
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={handleApplyPrompt}
                      disabled={isSaving}
                      className="rounded-lg gap-1.5 text-[0.75rem]"
                    >
                      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Apply to agent
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <pre className="font-body text-[0.78rem] text-text-body leading-relaxed whitespace-pre-wrap">
                    {generatedPrompt}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Prompt generation helpers ──────────────────────────

function buildPromptGenerationRequest(agent: AgentSummary, blocks: FlowBlock[]): string {
  const blockDescriptions = blocks
    .map((block, i) => {
      const def = getBlockDef(block.type);
      const fieldSummary = Object.entries(block.fields)
        .filter(([, v]) => v.trim())
        .map(([k, v]) => `  ${k}: ${v}`)
        .join("\n");
      return `Step ${i + 1} — ${def.label}:\n${fieldSummary || "  (no details provided)"}`;
    })
    .join("\n\n");

  return `You are helping create a system prompt for a voice AI agent. Generate a complete, well-structured system prompt based on this conversation flow.

Agent name: ${agent.name}
${agent.description ? `Agent description: ${agent.description}` : ""}

Conversation flow:
${blockDescriptions}

Generate a natural, comprehensive system prompt that:
1. Establishes the agent's identity and role
2. Follows the conversation flow steps in order
3. Includes specific instructions for each step
4. Keeps responses concise and natural for phone calls
5. Handles interruptions and off-topic questions gracefully
6. Includes any FAQ answers or booking details mentioned

Output ONLY the system prompt text, no explanations or markdown.`;
}

function generatePromptLocally(agent: AgentSummary, blocks: FlowBlock[]): string {
  const parts: string[] = [];

  parts.push(`You are ${agent.name}${agent.description ? `, ${agent.description}` : ""}.`);
  parts.push("Keep responses concise, natural for phone calls, and usually under two sentences.");
  parts.push("If the caller interrupts, gracefully adapt to the new turn.");

  for (const block of blocks) {
    const def = getBlockDef(block.type);
    const filledFields = Object.entries(block.fields).filter(([, v]) => v.trim());

    switch (block.type) {
      case "greet":
        if (block.fields.greeting) parts.push(`\nGreeting: Start the call by saying something like: "${block.fields.greeting}"`);
        if (block.fields.agentIntro) parts.push(`Introduce yourself: "${block.fields.agentIntro}"`);
        break;

      case "qualify":
        if (block.fields.questions) parts.push(`\nQualifying questions to ask:\n${block.fields.questions.split("\n").filter(Boolean).map((q) => `- ${q.trim()}`).join("\n")}`);
        if (block.fields.collectInfo) parts.push(`Information to collect: ${block.fields.collectInfo}`);
        break;

      case "faq":
        if (block.fields.topics) parts.push(`\nCommon questions and answers:\n${block.fields.topics}`);
        if (block.fields.fallback) parts.push(`If the question is not covered: ${block.fields.fallback}`);
        break;

      case "book_appointment":
        if (block.fields.services) parts.push(`\nAvailable services: ${block.fields.services}`);
        if (block.fields.availability) parts.push(`Availability: ${block.fields.availability}`);
        if (block.fields.confirmation) parts.push(`After booking, say: "${block.fields.confirmation}"`);
        break;

      case "transfer":
        if (block.fields.condition) parts.push(`\nTransfer to a human agent when: ${block.fields.condition}`);
        if (block.fields.message) parts.push(`Transfer message: "${block.fields.message}"`);
        break;

      case "close_call":
        if (block.fields.summary) parts.push(`\nBefore ending the call: ${block.fields.summary}`);
        if (block.fields.signoff) parts.push(`Closing line: "${block.fields.signoff}"`);
        break;

      case "custom":
        if (block.fields.instruction) parts.push(`\n${block.fields.instruction}`);
        break;

      default:
        if (filledFields.length > 0) {
          parts.push(`\n${def.label}:`);
          for (const [, v] of filledFields) parts.push(`- ${v}`);
        }
    }
  }

  parts.push("\nAlways confirm next steps before ending the call.");

  return parts.join("\n");
}
