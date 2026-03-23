"use client";

import { Bot, Shield, Zap, BarChart3, Phone, Workflow, Globe, Clock, Headphones, Lock, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/landing/ScrollReveal";

const benefits = [
  { icon: Bot, title: "Custom AI agents", desc: "Build agents with unique personalities, scripts, and behaviors tailored to your business." },
  { icon: Phone, title: "Real phone numbers", desc: "Assign dedicated numbers to each agent. Callers reach the right agent instantly." },
  { icon: Zap, title: "Sub-second responses", desc: "Streaming STT + LLM + TTS pipeline delivers natural, fast conversations." },
  { icon: Shield, title: "Full transcript audit", desc: "Every call logged with word-for-word transcripts and timeline events." },
  { icon: Workflow, title: "Visual flow builder", desc: "Design conversation logic visually. Drag, drop, and generate prompts with AI." },
  { icon: BarChart3, title: "Real-time analytics", desc: "Track call volume, resolution rates, response times, and agent performance." },
];

const moreBenefits = [
  "Interruption handling",
  "Tool integrations (SMS, calendar, transfer)",
  "Browser-based agent testing",
  "AI prompt generation",
  "Multi-agent support",
  "Webhook events",
  "Knowledge base (coming soon)",
  "Outbound campaigns (coming soon)",
];

const Benefits = () => {
  return (
    <section className="py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-14">
            <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Why Yapsolutely</span>
            <h2 className="text-[2rem] sm:text-[2.75rem] font-semibold tracking-[-0.03em] text-foreground leading-[1.08] mb-4">
              Everything you need to deploy
              <br className="hidden sm:block" />
              voice agents at scale
            </h2>
            <p className="font-body text-[0.92rem] text-text-subtle max-w-lg mx-auto leading-[1.65]">
              From agent creation to call review. One platform, no code required.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} variant="fade-up" delay={i * 80} duration={500}>
              <div className="bg-surface-panel rounded-2xl border border-border-soft/60 p-6 h-full transition-all duration-200 hover:shadow-surface-md hover:border-border-soft group">
                <div className="w-10 h-10 rounded-xl bg-foreground/[0.05] flex items-center justify-center mb-4 group-hover:bg-foreground/[0.08] transition-colors">
                  <b.icon className="w-5 h-5 text-text-body" />
                </div>
                <h3 className="font-display text-[0.92rem] font-semibold text-text-strong tracking-[-0.01em] mb-1.5">{b.title}</h3>
                <p className="font-body text-[0.8rem] text-text-subtle leading-[1.65]">{b.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* And much more */}
        <ScrollReveal variant="fade-up" delay={200}>
          <div className="bg-surface-elevated rounded-2xl border border-border-soft/30 p-8 sm:p-10 text-center">
            <h3 className="font-display text-[1.1rem] font-semibold text-text-strong mb-5">And much more</h3>
            <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
              {moreBenefits.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-surface-panel border border-border-soft/50 font-body text-[0.75rem] text-text-body"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 font-body text-[0.82rem] text-text-subtle hover:text-foreground transition-colors"
              >
                See all features & pricing
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Benefits;
