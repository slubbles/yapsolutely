import { Phone, Shield, BarChart3 } from "lucide-react";

const ProductShowcase = () => {
  return (
    <section id="platform" className="py-28 sm:py-36 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header — asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8">
            <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Platform</span>
            <h2 className="text-[2.25rem] sm:text-[3rem] font-semibold tracking-[-0.03em] text-foreground leading-[1.08]">
              One workspace for your
              <br />
              entire voice operation
            </h2>
          </div>
        </div>

        {/* Asymmetric feature grid — not equal cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left — large featured capability */}
          <div className="lg:col-span-7">
            <div className="bg-surface-elevated rounded-[1.5rem] p-8 sm:p-10 border border-border-soft/20 h-full">
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
          </div>

          {/* Right — stacked secondary capabilities */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-surface-elevated rounded-[1.25rem] p-7 sm:p-8 border border-border-soft/20 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-text-body" />
                </div>
                <h3 className="font-display text-[0.92rem] font-medium text-foreground">Transcripts &amp; Review</h3>
              </div>
              <p className="font-body text-[0.82rem] text-text-subtle leading-[1.7]">
                Every conversation is transcribed and indexed. Search across calls, flag moments for follow-up, and export data when you need it.
              </p>
            </div>

            <div className="bg-surface-elevated rounded-[1.25rem] p-7 sm:p-8 border border-border-soft/20 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5 text-text-body" />
                </div>
                <h3 className="font-display text-[0.92rem] font-medium text-foreground">Call Logs &amp; Performance</h3>
              </div>
              <p className="font-body text-[0.82rem] text-text-subtle leading-[1.7]">
                Track duration, disposition, and volume across all agents. See which calls were resolved, flagged, and where to improve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
