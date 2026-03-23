import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ClosingCTA = () => {
  return (
    <section id="pricing" className="py-28 sm:py-36 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface-dark rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: editorial CTA */}
            <div className="lg:col-span-7 p-10 sm:p-14 lg:p-16 flex flex-col justify-center">
              <span className="font-body text-[0.6rem] text-surface-dark-foreground/20 uppercase tracking-[0.2em] block mb-6">Get started</span>
              <h2 className="font-display text-[1.75rem] sm:text-[2.5rem] font-semibold tracking-[-0.03em] text-surface-dark-foreground mb-4 leading-[1.08]">
                Your first agent can
                <br className="hidden sm:block" />
                go live in minutes
              </h2>
              <p className="font-body text-surface-dark-foreground/35 text-[0.9rem] max-w-md mb-10 leading-[1.65]">
                Configure an agent, assign a number, and start taking calls. Review every transcript and monitor performance from day one.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Button size="xl" className="bg-surface-dark-foreground text-surface-dark hover:bg-surface-dark-foreground/90 rounded-full font-display font-medium tracking-[-0.01em] btn-press" asChild>
                  <Link href="/sign-up">
                    Start building
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </Button>
                <Button size="xl" className="border border-surface-dark-foreground/10 bg-transparent text-surface-dark-foreground/60 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/5 rounded-full font-body font-medium tracking-[-0.01em]" asChild>
                  <a href="mailto:hello@yapsolutely.com">Talk to us</a>
                </Button>
              </div>
            </div>

            {/* Right: proof card */}
            <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 lg:pl-0 flex items-center">
              <div className="bg-surface-dark-foreground/5 rounded-2xl p-6 w-full">
                <div className="font-body text-[0.6rem] text-surface-dark-foreground/25 uppercase tracking-[0.2em] mb-5">What you get</div>
                <div className="space-y-4">
                  {[
                    { title: "Build", desc: "Prompt editor, voice selection, tool integrations" },
                    { title: "Deploy", desc: "Real phone numbers, instant routing, zero downtime" },
                    { title: "Monitor", desc: "Full transcripts, call logs, quality review" },
                  ].map((item, i) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="font-mono text-[0.6rem] text-surface-dark-foreground/15 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <div className="font-display text-sm font-medium text-surface-dark-foreground/80 mb-0.5">{item.title}</div>
                        <div className="font-body text-[0.78rem] text-surface-dark-foreground/30 leading-[1.6]">{item.desc}</div>
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

export default ClosingCTA;
