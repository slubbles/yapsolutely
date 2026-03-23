import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section id="product" className="pt-28 sm:pt-36 pb-20 sm:pb-32 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Asymmetric hero: left-aligned headline + right embedded illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14 sm:mb-20">
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

          {/* Right column — embedded voice agent illustration */}
          <div className="lg:col-span-5 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Phone mockup with voice waveform visualization */}
              <svg viewBox="0 0 400 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[360px] mx-auto drop-shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                {/* Phone body */}
                <rect x="60" y="20" width="280" height="400" rx="36" className="fill-surface-panel stroke-border-soft" strokeWidth="1.5"/>
                {/* Screen area */}
                <rect x="76" y="56" width="248" height="340" rx="8" className="fill-canvas"/>
                {/* Status bar */}
                <rect x="76" y="56" width="248" height="28" rx="8" className="fill-surface-panel" fillOpacity="0.8"/>
                <circle cx="96" cy="70" r="3" fill="hsl(142,71%,45%)"/>
                <text x="106" y="73" fontSize="9" className="fill-text-subtle" fontFamily="system-ui">Yapsolutely</text>
                <text x="280" y="73" fontSize="8" className="fill-text-subtle" fontFamily="system-ui" textAnchor="end">4:23</text>
                {/* Active call card */}
                <rect x="92" y="100" width="216" height="72" rx="16" className="fill-surface-panel stroke-border-soft" strokeWidth="1"/>
                <circle cx="120" cy="124" r="14" fill="hsl(142,71%,45%)" fillOpacity="0.1"/>
                <circle cx="120" cy="124" r="6" fill="hsl(142,71%,45%)"/>
                {/* Pulsing ring */}
                <circle cx="120" cy="124" r="11" stroke="hsl(142,71%,45%)" strokeWidth="1" strokeOpacity="0.3">
                  <animate attributeName="r" values="11;16;11" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
                </circle>
                <text x="144" y="120" fontSize="11" fontWeight="600" className="fill-text-strong" fontFamily="system-ui">Inbound Sales Agent</text>
                <text x="144" y="135" fontSize="9" className="fill-text-subtle" fontFamily="system-ui">+1 (415) 555-0142</text>
                <rect x="144" y="146" width="44" height="16" rx="8" fill="hsl(142,71%,45%)" fillOpacity="0.1"/>
                <text x="155" y="157" fontSize="8" fontWeight="500" fill="hsl(142,53%,42%)" fontFamily="system-ui">Active</text>
                {/* Voice waveform visualization */}
                <g transform="translate(92, 192)">
                  <rect width="216" height="80" rx="16" className="fill-surface-panel stroke-border-soft" strokeWidth="1"/>
                  <text x="16" y="20" fontSize="8" className="fill-text-subtle" fontFamily="system-ui" textDecoration="uppercase" letterSpacing="0.1em">LIVE AUDIO</text>
                  {/* Waveform bars */}
                  {[16,28,40,52,64,76,88,100,112,124,136,148,160,172,184,196].map((x, i) => {
                    const heights = [18,28,22,36,30,24,34,20,28,38,24,32,26,20,30,22];
                    const h = heights[i];
                    return (
                      <rect key={i} x={x} y={50 - h/2} width="6" height={h} rx="3" className="fill-foreground" fillOpacity={0.12 + (i % 3) * 0.06}>
                        <animate attributeName="height" values={`${h};${h * 0.5};${h * 1.2};${h}`} dur={`${1.2 + i * 0.1}s`} repeatCount="indefinite"/>
                        <animate attributeName="y" values={`${50-h/2};${50-h*0.25};${50-h*0.6};${50-h/2}`} dur={`${1.2 + i * 0.1}s`} repeatCount="indefinite"/>
                      </rect>
                    );
                  })}
                </g>
                {/* Transcript preview */}
                <g transform="translate(92, 290)">
                  <rect width="216" height="92" rx="16" className="fill-surface-panel stroke-border-soft" strokeWidth="1"/>
                  <text x="16" y="20" fontSize="8" className="fill-text-subtle" fontFamily="system-ui" letterSpacing="0.1em">TRANSCRIPT</text>
                  <circle cx="26" cy="40" r="6" className="fill-foreground" fillOpacity="0.08"/>
                  <text x="22" y="43" fontSize="7" className="fill-text-strong" fontFamily="system-ui" fontWeight="600" textAnchor="middle">A</text>
                  <text x="38" y="42" fontSize="9" className="fill-text-body" fontFamily="system-ui">How can I help you today?</text>
                  <circle cx="26" cy="62" r="6" fill="hsl(142,71%,45%)" fillOpacity="0.1"/>
                  <text x="22" y="65" fontSize="7" fill="hsl(142,53%,42%)" fontFamily="system-ui" fontWeight="600" textAnchor="middle">C</text>
                  <text x="38" y="64" fontSize="9" className="fill-text-body" fontFamily="system-ui">I&apos;d like to schedule a demo.</text>
                  <rect x="38" y="74" width="80" height="4" rx="2" className="fill-border-soft"/>
                </g>
                {/* Notch */}
                <rect x="160" y="26" width="80" height="20" rx="10" className="fill-canvas"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Dark contrast dashboard preview — the signature editorial block */}
        <div className="animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="relative bg-surface-dark rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-8 md:p-10 overflow-hidden shadow-surface-xl">
            {/* Floating label */}
            <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-dark-foreground/8 font-body text-[0.6rem] text-surface-dark-foreground/40 tracking-wider uppercase">
                Live dashboard preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {/* Agent sidebar */}
              <div className="hidden sm:block bg-surface-dark-foreground/5 rounded-2xl p-5">
                <div className="text-[0.6rem] font-body text-surface-dark-foreground/30 uppercase tracking-[0.15em] mb-4">Agents</div>
                <div className="space-y-2">
                  {[
                    { name: "Inbound Sales", active: true },
                    { name: "Support - Tier 1", active: true },
                    { name: "Appointment Booking", active: false },
                  ].map((agent, i) => (
                    <div key={agent.name} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-body transition-colors ${i === 0 ? "bg-surface-dark-foreground/8 text-surface-dark-foreground" : "text-surface-dark-foreground/35"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${agent.active ? "bg-emerald-400" : "bg-surface-dark-foreground/15"}`} />
                      {agent.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content area */}
              <div className="sm:col-span-2 space-y-4">
                <div className="bg-surface-dark-foreground/5 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[0.6rem] font-body text-surface-dark-foreground/30 uppercase tracking-[0.15em]">Call log</div>
                    <div className="text-xs font-body text-surface-dark-foreground/20">Today</div>
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
                          <span className={`text-xs ${call.status === "Flagged" ? "text-amber-400/60" : "text-surface-dark-foreground/20"}`}>
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
                    <div className="text-[0.6rem] font-body text-surface-dark-foreground/30 uppercase tracking-[0.15em]">Transcript</div>
                  </div>
                  <div className="space-y-2.5 text-sm font-body">
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
