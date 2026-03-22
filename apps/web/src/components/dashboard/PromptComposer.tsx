import { useState } from "react";
import { Sparkles, RotateCcw, X, ChevronRight, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PromptComposerProps {
  currentPrompt: string;
  onApply: (prompt: string) => void;
  onClose: () => void;
  agentName?: string;
  agentId?: string;
}

const toneOptions = ["Professional", "Warm", "Direct", "Empathetic", "Casual", "Formal"];

const refinementActions = [
  { label: "Make it shorter", instruction: "Rewrite the following system prompt to be more concise while keeping the same intent and instructions. Remove redundancy." },
  { label: "More detailed", instruction: "Expand the following system prompt with more specific instructions, edge cases, and example phrasing where appropriate." },
  { label: "Sound more natural", instruction: "Rewrite the following system prompt to use more natural, conversational language while keeping the same instructions." },
];

function buildPromptGenerationInstruction(inputs: {
  name: string;
  purpose: string;
  tone: string;
  goal: string;
  mustDo: string;
  avoid: string;
  escalation: string;
  notes: string;
  existingPrompt?: string;
}) {
  const parts = [
    "Generate a complete system prompt for an AI phone voice agent with the following specifications.",
    "Output ONLY the system prompt text, no explanation or commentary.",
    "",
    `Agent name: ${inputs.name || "Voice Agent"}`,
    inputs.purpose ? `Purpose: ${inputs.purpose}` : "",
    inputs.tone ? `Tone: ${inputs.tone}` : "",
    inputs.goal ? `Primary goal: ${inputs.goal}` : "",
    inputs.mustDo ? `Must-do instructions:\n${inputs.mustDo}` : "",
    inputs.avoid ? `Things to avoid:\n${inputs.avoid}` : "",
    inputs.escalation ? `Escalation/transfer rules: ${inputs.escalation}` : "",
    inputs.notes ? `Additional context: ${inputs.notes}` : "",
    "",
    "The prompt should:",
    "- Define the agent's identity and role clearly",
    "- Include conversation flow guidance",
    "- Specify how to handle common scenarios",
    "- Include rules for ending calls gracefully",
    "- Be written in second person (\"You are...\")",
    inputs.existingPrompt ? `\nHere is the existing prompt to improve upon:\n${inputs.existingPrompt}` : "",
  ];
  return parts.filter(Boolean).join("\n");
}

// Local fallback when LLM is not available
function generatePromptLocally(inputs: {
  name: string;
  purpose: string;
  tone: string;
  goal: string;
  mustDo: string;
  avoid: string;
  escalation: string;
  notes: string;
}) {
  const parts = [
    `You are ${inputs.name || "a voice agent"}${inputs.purpose ? `, responsible for ${inputs.purpose.toLowerCase()}` : ""}.`,
    inputs.goal ? `\nYour primary goal is to ${inputs.goal.toLowerCase()}.` : "",
    inputs.tone ? `\nMaintain a ${inputs.tone.toLowerCase()} tone throughout the conversation.` : "",
    inputs.mustDo ? `\nKey instructions:\n${inputs.mustDo.split("\n").filter(Boolean).map(l => `- ${l.trim()}`).join("\n")}` : "",
    inputs.avoid ? `\nThings to avoid:\n${inputs.avoid.split("\n").filter(Boolean).map(l => `- ${l.trim()}`).join("\n")}` : "",
    inputs.escalation ? `\nEscalation rules: ${inputs.escalation}` : "",
    inputs.notes ? `\nAdditional context: ${inputs.notes}` : "",
    "\nAlways confirm next steps before ending the call. If you're unsure about something, acknowledge the caller's question and offer to connect them with the appropriate team.",
  ];
  return parts.filter(Boolean).join("");
}

async function callLlmForPrompt(agentId: string, instruction: string): Promise<string | null> {
  try {
    const res = await fetch("/api/runtime/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agentId,
        messages: [{ role: "user", content: instruction }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.reply || data.content || null;
  } catch {
    return null;
  }
}

const PromptComposer = ({ currentPrompt, onApply, onClose, agentName = "", agentId }: PromptComposerProps) => {
  const isExpanding = currentPrompt.trim().length > 0;
  const [phase, setPhase] = useState<"input" | "result">("input");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [aiPowered, setAiPowered] = useState(false);

  // Structured inputs
  const [name, setName] = useState(agentName);
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("");
  const [goal, setGoal] = useState("");
  const [mustDo, setMustDo] = useState("");
  const [avoid, setAvoid] = useState("");
  const [escalation, setEscalation] = useState("");
  const [notes, setNotes] = useState("");

  const inputState = { name, purpose, tone, goal, mustDo, avoid, escalation, notes };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setAiPowered(false);

    if (agentId) {
      const instruction = buildPromptGenerationInstruction({
        ...inputState,
        existingPrompt: isExpanding ? currentPrompt : undefined,
      });
      const llmResult = await callLlmForPrompt(agentId, instruction);
      if (llmResult) {
        setGeneratedPrompt(llmResult);
        setIsGenerating(false);
        setAiPowered(true);
        setPhase("result");
        return;
      }
    }

    // Fallback to local generation
    const base = generatePromptLocally(inputState);
    const result = isExpanding
      ? `${currentPrompt}\n\n--- Expanded ---\n\n${base}`
      : base;
    setGeneratedPrompt(result);
    setIsGenerating(false);
    setPhase("result");
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);

    if (agentId) {
      const instruction = buildPromptGenerationInstruction({
        ...inputState,
        existingPrompt: isExpanding ? currentPrompt : undefined,
      });
      const llmResult = await callLlmForPrompt(agentId, instruction);
      if (llmResult) {
        setGeneratedPrompt(llmResult);
        setIsGenerating(false);
        setAiPowered(true);
        return;
      }
    }

    const base = generatePromptLocally(inputState);
    setGeneratedPrompt(isExpanding ? `${currentPrompt}\n\n${base}` : base);
    setAiPowered(false);
    setIsGenerating(false);
  };

  const handleRefinement = async (instruction: string) => {
    setIsGenerating(true);

    if (agentId) {
      const prompt = `${instruction}\n\nSystem prompt to refine:\n${generatedPrompt}`;
      const llmResult = await callLlmForPrompt(agentId, prompt);
      if (llmResult) {
        setGeneratedPrompt(llmResult);
        setIsGenerating(false);
        setAiPowered(true);
        return;
      }
    }

    // Fallback: apply simple local transformations
    let refined = generatedPrompt;
    if (instruction.includes("concise")) {
      const sentences = refined.split(". ");
      refined = sentences.slice(0, Math.ceil(sentences.length * 0.6)).join(". ");
      if (!refined.endsWith(".")) refined += ".";
    } else if (instruction.includes("Expand")) {
      refined += "\n\nBe specific when discussing features and pricing. Reference the caller's industry when possible. Ask clarifying questions to better understand their use case before making recommendations.";
    } else if (instruction.includes("natural")) {
      refined = refined
        .replace(/Maintain a /g, "Keep a ")
        .replace(/Your primary goal is to /g, "Focus on ")
        .replace(/responsible for /g, "helping with ");
    }
    setGeneratedPrompt(refined);
    setAiPowered(false);
    setIsGenerating(false);
  };

  return (
    <div className="border-t border-border-soft bg-surface-subtle/30">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-foreground/[0.06] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-text-strong" />
          </div>
          <div>
            <h3 className="font-display text-[0.98rem] font-semibold text-text-strong tracking-[-0.01em]">
              {isExpanding ? "Improve prompt" : "Generate prompt"}
            </h3>
            <p className="font-body text-[0.77rem] text-text-subtle">
              {isExpanding ? "Expand and refine your existing draft" : "Describe your agent and we'll write the first draft"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-md hover:bg-surface-panel transition-colors text-text-subtle"
          >
            {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-surface-panel transition-colors text-text-subtle"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {phase === "input" ? (
        <div className={`px-6 py-5 ${expanded ? "max-h-none" : "max-h-[460px] overflow-y-auto"}`}>
          {isExpanding && (
            <div className="mb-5 p-3.5 rounded-lg bg-surface-panel border border-border-soft">
              <div className="font-body text-[0.82rem] text-text-subtle uppercase tracking-[0.1em] mb-1.5">Current draft</div>
              <p className="font-body text-[0.87rem] text-text-body leading-relaxed line-clamp-3">{currentPrompt}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="space-y-1.5">
              <Label className="font-body text-[0.89rem] text-text-subtle">Agent name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Inbound Sales"
                className="h-9 rounded-lg border-border-soft bg-surface-panel font-body text-[1.02rem]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-[0.89rem] text-text-subtle">Tone</Label>
              <div className="flex flex-wrap gap-1.5">
                {toneOptions.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(tone === t ? "" : t)}
                    className={`px-2.5 py-1 rounded-md font-body text-[0.89rem] border transition-all duration-150 ${
                      tone === t
                        ? "border-foreground bg-foreground text-primary-foreground"
                        : "border-border-soft bg-surface-panel text-text-body hover:border-foreground/20"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-5">
            <div className="space-y-1.5">
              <Label className="font-body text-[0.89rem] text-text-subtle">What does this agent do?</Label>
              <Input
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Qualifies inbound leads and books demos"
                className="h-9 rounded-lg border-border-soft bg-surface-panel font-body text-[1.02rem]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-[0.89rem] text-text-subtle">Primary goal</Label>
              <Input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Qualify leads and schedule a demo call"
                className="h-9 rounded-lg border-border-soft bg-surface-panel font-body text-[1.02rem]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-[0.89rem] text-text-subtle">Must-do instructions</Label>
              <textarea
                value={mustDo}
                onChange={(e) => setMustDo(e.target.value)}
                placeholder={"Always greet by name\nConfirm contact details\nOffer a callback option"}
                rows={3}
                className="w-full rounded-lg border border-border-soft bg-surface-panel px-3 py-2 font-body text-[1.02rem] text-text-strong placeholder:text-text-subtle/50 focus:outline-none focus:ring-1 focus:ring-text-strong/10 transition-shadow resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-[0.89rem] text-text-subtle">Things to avoid</Label>
              <textarea
                value={avoid}
                onChange={(e) => setAvoid(e.target.value)}
                placeholder={"Don't discuss competitor pricing\nDon't make promises about delivery dates"}
                rows={2}
                className="w-full rounded-lg border border-border-soft bg-surface-panel px-3 py-2 font-body text-[1.02rem] text-text-strong placeholder:text-text-subtle/50 focus:outline-none focus:ring-1 focus:ring-text-strong/10 transition-shadow resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-[0.89rem] text-text-subtle">Escalation / transfer rules</Label>
              <Input
                value={escalation}
                onChange={(e) => setEscalation(e.target.value)}
                placeholder="e.g. Transfer to a human if the caller mentions legal issues"
                className="h-9 rounded-lg border-border-soft bg-surface-panel font-body text-[1.02rem]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-[0.89rem] text-text-subtle">
                Additional notes
                <span className="ml-1 text-text-subtle/50 normal-case tracking-normal">(optional)</span>
              </Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. This agent handles healthcare clients specifically"
                className="h-9 rounded-lg border-border-soft bg-surface-panel font-body text-[1.02rem]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={onClose} className="font-body text-[0.87rem] text-text-subtle">
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!purpose && !goal)}
              className="bg-foreground text-primary-foreground hover:bg-foreground/90 font-display font-medium tracking-[-0.01em] text-[0.89rem] h-9 rounded-lg px-5 gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-background rounded-full animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {isExpanding ? "Expand draft" : "Generate prompt"}
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* Result phase */
        <div className={`px-6 py-5 ${expanded ? "max-h-none" : "max-h-[520px] overflow-y-auto"}`}>
          {/* AI badge */}
          {aiPowered && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-0.5">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span className="font-body text-[0.82rem] font-medium text-emerald-700">AI-generated</span>
              </div>
            </div>
          )}
          {/* Refinement chips */}
          <div className="flex items-center gap-2 mb-4">
            <span className="font-body text-[0.82rem] text-text-subtle uppercase tracking-[0.1em]">Refine</span>
            <div className="flex gap-1.5">
              {refinementActions.map((action) => (
                <button
                  key={action.instruction}
                  onClick={() => handleRefinement(action.instruction)}
                  disabled={isGenerating}
                  className="px-2.5 py-1 rounded-md border border-border-soft bg-surface-panel font-body text-[0.89rem] text-text-body hover:border-foreground/15 hover:text-text-strong transition-all disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generated prompt */}
          <div className="relative mb-5">
            {isGenerating && (
              <div className="absolute inset-0 bg-surface-panel/60 rounded-lg flex items-center justify-center z-10">
                <span className="w-5 h-5 border-2 border-text-subtle/30 border-t-text-strong rounded-full animate-spin" />
              </div>
            )}
            <textarea
              value={generatedPrompt}
              onChange={(e) => setGeneratedPrompt(e.target.value)}
              rows={12}
              className="w-full rounded-lg border border-border-soft bg-surface-panel px-4 py-3.5 font-body text-[1.02rem] text-text-body leading-[1.75] placeholder:text-text-subtle/50 focus:outline-none focus:ring-1 focus:ring-text-strong/10 transition-shadow resize-y"
            />
            <div className="absolute bottom-3 right-3 font-mono text-[0.77rem] text-text-subtle/40">
              {generatedPrompt.length} chars
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPhase("input")}
              className="font-body text-[0.87rem] text-text-subtle hover:text-text-body transition-colors flex items-center gap-1"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
              Back to inputs
            </button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="font-body text-[0.87rem] text-text-subtle gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Regenerate
              </Button>
              <Button
                onClick={() => onApply(generatedPrompt)}
                className="bg-foreground text-primary-foreground hover:bg-foreground/90 font-display font-medium tracking-[-0.01em] text-[0.89rem] h-9 rounded-lg px-5"
              >
                Apply to prompt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptComposer;
