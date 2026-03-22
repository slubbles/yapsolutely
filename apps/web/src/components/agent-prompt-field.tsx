"use client";

import { useMemo, useState } from "react";

type AgentPromptFieldProps = {
  initialPrompt?: string | null;
  agentName?: string;
  required?: boolean;
};

type ComposerInputs = {
  name: string;
  purpose: string;
  tone: string;
  goal: string;
  mustDo: string;
  avoid: string;
  escalation: string;
  notes: string;
};

const toneOptions = ["Professional", "Warm", "Direct", "Empathetic", "Casual", "Formal"];

const refinementActions = [
  { label: "Make it shorter", instruction: "shorter" },
  { label: "More detailed", instruction: "detailed" },
  { label: "Sound more natural", instruction: "natural" },
];

function buildPrompt(inputs: ComposerInputs) {
  const parts = [
    `You are ${inputs.name || "a voice agent"}${inputs.purpose ? `, responsible for ${inputs.purpose.toLowerCase()}` : ""}.`,
    inputs.goal ? `\nYour primary goal is to ${inputs.goal.toLowerCase()}.` : "",
    inputs.tone ? `\nMaintain a ${inputs.tone.toLowerCase()} tone throughout the conversation.` : "",
    inputs.mustDo
      ? `\nKey instructions:\n${inputs.mustDo
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `- ${line}`)
          .join("\n")}`
      : "",
    inputs.avoid
      ? `\nThings to avoid:\n${inputs.avoid
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `- ${line}`)
          .join("\n")}`
      : "",
    inputs.escalation ? `\nEscalation rules: ${inputs.escalation}` : "",
    inputs.notes ? `\nAdditional context: ${inputs.notes}` : "",
    "\nAlways confirm next steps before ending the call. If you are unsure about something, acknowledge the caller's question and offer to connect them with the appropriate team.",
  ];

  return parts.filter(Boolean).join("");
}

