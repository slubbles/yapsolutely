import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, ArrowRight, Bot, BarChart3 } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section id="product" className="pt-28 sm:pt-36 pb-20 sm:pb-32 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Asymmetric hero: left-aligned headline + right proof stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end mb-14 sm:mb-20">
          <div className="lg:col-span-7 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border-soft/40 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="font-body text-[0.7rem] text-text-subtle tracking-wide">Handling calls now</span>
            </div>
            <h1 className="text-[2.25rem] sm:text-[3.5rem] lg:text-[4.5rem] font-semibold tracking-[-0.035em] leading-[1.02] text-foreground mb-6">
              AI agents that
              <br />
              answer your phone
            </h1>
            <p className="text-[0.95rem] sm:text-[1.05rem] text-text-subtle max-w-lg leading-[1.65] mb-8">
              Build voice agents, assign them real phone numbers, and let them handle inbound calls. Review every transcript and monitor every conversation from one workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Button variant="hero" size="xl" className="btn-press" asChild>
                <Link href="/sign-up">
                  Start building
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" className="btn-press" asChild>
                <a href="#workflow">See how it works</a>
              </Button>
            </div>
          </div>

          {/* Right proof column — key metrics */}
          <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "< 800ms", label: "Voice latency", sub: "end-to-end" },
                { value: "24/7", label: "Availability", sub: "no downtime" },
                { value: "100%", label: "Transcribed", sub: "every call" },
                { value: "Real", label: "Phone numbers", sub: "dedicated lines" },
              ].map((stat, i) => (
                <div key={stat.label} className="bg-surface-elevated rounded-2xl p-4 sm:p-5 border border-border-soft/30 stagger-item hover:border-border-soft/60 transition-colors" style={{ animationDelay: `${0.3 + i * 0.08}s` }}>
                  <div className="font-display text-lg sm:text-xl font-semibold text-foreground tracking-[-0.02em]">{stat.value}</div>
                  <div className="font-body text-[0.75rem] text-text-body mt-1">{stat.label}</div>
                  <div className="font-body text-[0.65rem] text-text-subtle mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Embedded product preview — seamless with white background */}
        <div className="animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="relative rounded-[1.25rem] sm:rounded-[1.75rem] border border-border-soft/40 bg-white overflow-hidden shadow-[0_1px_3px_-1px_rgba(0,0,0,0.04),0_8px_30px_-8px_rgba(0,0,0,0.06)]">
            {/* Top bar — browser chrome feel */}
            <div className="flex items-center gap-2 px-5 sm:px-7 py-3.5 border-b border-border-soft/30 bg-gradient-to-b from-surface-elevated/60 to-white">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-300/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300/50" />
              </div>
              <div className="ml-3 flex-1 max-w-[240px] h-5 rounded-md bg-surface-subtle/60 flex items-center justify-center">
                <span className="font-mono text-[0.55rem] text-text-subtle/40">app.yapsolutely.xyz/agents</span>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="grid grid-cols-1 sm:grid-cols-12 min-h-[320px] sm:min-h-[380px]">
              {/* Sidebar */}
              <div className="hidden sm:flex sm:col-span-3 flex-col gap-1 p-4 border-r border-border-soft/20 bg-gradient-to-b from-white to-surface-elevated/20">
                <div className="font-display text-[0.65rem] font-semibold text-text-subtle/40 uppercase tracking-[0.15em] mb-3 px-2">Workspace</div>
                {[
                  { icon: Bot, label: "Agents", active: true },
                  { icon: Phone, label: "Calls", active: false },
                  { icon: BarChart3, label: "Analytics", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.78rem] font-body ${
                      item.active
                        ? "bg-surface-subtle/80 text-text-strong font-medium"
                        : "text-text-subtle/50"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main area */}
              <div className="sm:col-span-9 p-5 sm:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="font-display text-[0.95rem] font-semibold text-text-strong">Agents</div>
                    <div className="font-body text-[0.7rem] text-text-subtle/50 mt-0.5">3 active agents</div>
                  </div>
                  <div className="h-7 px-3 rounded-md bg-foreground flex items-center">
                    <span className="font-body text-[0.68rem] text-white font-medium">+ New agent</span>
                  </div>
                </div>

                {/* Agent cards */}
                <div className="space-y-2.5">
                  {[
                    { name: "Inbound Sales", status: "Active", calls: "142", number: "+1 (415) 555-0142" },
                    { name: "Support — Tier 1", status: "Active", calls: "89", number: "+1 (212) 555-0198" },
                    { name: "Appointment Booking", status: "Paused", calls: "23", number: "+1 (310) 555-0067" },
                  ].map((agent) => (
                    <div
                      key={agent.name}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-border-soft/30 bg-white hover:border-border-soft/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-subtle/80 flex items-center justify-center">
                          <Bot className="w-3.5 h-3.5 text-text-subtle/60" />
                        </div>
                        <div>
                          <div className="font-body text-[0.82rem] font-medium text-text-strong">{agent.name}</div>
                          <div className="font-mono text-[0.62rem] text-text-subtle/40 mt-0.5">{agent.number}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <div className="font-mono text-[0.72rem] text-text-body">{agent.calls}</div>
                          <div className="font-body text-[0.58rem] text-text-subtle/40">calls</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "Active" ? "bg-emerald-400" : "bg-amber-300"}`} />
                          <span className={`font-body text-[0.68rem] ${agent.status === "Active" ? "text-emerald-600" : "text-amber-500"}`}>{agent.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
