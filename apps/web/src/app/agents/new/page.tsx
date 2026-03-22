import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { AgentPromptField } from "@/components/agent-prompt-field";
import { FormSubmitButton } from "@/components/form-submit-button";
import { createAgentAction } from "@/app/_actions/agents";
import { requireSession } from "@/lib/auth";

type NewAgentPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewAgentPage({ searchParams }: NewAgentPageProps) {
  const session = await requireSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const creationChecklist = [
    {
      label: "Name the role clearly",
      detail: "If the title feels fuzzy, the prompt usually will too. Name the real job this agent owns.",
    },
    {
      label: "Give the runtime a real operating brief",
      detail: "A strong system prompt is still the core of whether the agent sounds intentional or improvised.",
    },
    {
      label: "Decide the first impression",
      detail: "Add a first message and voice so the opening turn feels designed instead of accidental.",
    },
    {
      label: "Save draft first, route later",
      detail: "The draft can be refined in build and wired up in deploy once number routing is ready.",
    },
  ];

  const startingTracks = [
    {
      title: "Front desk",
      body: "Route callers cleanly, gather intent, and capture fallback messages before a human handoff.",
      cues: "Best for reception, triage, intake, and basic routing.",
    },
    {
      title: "Sales qualifier",
      body: "Vet inbound demand, ask a few sharp questions, and get serious prospects to the right rep.",
      cues: "Best for demo qualification, lead routing, and simple follow-up capture.",
    },
    {
      title: "Support triage",
      body: "Resolve the easy stuff fast, collect context, and escalate with less chaos.",
      cues: "Best for issue intake, FAQs, and routing customers into the right queue.",
    },
  ];

  return (
    <ConsoleShell
      section="agents"
      eyebrow="Create agent"
      title="Shape the next voice agent."
      description="Create the operational identity, generate a strong first prompt, and save a real draft agent record the rest of the product can route to."
      userEmail={session.email}
    >
      {resolvedSearchParams?.error ? (
        <div className="mb-5 rounded-[18px] border border-[color:rgba(160,91,65,0.22)] bg-[var(--warning-soft)] px-5 py-4 text-sm text-[#8d6336]">
          {resolvedSearchParams.error === "missing-required-fields"
            ? "Agent name and system prompt are required."
            : "Database is not configured yet, so the agent could not be saved."}
        </div>
      ) : null}

      <div className="mb-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
              Create workspace
            </div>
            <div className="inline-flex rounded-full bg-[color:rgba(238,189,142,0.16)] px-3 py-1 text-[0.68rem] font-medium text-[#f1d4b4]">
              Starts in draft · save first, tune fast
            </div>
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.5rem] font-semibold tracking-[-0.04em] sm:text-[1.82rem]">
                Build the next agent like a real operator asset, not a one-off prompt experiment.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                Start with the operating basics, generate a prompt if you want momentum, then save a draft that can move straight into build, deploy, test, and monitor. The goal is not just “another agent” — it is a usable new member of the roster.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/agents"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Back to roster
                </Link>
                <Link
                  href="/numbers"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Review routing later
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Default state", value: "DRAFT" },
                { label: "Routing", value: "Assign later" },
                { label: "Prompt", value: "Manual or AI" },
                { label: "Write path", value: "Server action" },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(229,226,225,0.48)]">{item.label}</div>
                  <div className="mt-2 text-[0.82rem] font-medium text-[var(--surface-dark-foreground)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Drafting checklist</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                The minimum ingredients for a draft that is actually worth saving.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              4 steps
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {creationChecklist.map((item, index) => (
              <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--text-strong)] text-[0.72rem] font-semibold text-white">
                    {index + 1}
                  </div>
                  <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{item.label}</div>
                </div>
                <p className="mt-3 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <form action={createAgentAction} className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.95fr)]">
        <div className="space-y-5">
          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Identity</h3>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-[0.72rem] text-[var(--text-subtle)]">Agent name</span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Front desk concierge"
                  className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[0.72rem] text-[var(--text-subtle)]">Role or use case</span>
                <input
                  type="text"
                  name="description"
                  placeholder="Handles inbound qualification and appointment triage"
                  className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                />
              </label>
            </div>
          </section>

          <AgentPromptField initialPrompt="" required />

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Voice and caller experience</h3>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-[0.72rem] text-[var(--text-subtle)]">First message</span>
                <input
                  type="text"
                  name="firstMessage"
                  placeholder="Thanks for calling Yapsolutely — how can I help today?"
                  className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[0.72rem] text-[var(--text-subtle)]">Voice model</span>
                <input
                  type="text"
                  name="voiceModel"
                  placeholder="aura-2-thalia-en"
                  className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[0.72rem] text-[var(--text-subtle)]">Transfer number</span>
                <input
                  type="text"
                  name="transferNumber"
                  placeholder="+10000000001"
                  className="h-11 w-full rounded-[16px] border border-[var(--border-soft)] bg-[var(--canvas)] px-4 text-[0.84rem] text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.7)] focus:border-[color:rgba(22,24,29,0.18)] focus:ring-2 focus:ring-[color:rgba(22,24,29,0.06)]"
                />
              </label>
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-5 py-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[0.82rem] leading-6 text-[var(--text-body)]">
              If the database is still using placeholder credentials, the form will safely return with a database-unavailable hint instead of exploding theatrically.
            </p>
            <FormSubmitButton
              label="Save draft agent"
              pendingLabel="Saving draft…"
              className="rounded-[16px] bg-[var(--text-strong)] px-4 py-2.5 text-[0.8rem] font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)] disabled:cursor-wait disabled:opacity-75"
            />
          </div>
        </div>

        <div className="space-y-5">
          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">What happens on save</h3>
            </div>
            <div className="space-y-3 p-5">
              {[
                "A user-backed agent record is created in Prisma.",
                "The slug is normalized automatically and kept unique.",
                "The draft starts in DRAFT status until you activate it.",
                "Voice model falls back to the configured default when empty.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-3 text-[0.78rem] leading-6 text-[var(--text-body)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-[0.95rem] font-semibold tracking-[-0.01em] text-[var(--text-strong)]">Suggested starting points</h3>
            </div>
            <div className="space-y-3 p-5">
              {startingTracks.map((track) => (
                <div
                  key={track.title}
                  className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4"
                >
                  <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{track.title}</div>
                  <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-subtle)]">{track.body}</p>
                  <p className="mt-2 text-[0.72rem] leading-6 text-[var(--text-body)]">{track.cues}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] bg-[var(--surface-dark)] p-5 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)]">
            <div className="text-[0.64rem] uppercase tracking-[0.16em] text-[color:rgba(229,226,225,0.56)]">After save</div>
            <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.03em]">
              The draft is just the start of the workspace, not the finish line.
            </h3>
            <p className="mt-3 text-[0.82rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
              After saving, head into build to tighten the prompt, deploy to connect routing, test to rehearse the call path, and monitor once live proof begins landing. That sequence is where the product now shines.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5 text-sm">
              <Link href="/agents" className="rounded-[16px] bg-white px-4 py-3 text-[0.78rem] font-medium text-[var(--text-strong)] transition hover:opacity-90">
                View roster
              </Link>
              <Link href="/numbers" className="rounded-[16px] border border-white/12 bg-white/5 px-4 py-3 text-[0.78rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10">
                Open routing workspace
              </Link>
            </div>
          </section>
        </div>
      </form>
    </ConsoleShell>
  );
}
