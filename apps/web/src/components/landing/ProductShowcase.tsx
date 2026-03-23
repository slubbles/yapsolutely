"use client";

import { Phone, Shield, BarChart3 } from "lucide-react";
import ScrollReveal from "@/components/landing/ScrollReveal";

const ProductShowcase = () => {
  return (
    <section id="platform" className="py-28 sm:py-36 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8">
            <ScrollReveal variant="fade-right">
              <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Platform</span>
              <h2 className="text-[2.25rem] sm:text-[3rem] font-semibold tracking-[-0.03em] text-foreground leading-[1.08]">
                One workspace for your
                <br />
                entire voice operation
              </h2>
            </ScrollReveal>
          </div>
        </div>

        {/* Asymmetric feature grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left */}
          <ScrollReveal variant="fade-up" delay={0} duration={600} className="lg:col-span-7">
            <div className="bg-surface-elevated rounded-[1.5rem] p-8 sm:p-10 border border-border-soft/20 h-full transition-all duration-200 hover:border-border-soft/50 hover:shadow-surface-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-surface-dark flex items-center justify-center">
                  <Phone className="w-4 h-4 text-surface-dark-foreground/60" />
                </div>
                <h3 className="font-display text-[1rem] font-medium text-foreground">Agents &amp; Numbers</h3>
              </div>
              <p className="font-body text-[0.88rem] text-text-subtle leading-[1.7] max-w-lg mb-8">
                Create agents with custom prompts, assign dedicated phone numbers, and configure routing rules. Each agent operates independently with its own script, voice, and tool integrations.
              </p>

              {/* Mini product preview */}
              <div className="bg-secondary/60 rounded-2xl p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-display text-sm font-medium text-foreground">Inbound Sales</span>
                  <span className="font-body text-xs text-text-subtle/60 ml-auto font-mono">+1 (415) 555-0142</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Today", value: "47" },
                    { label: "Avg. duration", value: "3:42" },
                    { label: "Resolved", value: "91%" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-surface-panel rounded-xl p-3 text-center">
                      <div className="font-display text-base font-semibold text-foreground">{stat.value}</div>
                      <div className="font-body text-[0.65rem] text-text-subtle mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right stacked */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <ScrollReveal variant="fade-up" delay={150} duration={600}>
              <div className="bg-surface-elevated rounded-[1.25rem] p-7 sm:p-8 border border-border-soft/20 flex-1 transition-all duration-200 hover:border-border-soft/50 hover:shadow-surface-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-text-body" />
                  </div>
                  <h3 className="font-display text-[0.92rem] font-medium text-foreground">Transcripts &amp; Review</h3>
                </div>
                <p className="font-body text-[0.82rem] text-text-subtle leading-[1.7] mb-4">
                  Every conversation is transcribed and indexed. Search across calls, flag moments for follow-up, and export data when you need it.
                </p>
                {/* Mini transcript snippet */}
                <div className="bg-secondary/60 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400/60" />
                    <span className="font-mono text-[0.6rem] text-text-subtle/50">0:04</span>
                    <span className="font-body text-[0.62rem] text-text-body">Thanks for calling, how can I help?</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-400/60" />
                    <span className="font-mono text-[0.6rem] text-text-subtle/50">0:08</span>
                    <span className="font-body text-[0.62rem] text-text-body">I&apos;d like to book an appointment...</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={300} duration={600}>
              <div className="bg-surface-elevated rounded-[1.25rem] p-7 sm:p-8 border border-border-soft/20 flex-1 transition-all duration-200 hover:border-border-soft/50 hover:shadow-surface-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <BarChart3 className="w-3.5 h-3.5 text-text-body" />
                  </div>
                  <h3 className="font-display text-[0.92rem] font-medium text-foreground">Call Logs &amp; Performance</h3>
                </div>
                <p className="font-body text-[0.82rem] text-text-subtle leading-[1.7] mb-4">
                  Track duration, disposition, and volume across all agents. See which calls were resolved, flagged, and where to improve.
                </p>
                {/* Mini stats bar */}
                <div className="flex gap-2">
                  <div className="bg-secondary/60 rounded-lg px-3 py-1.5 flex-1 text-center">
                    <div className="font-display text-sm font-semibold text-foreground">142</div>
                    <div className="font-body text-[0.55rem] text-text-subtle">Calls</div>
                  </div>
                  <div className="bg-secondary/60 rounded-lg px-3 py-1.5 flex-1 text-center">
                    <div className="font-display text-sm font-semibold text-foreground">2:38</div>
                    <div className="font-body text-[0.55rem] text-text-subtle">Avg</div>
                  </div>
                  <div className="bg-secondary/60 rounded-lg px-3 py-1.5 flex-1 text-center">
                    <div className="font-display text-sm font-semibold text-emerald-400">94%</div>
                    <div className="font-body text-[0.55rem] text-text-subtle">Resolved</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
