import { Button } from "@/components/ui/button";
import { Phone, MessageSquare } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section id="product" className="pt-28 sm:pt-40 pb-16 sm:pb-28 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-7 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[5.25rem] font-semibold tracking-[-0.035em] leading-[1.05] text-foreground">
            AI agents that answer
            <br />
            your phone
          </h1>
        </div>

        <p className="text-center text-[0.95rem] sm:text-[1.05rem] text-text-subtle max-w-lg mx-auto mb-10 sm:mb-14 animate-fade-up leading-[1.65] px-4" style={{ animationDelay: "0.2s" }}>
          Build voice agents, assign them phone numbers, and let them handle calls. Review every transcript from one dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 sm:mb-28 animate-fade-up px-4" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="xl" asChild className="w-full sm:w-auto">
            <Link href="/sign-up">Start building</Link>
          </Button>
          <Button variant="hero-outline" size="xl" asChild className="w-full sm:w-auto">
            <a href="#workflow">See how it works</a>
          </Button>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="relative bg-surface-dark rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-12 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="hidden sm:block bg-surface-dark-foreground/5 rounded-2xl p-5">
                <div className="text-[0.65rem] font-body text-surface-dark-foreground/30 uppercase tracking-[0.15em] mb-4">Agents</div>
                <div className="space-y-2">
                  {[
                    { name: "Inbound Sales", active: true },
                    { name: "Support — Tier 1", active: true },
                    { name: "Appointment Booking", active: false },
                  ].map((agent, i) => (
                    <div key={agent.name} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-body ${i === 0 ? 'bg-surface-dark-foreground/8 text-surface-dark-foreground' : 'text-surface-dark-foreground/35'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${agent.active ? 'bg-emerald-400' : 'bg-surface-dark-foreground/15'}`} />
                      {agent.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 space-y-4">
                <div className="bg-surface-dark-foreground/5 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[0.65rem] font-body text-surface-dark-foreground/30 uppercase tracking-[0.15em]">Call log</div>
                    <div className="text-xs font-body text-surface-dark-foreground/20">Mar 21</div>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { number: "+1 (415) 555-0142", duration: "4:23", status: "Completed" },
                      { number: "+1 (212) 555-0198", duration: "2:17", status: "Completed" },
                      { number: "+1 (310) 555-0067", duration: "6:51", status: "Flagged" },
                    ].map((call, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-surface-dark-foreground/[0.03] text-sm font-body">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Phone className="w-3 h-3 text-surface-dark-foreground/20" />
                          <span className="text-surface-dark-foreground/50 font-mono text-[0.65rem] sm:text-xs">{call.number}</span>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="text-surface-dark-foreground/20 text-xs hidden sm:inline">{call.duration}</span>
                          <span className={`text-xs ${call.status === "Flagged" ? 'text-amber-400/60' : 'text-surface-dark-foreground/20'}`}>
                            {call.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-surface-dark-foreground/5 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-3 h-3 text-surface-dark-foreground/20" />
                    <div className="text-[0.65rem] font-body text-surface-dark-foreground/30 uppercase tracking-[0.15em]">Transcript</div>
                  </div>
                  <div className="space-y-2 text-sm font-body">
                    <div className="flex gap-3">
                      <span className="text-surface-dark-foreground/20 text-xs font-mono shrink-0">Agent</span>
                      <span className="text-surface-dark-foreground/45">Good afternoon, how can I help you today?</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-surface-dark-foreground/20 text-xs font-mono shrink-0">Caller</span>
                      <span className="text-surface-dark-foreground/45">I&apos;d like to schedule a walkthrough of your enterprise plan.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
