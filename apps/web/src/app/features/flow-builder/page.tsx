import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Workflow, GripVertical, Layers, Sparkles, Save, Repeat } from "lucide-react";

export const metadata = {
  title: "Flow Builder | Yapsolutely",
  description: "Design agent conversation flows visually. Drag and drop blocks, define logic, and generate system prompts automatically.",
};

const benefits = [
  {
    icon: GripVertical,
    title: "Drag-and-drop blocks",
    description: "Build conversation flows by dragging blocks into position. Reorder steps, add branches, and structure your agent's logic without writing a single line of code.",
  },
  {
    icon: Layers,
    title: "7 block types",
    description: "Greet, Qualify, FAQ, Book Appointment, Transfer to Human, Close Call, and Custom Instruction blocks cover the most common phone conversation patterns.",
  },
  {
    icon: Sparkles,
    title: "AI prompt generation",
    description: "Turn your visual flow into a production-ready system prompt with one click. The AI reads your blocks, understands the logic, and writes the prompt for you.",
  },
  {
    icon: Save,
    title: "Apply to agent instantly",
    description: "Generated prompts write directly back to your agent configuration. No copy-pasting between tools. Flow to prompt to live agent in seconds.",
  },
  {
    icon: Repeat,
    title: "Iterate without risk",
    description: "Change your flow, regenerate the prompt, and preview before applying. Non-destructive workflow means you can experiment safely.",
  },
  {
    icon: Workflow,
    title: "Visual conversation map",
    description: "See your agent's entire conversation logic at a glance. Flows make it easy for non-technical team members to understand and contribute to agent design.",
  },
];

const blockTypes = [
  { name: "Greet", description: "Set the opening message and agent introduction the caller hears first." },
  { name: "Qualify", description: "Ask screening questions to understand the caller's intent and collect key details." },
  { name: "FAQ", description: "Define common questions and answers so your agent handles routine inquiries confidently." },
  { name: "Book Appointment", description: "Capture scheduling details like service type, preferred date, and availability." },
  { name: "Transfer", description: "Define when and how to hand off to a human agent with a warm transfer message." },
  { name: "Close Call", description: "Summarize the conversation, confirm next steps, and end with a professional sign-off." },
  { name: "Custom", description: "Add any freeform instruction for edge cases or specialized behavior." },
];

export default function FlowBuilderPage() {
  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <div className="mb-20 sm:mb-28">
          <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Feature</span>
          <h1 className="font-display text-[2rem] sm:text-[3.25rem] font-semibold tracking-[-0.03em] text-foreground mb-6 leading-[1.08]">
            Design conversations
            <br className="hidden sm:block" />
            visually
          </h1>
          <p className="font-body text-[1rem] sm:text-[1.1rem] text-text-subtle max-w-2xl leading-[1.75] mb-8">
            The flow builder lets you design agent behavior by arranging conversation blocks in order. Define greetings, qualification steps, FAQ handling, and escalation rules — then generate a production-ready system prompt with one click.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
              <Link href="/sign-up">Try the flow builder <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button variant="ghost" size="lg" className="font-body text-[0.95rem] text-text-subtle" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            No-code agent design
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

        {/* Block types */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            Seven blocks, infinite possibilities
          </h2>
          <div className="space-y-3">
            {blockTypes.map((bt, i) => (
              <div key={bt.name} className="bg-surface-elevated rounded-xl p-5 sm:p-6 border border-border-soft/20 flex items-start gap-4">
                <span className="font-mono text-xs text-text-subtle/40 mt-0.5 shrink-0 w-6">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-[0.95rem] font-semibold text-foreground mb-1">{bt.name}</h3>
                  <p className="font-body text-[0.82rem] text-text-subtle leading-[1.7]">{bt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-dark rounded-3xl p-10 sm:p-14 text-center mb-8">
          <h2 className="font-display text-[1.5rem] sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-surface-dark-foreground mb-4 leading-[1.1]">
            Build your first flow in minutes
          </h2>
          <p className="font-body text-[0.95rem] text-surface-dark-foreground/60 max-w-lg mx-auto mb-8 leading-[1.7]">
            Drag blocks, fill in the details, and let AI generate your system prompt. No prompt engineering experience required.
          </p>
          <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
            <Link href="/sign-up">Get started free <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </PublicPageShell>
  );
}
