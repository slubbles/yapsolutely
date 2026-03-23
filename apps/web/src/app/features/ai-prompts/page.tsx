import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Brain, Wand2, RefreshCw, FileCode, Zap } from "lucide-react";

export const metadata = {
  title: "AI Prompt Generation | Yapsolutely",
  description: "Generate production-ready agent system prompts with AI. From flow blocks or natural language, get optimized prompts instantly.",
};

const benefits = [
  {
    icon: Sparkles,
    title: "One-click prompt generation",
    description: "Describe what your agent should do, or build a visual flow, and the AI writes a complete system prompt optimized for phone conversations.",
  },
  {
    icon: Brain,
    title: "Conversation-aware output",
    description: "Generated prompts are specifically tuned for voice interactions. Concise responses, natural phrasing, interruption handling, and turn-taking are built in.",
  },
  {
    icon: Wand2,
    title: "From flow blocks to prompt",
    description: "The flow builder feeds directly into prompt generation. Your visual conversation design becomes a structured system prompt without manual translation.",
  },
  {
    icon: RefreshCw,
    title: "Iterate rapidly",
    description: "Generate, review, tweak, regenerate. The cycle takes seconds, not hours. Test different approaches without writing prompts from scratch each time.",
  },
  {
    icon: FileCode,
    title: "Full prompt visibility",
    description: "You always see the generated prompt before it's applied. Edit it manually if you want, or apply it directly. No hidden layers between you and your agent's instructions.",
  },
  {
    icon: Zap,
    title: "Powered by Claude",
    description: "Prompt generation uses Anthropic's Claude for reliable, high-quality output. The same model that powers your agent's conversations also writes its instructions.",
  },
];

const examples = [
  {
    input: "Front desk reception for a dental clinic. Greet callers warmly, ask if they're new or existing patients, and help schedule appointments.",
    output: "A complete prompt with greeting script, patient classification logic, appointment booking flow, and professional closing.",
  },
  {
    input: "Sales qualification agent for a SaaS company. Ask about company size, current tools, and budget range. Transfer high-value leads to sales.",
    output: "A structured prompt with qualification questions, scoring criteria, transfer triggers, and objection handling guidelines.",
  },
  {
    input: "After-hours support line for a property management company. Handle maintenance requests, provide basic information, and escalate emergencies.",
    output: "A complete prompt with urgency triage, maintenance request capture, emergency escalation rules, and tenant-appropriate language.",
  },
];

export default function AIPromptsPage() {
  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <div className="mb-20 sm:mb-28">
          <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Feature</span>
          <h1 className="font-display text-[2rem] sm:text-[3.25rem] font-semibold tracking-[-0.03em] text-foreground mb-6 leading-[1.08]">
            Let AI write your
            <br className="hidden sm:block" />
            agent&apos;s instructions
          </h1>
          <p className="font-body text-[1rem] sm:text-[1.1rem] text-text-subtle max-w-2xl leading-[1.75] mb-8">
            Stop spending hours crafting system prompts. Describe what your agent should do — or design a visual flow — and let AI generate production-ready instructions optimized for phone conversations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
              <Link href="/sign-up">Try it now <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button variant="ghost" size="lg" className="font-body text-[0.95rem] text-text-subtle" asChild>
              <Link href="/features/flow-builder">See the flow builder</Link>
            </Button>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            Prompt engineering, automated
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-surface-elevated rounded-2xl p-6 border border-border-soft/20">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-text-body" />
                </div>
                <h3 className="font-display text-[1rem] font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="font-body text-[0.85rem] text-text-subtle leading-[1.7]">{b.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            See it in action
          </h2>
          <div className="space-y-5">
            {examples.map((ex, i) => (
              <div key={i} className="bg-surface-elevated rounded-2xl border border-border-soft/20 overflow-hidden">
                <div className="p-6 border-b border-border-soft/10">
                  <span className="font-mono text-[0.6rem] text-text-subtle/40 uppercase tracking-widest block mb-2">Input</span>
                  <p className="font-body text-[0.88rem] text-text-body leading-[1.7]">&ldquo;{ex.input}&rdquo;</p>
                </div>
                <div className="p-6 bg-surface-subtle/30">
                  <span className="font-mono text-[0.6rem] text-text-subtle/40 uppercase tracking-widest block mb-2">AI generates</span>
                  <p className="font-body text-[0.85rem] text-text-subtle leading-[1.7]">{ex.output}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-dark rounded-3xl p-10 sm:p-14 text-center mb-8">
          <h2 className="font-display text-[1.5rem] sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-surface-dark-foreground mb-4 leading-[1.1]">
            Your first prompt, generated in seconds
          </h2>
          <p className="font-body text-[0.95rem] text-surface-dark-foreground/60 max-w-lg mx-auto mb-8 leading-[1.7]">
            Describe your use case, hit generate, and get a production-ready system prompt. No prompt engineering experience needed.
          </p>
          <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
            <Link href="/sign-up">Get started free <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </PublicPageShell>
  );
}
