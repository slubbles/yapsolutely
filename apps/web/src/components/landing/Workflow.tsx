"use client";

import ScrollReveal from "@/components/landing/ScrollReveal";

const Workflow = () => {
  return (
    <section id="workflow" className="py-28 sm:py-36 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
          <div className="lg:col-span-7">
            <ScrollReveal variant="fade-right" delay={0}>
              <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">How it works</span>
              <h2 className="text-[2.25rem] sm:text-[3rem] font-semibold tracking-[-0.03em] text-foreground leading-[1.08]">
                Three steps to a
                <br />
                working phone agent
              </h2>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <ScrollReveal variant="fade-left" delay={100}>
              <p className="font-body text-[0.9rem] text-text-subtle leading-[1.7] max-w-sm">
                No SDK integration, no custom infrastructure. Configure your agent, assign a number, and calls start flowing.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Build */}
          <ScrollReveal variant="fade-up" delay={0} duration={600} className="lg:col-span-7">
            <div className="bg-surface-dark rounded-[1.5rem] p-8 sm:p-12 flex flex-col justify-between min-h-[340px] transition-shadow duration-300 hover:shadow-surface-xl h-full">
            <div>
              <span className="font-mono text-xs text-surface-dark-foreground/20 block mb-6">01</span>
              <h3 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.025em] text-surface-dark-foreground mb-4 leading-[1.12]">
                Define your agent&apos;s
                <br />
                behavior and script
              </h3>
              <p className="font-body text-surface-dark-foreground/40 text-[0.85rem] leading-[1.7] max-w-md">
                Set the voice, tone, routing logic, and fallback rules. Configure what your agent says, when it transfers, and how it handles edge cases.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="font-body text-[0.6rem] text-surface-dark-foreground/15 uppercase tracking-[0.2em]">Build</span>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-dark-foreground/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                <span className="font-body text-[0.6rem] text-surface-dark-foreground/25">Prompt editor • Voice selection • Tools</span>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Deploy + Monitor stacked */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <ScrollReveal variant="fade-up" delay={150} duration={600}>
              <div className="bg-surface-elevated rounded-[1.25rem] p-7 sm:p-8 flex-1 border border-border-soft/20 transition-all duration-200 hover:border-border-soft/50 hover:shadow-surface-sm">
                <span className="font-mono text-xs text-text-subtle/40 block mb-4">02</span>
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-foreground mb-2 leading-snug">
                  Assign a number and go live
                </h3>
                <p className="font-body text-[0.82rem] text-text-subtle leading-[1.7]">
                  Provision a phone number, attach it to your agent, and start receiving inbound calls. Push updates without downtime.
                </p>
                <div className="mt-6 font-body text-[0.6rem] text-text-subtle/25 uppercase tracking-[0.2em]">Deploy</div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={300} duration={600}>
              <div className="bg-surface-elevated rounded-[1.25rem] p-7 sm:p-8 flex-1 border border-border-soft/20 transition-all duration-200 hover:border-border-soft/50 hover:shadow-surface-sm">
                <span className="font-mono text-xs text-text-subtle/40 block mb-4">03</span>
                <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-foreground mb-2 leading-snug">
                  Review every call in detail
                </h3>
                <p className="font-body text-[0.82rem] text-text-subtle leading-[1.7]">
                  Read transcripts, flag conversations, and track agent performance. Full audit trail on every interaction.
                </p>
                <div className="mt-6 font-body text-[0.6rem] text-text-subtle/25 uppercase tracking-[0.2em]">Monitor</div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
