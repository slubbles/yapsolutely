import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Phone, Globe, Link2, BarChart3, Shield, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Phone Numbers | Yapsolutely",
  description: "Provision dedicated phone numbers and assign them to AI agents. Route every inbound call to the right agent automatically.",
};

const benefits = [
  {
    icon: Phone,
    title: "Dedicated numbers per agent",
    description: "Each agent gets its own phone number. Callers always reach the right agent without menu trees or hold queues.",
  },
  {
    icon: Globe,
    title: "Local and toll-free options",
    description: "Provision numbers that match your area code or go with toll-free for nationwide presence. Build trust before the call even connects.",
  },
  {
    icon: Link2,
    title: "Instant agent assignment",
    description: "Assign a number to an agent in one click. Change the assignment anytime — zero downtime, zero configuration headaches.",
  },
  {
    icon: BarChart3,
    title: "Per-number call tracking",
    description: "See call volume, duration, and resolution rates broken down by number. Understand which lines are busiest and where to optimize.",
  },
  {
    icon: Shield,
    title: "Verified and compliant",
    description: "All numbers are provisioned through verified carriers. No gray-market routing — real numbers with real caller ID presentation.",
  },
  {
    icon: RefreshCw,
    title: "Reassign without disruption",
    description: "Swap an agent behind a number without changing the number itself. Perfect for A/B testing agent configurations or seasonal updates.",
  },
];

const steps = [
  { step: "01", title: "Provision a number", description: "Choose a local or toll-free number from available inventory. It's active the moment you provision it." },
  { step: "02", title: "Assign to an agent", description: "Link the number to any agent you've created. The assignment takes effect immediately." },
  { step: "03", title: "Start receiving calls", description: "When someone dials that number, your agent picks up and begins the conversation automatically." },
];

export default function PhoneNumbersPage() {
  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <div className="mb-20 sm:mb-28">
          <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Feature</span>
          <h1 className="font-display text-[2rem] sm:text-[3.25rem] font-semibold tracking-[-0.03em] text-foreground mb-6 leading-[1.08]">
            One number, one agent.
            <br className="hidden sm:block" />
            Always connected.
          </h1>
          <p className="font-body text-[1rem] sm:text-[1.1rem] text-text-subtle max-w-2xl leading-[1.75] mb-8">
            Provision dedicated phone numbers and assign them to the exact AI agent that should answer. Every call is routed instantly — no IVR menus, no transfers, no waiting.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
              <Link href="/sign-up">Get a number <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button variant="ghost" size="lg" className="font-body text-[0.95rem] text-text-subtle" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            Phone numbers that work for you
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
            Three steps to a live number
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
            Get your agent on a real phone line
          </h2>
          <p className="font-body text-[0.95rem] text-surface-dark-foreground/60 max-w-lg mx-auto mb-8 leading-[1.7]">
            Provision a number, assign your agent, and start receiving calls. The whole process takes less than five minutes.
          </p>
          <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
            <Link href="/sign-up">Get started free <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </PublicPageShell>
  );
}