export function AgentPromptField({
  initialPrompt,
  agentName = "",
  required = false,
}: AgentPromptFieldProps) {
  const [prompt, setPrompt] = useState(initialPrompt ?? "");
  const [showComposer, setShowComposer] = useState(false);
  const [phase, setPhase] = useState<"input" | "result">("input");
  const [expanded, setExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const [name, setName] = useState(agentName);
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("");
  const [goal, setGoal] = useState("");
  const [mustDo, setMustDo] = useState("");
  const [avoid, setAvoid] = useState("");
  const [escalation, setEscalation] = useState("");
  const [notes, setNotes] = useState("");

  const hasPrompt = prompt.trim().length > 0;
  const isExpanding = prompt.trim().length > 0;

  const characterLabel = useMemo(() => `${prompt.length} characters`, [prompt]);

  function openComposer() {
    setShowComposer(true);
    setPhase("input");
    setGeneratedPrompt("");
  }

  function closeComposer() {
    setShowComposer(false);
    setPhase("input");
  }

  function handleGenerate() {
    setIsGenerating(true);

    window.setTimeout(() => {
      const basePrompt = buildPrompt({
        name,
        purpose,
        tone,
        goal,
        mustDo,
        avoid,
        escalation,
        notes,
      });

      const nextPrompt = isExpanding ? `${prompt}\n\n--- Expanded ---\n\n${basePrompt}` : basePrompt;
      setGeneratedPrompt(nextPrompt);
      setPhase("result");
      setIsGenerating(false);
    }, 900);
  }

  function handleRegenerate() {
    setIsGenerating(true);

    window.setTimeout(() => {
      const basePrompt = buildPrompt({
        name,
        purpose,
        tone,
        goal,
        mustDo,
        avoid,
        escalation,
        notes,
      });

      setGeneratedPrompt(isExpanding ? `${prompt}\n\n${basePrompt}` : basePrompt);
      setIsGenerating(false);
    }, 700);
  }

  function handleRefinement(type: string) {
    setIsGenerating(true);

    window.setTimeout(() => {
      let refined = generatedPrompt;

      if (type === "shorter") {
        const sentences = refined.split(". ");
        refined = sentences.slice(0, Math.max(1, Math.ceil(sentences.length * 0.6))).join(". ");
        if (refined && !refined.endsWith(".")) {
          refined += ".";
        }
      } else if (type === "detailed") {
        refined +=
          "\n\nBe specific when discussing next steps, confirm important facts back to the caller, and ask clarifying questions before making recommendations.";
      } else if (type === "natural") {
        refined = refined
          .replace(/Maintain a /g, "Keep a ")
          .replace(/Your primary goal is to /g, "Focus on ")
          .replace(/responsible for /g, "helping with ");
      }

      setGeneratedPrompt(refined);
      setIsGenerating(false);
    }, 650);
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
      <div className="flex flex-col gap-4 border-b border-[var(--border-soft)] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">
            System prompt
          </h2>
          <p className="mt-1 text-[0.75rem] leading-6 text-[var(--text-subtle)]">
            The instruction set that shapes tone, constraints, escalation behavior, and what the caller hears on every turn.
          </p>
        </div>

        {!showComposer ? (
          <button
            type="button"
            onClick={openComposer}
            className={`inline-flex items-center gap-2 rounded-[16px] px-4 py-2.5 text-[0.78rem] transition ${
              hasPrompt
                ? "border border-[var(--border-soft)] bg-[var(--surface-subtle)] text-[var(--text-body)] hover:text-[var(--text-strong)]"
                : "bg-[var(--text-strong)] text-white hover:bg-[color:rgba(22,24,29,0.92)]"
            }`}
          >
            <span aria-hidden="true">{hasPrompt ? "✦" : "✦"}</span>
            {hasPrompt ? "Improve with AI" : "Generate with AI"}
          </button>
        ) : null}
      </div>

      <div className="px-5 py-5">
        {!hasPrompt && !showComposer ? (
          <div className="rounded-[20px] border border-dashed border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-5 py-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[14px] bg-[color:rgba(22,24,29,0.05)]">
              <span aria-hidden="true" className="text-lg text-[var(--text-subtle)]">✦</span>
            </div>
            <p className="mt-4 text-[0.95rem] font-semibold text-[var(--text-strong)]">No prompt yet</p>
            <p className="mx-auto mt-2 max-w-md text-[0.8rem] leading-6 text-[var(--text-subtle)]">
              Write manually or generate a strong first draft from a few operational cues. Tiny robot ghostwriter, minus the haunted house.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={openComposer}
                className="inline-flex items-center gap-2 rounded-[16px] bg-[var(--text-strong)] px-4 py-2.5 text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
              >
                <span aria-hidden="true">✦</span>
                Generate with AI
              </button>
              <button
                type="button"
                onClick={() => {
                  const element = document.getElementById("agent-system-prompt");
                  element?.focus();
                }}
                className="text-[0.8rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]"
              >
                or write manually
              </button>
            </div>
          </div>
        ) : null}

        <textarea
          id="agent-system-prompt"
          name="systemPrompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          required={required}
          rows={hasPrompt ? 12 : 5}
          placeholder="You are a voice agent for..."
          className={`w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 py-3.5 text-[0.84rem] leading-[1.75] text-[var(--text-body)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.65)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)] ${
            !hasPrompt && !showComposer ? "sr-only" : ""
          }`}
        />

        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-[0.68rem] text-[var(--text-subtle)]">Prompt stored directly on the agent record.</span>
          <span className="font-mono text-[0.62rem] text-[color:rgba(124,129,139,0.7)]">{characterLabel}</span>
        </div>
      </div>

      {showComposer ? (
        <div className="border-t border-[var(--border-soft)] bg-[var(--surface-subtle)]/45">
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-[8px] bg-[color:rgba(22,24,29,0.06)]">
                <span aria-hidden="true" className="text-[0.85rem] text-[var(--text-strong)]">✦</span>
              </div>
              <div>
                <h3 className="text-[0.88rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">
                  {isExpanding ? "Improve prompt" : "Generate prompt"}
                </h3>
                <p className="text-[0.7rem] text-[var(--text-subtle)]">
                  {isExpanding
                    ? "Refine the current draft with more structure."
                    : "Describe the agent and draft the first version."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setExpanded((current) => !current)}
                className="rounded-[10px] p-1.5 text-[var(--text-subtle)] transition hover:bg-[var(--surface-panel)]"
              >
                <span aria-hidden="true">{expanded ? "−" : "+"}</span>
              </button>
              <button
                type="button"
                onClick={closeComposer}
                className="rounded-[10px] p-1.5 text-[var(--text-subtle)] transition hover:bg-[var(--surface-panel)]"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>

          {phase === "input" ? (
            <div className={`px-5 py-5 ${expanded ? "max-h-none" : "max-h-[460px] overflow-y-auto"}`}>
              {isExpanding ? (
                <div className="mb-5 rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4">
                  <div className="mb-1.5 text-[0.65rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                    Current draft
                  </div>
                  <p className="line-clamp-4 text-[0.78rem] leading-6 text-[var(--text-body)]">{prompt}</p>
                </div>
              ) : null}

              <div className="mb-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-[0.72rem] text-[var(--text-subtle)]">Agent name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Inbound Sales"
                    className="h-10 w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 text-[0.82rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.65)] focus:border-[color:rgba(22,24,29,0.18)]"
                  />
                </label>

                <div className="space-y-1.5">
                  <span className="text-[0.72rem] text-[var(--text-subtle)]">Tone</span>
                  <div className="flex flex-wrap gap-1.5">
                    {toneOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTone((current) => (current === option ? "" : option))}
                        className={`rounded-[10px] border px-2.5 py-1.5 text-[0.72rem] transition ${
                          tone === option
                            ? "border-[var(--text-strong)] bg-[var(--text-strong)] text-white"
                            : "border-[var(--border-soft)] bg-[var(--surface-panel)] text-[var(--text-body)] hover:border-[color:rgba(22,24,29,0.18)]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="space-y-1.5">
                  <span className="text-[0.72rem] text-[var(--text-subtle)]">What does this agent do?</span>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(event) => setPurpose(event.target.value)}
                    placeholder="e.g. Qualifies inbound leads and books demos"
                    className="h-10 w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 text-[0.82rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.65)] focus:border-[color:rgba(22,24,29,0.18)]"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[0.72rem] text-[var(--text-subtle)]">Primary goal</span>
                  <input
                    type="text"
                    value={goal}
                    onChange={(event) => setGoal(event.target.value)}
                    placeholder="e.g. Qualify leads and schedule a demo"
                    className="h-10 w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 text-[0.82rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.65)] focus:border-[color:rgba(22,24,29,0.18)]"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[0.72rem] text-[var(--text-subtle)]">Must-do instructions</span>
                  <textarea
                    value={mustDo}
                    onChange={(event) => setMustDo(event.target.value)}
                    rows={3}
                    placeholder={"Always greet by name\nConfirm contact details\nOffer a callback option"}
                    className="w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2.5 text-[0.82rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.65)] focus:border-[color:rgba(22,24,29,0.18)]"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[0.72rem] text-[var(--text-subtle)]">Things to avoid</span>
                  <textarea
                    value={avoid}
                    onChange={(event) => setAvoid(event.target.value)}
                    rows={2}
                    placeholder={"Don't discuss competitor pricing\nDon't promise delivery dates"}
                    className="w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 py-2.5 text-[0.82rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.65)] focus:border-[color:rgba(22,24,29,0.18)]"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[0.72rem] text-[var(--text-subtle)]">Escalation or transfer rules</span>
                  <input
                    type="text"
                    value={escalation}
                    onChange={(event) => setEscalation(event.target.value)}
                    placeholder="e.g. Transfer to a human if the caller mentions legal issues"
                    className="h-10 w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 text-[0.82rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.65)] focus:border-[color:rgba(22,24,29,0.18)]"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[0.72rem] text-[var(--text-subtle)]">Additional notes</span>
                  <input
                    type="text"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="e.g. This agent handles healthcare callers specifically"
                    className="h-10 w-full rounded-[14px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-3 text-[0.82rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.65)] focus:border-[color:rgba(22,24,29,0.18)]"
                  />
                </label>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeComposer}
                  className="rounded-[12px] px-3 py-2 text-[0.78rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || (!purpose.trim() && !goal.trim())}
                  className="inline-flex items-center gap-2 rounded-[14px] bg-[var(--text-strong)] px-4 py-2.5 text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">✦</span>
                      {isExpanding ? "Expand draft" : "Generate prompt"}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className={`px-5 py-5 ${expanded ? "max-h-none" : "max-h-[520px] overflow-y-auto"}`}>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">Refine</span>
                {refinementActions.map((action) => (
                  <button
                    key={action.instruction}
                    type="button"
                    onClick={() => handleRefinement(action.instruction)}
                    disabled={isGenerating}
                    className="rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-2.5 py-1.5 text-[0.72rem] text-[var(--text-body)] transition hover:border-[color:rgba(22,24,29,0.18)] hover:text-[var(--text-strong)] disabled:opacity-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <div className="relative mb-5">
                {isGenerating ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[18px] bg-[color:rgba(244,241,235,0.7)]">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[color:rgba(124,129,139,0.3)] border-t-[var(--text-strong)]" />
                  </div>
                ) : null}

                <textarea
                  value={generatedPrompt}
                  onChange={(event) => setGeneratedPrompt(event.target.value)}
                  rows={12}
                  className="w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-4 py-3.5 text-[0.82rem] leading-[1.75] text-[var(--text-body)] outline-none transition focus:border-[color:rgba(22,24,29,0.18)]"
                />

                <div className="absolute bottom-3 right-3 font-mono text-[0.6rem] text-[color:rgba(124,129,139,0.6)]">
                  {generatedPrompt.length} chars
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPhase("input")}
                  className="inline-flex items-center gap-1 text-[0.78rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]"
                >
                  <span aria-hidden="true">←</span>
                  Back to inputs
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 rounded-[12px] px-3 py-2 text-[0.78rem] text-[var(--text-subtle)] transition hover:bg-[var(--surface-panel)] hover:text-[var(--text-strong)] disabled:opacity-50"
                  >
                    <span aria-hidden="true">↻</span>
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPrompt(generatedPrompt);
                      closeComposer();
                    }}
                    className="rounded-[14px] bg-[var(--text-strong)] px-4 py-2.5 text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
                  >
                    Apply to prompt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
