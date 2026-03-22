import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Target, Zap, Shield, Users } from "lucide-react";

export const metadata = {
  title: "About — Yapsolutely",
  description: "The story behind Yapsolutely — building the future of AI voice agents.",
};

const values = [
  {
    icon: Zap,
    title: "Speed to production",
    description: "We believe AI voice agents should go live in minutes, not months. Every design decision optimizes for getting your first agent on a real phone line as fast as possible.",
  },
  {
    icon: Shield,
    title: "Transparency by default",
    description: "Full transcripts. Complete call logs. No black boxes. You should always know exactly what your agents are saying and how they're performing.",
  },
  {
    icon: Target,
    title: "Operator confidence",
    description: "We build for the people running the system — not just the end callers. Dashboards, quality review, and monitoring tools that give you real-time control.",
  },
  {
    icon: Users,
    title: "Developer-first",
    description: "APIs, webhooks, and SDKs are first-class citizens. If you can do it in the dashboard, you can do it programmatically. No walled gardens.",
  },
];

export default function AboutPage() {
  return (
    <PublicPageShell>
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <div className="mb-16 sm:mb-24">
          <h1 className="font-display text-[2rem] sm:text-[3rem] font-semibold tracking-[-0.03em] text-foreground mb-5 leading-[1.08]">
            AI voice agents
            <br className="hidden sm:block" />
            for real business calls
          </h1>
          <p className="font-body text-[0.95rem] sm:text-[1.05rem] text-text-subtle max-w-2xl leading-[1.7] mb-4">
            Yapsolutely is a platform for building and deploying AI-powered phone agents that handle real inbound calls. We give businesses the tools to create agents that sound natural, follow instructions precisely, and handle conversations autonomously — while providing complete visibility through transcripts, call logs, and quality monitoring.
          </p>
          <p className="font-body text-[0.95rem] sm:text-[1.05rem] text-text-subtle max-w-2xl leading-[1.7]">
            We believe the future of business phone communication is intelligent, transparent, and always available. Our platform makes it possible for any team to deploy production-grade voice agents without building telephony infrastructure from scratch.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-surface-dark rounded-[1.5rem] sm:rounded-[2rem] p-8 sm:p-12 mb-16 sm:mb-24">
          <span className="font-body text-[0.6rem] text-surface-dark-foreground/20 uppercase tracking-[0.2em] block mb-5">Our mission</span>
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-surface-dark-foreground mb-4 leading-[1.1]">
            Make every inbound call an opportunity,
            <br className="hidden sm:block" />
            not a missed connection.
          </h2>
          <p className="font-body text-surface-dark-foreground/40 text-[0.9rem] max-w-2xl leading-[1.65]">
            Businesses lose customers every day to missed calls, hold times, and after-hours voicemails. Yapsolutely gives every business the ability to answer every call, 24/7, with an AI agent that understands context, follows your playbook, and hands off to humans when needed.
          </p>
        </div>

        {/* Values */}
        <div className="mb-16 sm:mb-24">
          <h2 className="font-display text-[1.25rem] sm:text-[1.5rem] font-semibold text-text-strong tracking-[-0.02em] mb-8">
            What we believe
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((value) => (
              <div key={value.title} className="bg-surface-panel rounded-2xl border border-border-soft/60 p-6">
                <div className="w-9 h-9 rounded-xl bg-foreground/[0.04] flex items-center justify-center mb-4">
                  <value.icon className="w-4 h-4 text-text-subtle" />
                </div>
                <h3 className="font-display text-[0.92rem] font-semibold text-text-strong tracking-[-0.01em] mb-1.5">
                  {value.title}
                </h3>
                <p className="font-body text-[0.78rem] text-text-subtle leading-[1.65]">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-elevated rounded-2xl border border-border-soft/40 p-8 sm:p-10 text-center">
          <h2 className="font-display text-[1.25rem] sm:text-[1.5rem] font-semibold text-text-strong tracking-[-0.02em] mb-2">
            Ready to get started?
          </h2>
          <p className="font-body text-[0.85rem] text-text-subtle max-w-md mx-auto mb-6">
            Build your first voice agent in minutes. No credit card required.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="hero" size="lg" className="rounded-full font-display" asChild>
              <Link href="/sign-up">
                Start building
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="rounded-full font-body" asChild>
              <a href="mailto:hello@yapsolutely.com">Talk to us</a>
            </Button>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
