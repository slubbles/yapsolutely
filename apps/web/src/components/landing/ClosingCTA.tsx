import { Button } from "@/components/ui/button";
import Link from "next/link";

const ClosingCTA = () => {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-surface-dark rounded-panel p-12 sm:p-20 text-center">
          <h2 className="font-display text-[2rem] sm:text-[3.25rem] font-semibold tracking-[-0.03em] text-surface-dark-foreground mb-5 leading-[1.1]">
            Your first agent can be
            <br className="hidden sm:block" />
            live in minutes
          </h2>
          <p className="font-body text-surface-dark-foreground/35 text-[0.95rem] max-w-md mx-auto mb-12 leading-[1.65]">
            Configure an agent, assign a number, and start taking calls. No integration work required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="xl" className="bg-surface-dark-foreground text-surface-dark hover:bg-surface-dark-foreground/90 rounded-full font-display font-medium tracking-[-0.01em]" asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
            <Button size="xl" className="border border-surface-dark-foreground/10 bg-transparent text-surface-dark-foreground/60 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/5 rounded-full font-body font-medium tracking-[-0.01em]" asChild>
              <a href="mailto:hello@yapsolutely.com">Talk to us</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingCTA;
