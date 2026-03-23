import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Bot, Mic, Settings, Zap, Shield, Clock } from "lucide-react";

export const metadata = {
  title: "AI Voice Agents | Yapsolutely",
  description: "Deploy AI-powered phone agents that handle real inbound calls with natural conversation, custom instructions, and full autonomy.",
};

const benefits = [
  {
    icon: Bot,
    title: "Custom personality and behavior",
    description: "Define your agent's name, role, greeting, and conversation style. Every agent is purpose-built for your use case, from front desk reception to appointment scheduling.",
  },
  {
    icon: Mic,
    title: "Natural, human-like voice",
    description: "Powered by state-of-the-art text-to-speech models that produce clear, warm, professional audio. Callers don't feel like they're talking to a machine.",
  },
  {
    icon: Settings,
    title: "Configurable instructions",
    description: "Write system prompts that control exactly how your agent responds. Set guardrails, define topics to avoid, and specify escalation triggers for edge cases.",
  },
  {
    icon: Zap,
    title: "Sub-second response time",
    description: "Streaming speech-to-text, LLM inference, and text-to-speech run in parallel to minimize latency. Your agent responds before the silence gets awkward.",
  },
  {
    icon: Shield,
    title: "Interruption handling",
    description: "When callers talk over the agent, the system detects the barge-in instantly and adapts the conversation. No robotic monologues that ignore the caller.",
  },
  {
    icon: Clock,
    title: "Always available",
    description: "Your agents don't take breaks, call in sick, or miss calls. 24/7 coverage without staffing costs, with consistent quality on every single call.",
  },
];

const steps = [
  { step: "01", title: "Create an agent", description: "Give it a name, role description, and system prompt that defines how it should behave on calls." },
  { step: "02", title: "Configure the voice", description: "Choose a voice model that matches your brand. Professional, warm, energetic — pick the tone that fits." },
  { step: "03", title: "Assign a phone number", description: "Connect a dedicated phone number to your agent. Inbound calls to that number are automatically routed." },
  { step: "04", title: "Go live", description: "Your agent starts taking real calls immediately. Monitor performance, review transcripts, and iterate." },
];

export default function VoiceAgentsPage() {
  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <div className="mb-20 sm:mb-28">
          <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Feature</span>
          <h1 className="font-display text-[2rem] sm:text-[3.25rem] font-semibold tracking-[-0.03em] text-foreground mb-6 leading-[1.08]">
            AI Voice Agents that
            <br className="hidden sm:block" />
            handle real phone calls
          </h1>
          <p className="font-body text-[1rem] sm:text-[1.1rem] text-text-subtle max-w-2xl leading-[1.75] mb-8">
            Build custom AI agents that answer inbound calls, follow your instructions, and handle conversations autonomously. No scripts. No hold music. Just intelligent, natural conversation — every time someone calls.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
              <Link href="/sign-up">Start building <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button variant="ghost" size="lg" className="font-body text-[0.95rem] text-text-subtle" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            Why teams choose Yapsolutely agents
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

        {/* How it works */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            Live in four steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {steps.map((s) => (
              <div key={s.step} className="bg-surface-elevated rounded-2xl p-7 border border-border-soft/20">
                <span className="font-mono text-xs text-text-subtle/40 block mb-3">{s.step}</span>
                <h3 className="font-display text-[1rem] font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="font-body text-[0.85rem] text-text-subtle leading-[1.7]">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-dark rounded-3xl p-10 sm:p-14 text-center mb-8">
          <h2 className="font-display text-[1.5rem] sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-surface-dark-foreground mb-4 leading-[1.1]">
            Ready to deploy your first agent?
          </h2>
          <p className="font-body text-[0.95rem] text-surface-dark-foreground/60 max-w-lg mx-auto mb-8 leading-[1.7]">
            Create an account, configure your agent, and start taking real calls. Setup takes minutes, not weeks.
          </p>
          <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
            <Link href="/sign-up">Get started free <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </PublicPageShell>
  );
}
