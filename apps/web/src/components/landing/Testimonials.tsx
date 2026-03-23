"use client";

import ScrollReveal from "@/components/landing/ScrollReveal";

const testimonials = [
  {
    quote: "We replaced our entire after-hours reception team with a single Yapsolutely agent. It handles 93% of calls autonomously.",
    name: "Priya Sharma",
    role: "Operations Director",
    company: "BrightPath Clinics",
  },
  {
    quote: "Setup took under an hour. Our AI receptionist now qualifies leads and books appointments while we sleep.",
    name: "Marcus Chen",
    role: "Founder",
    company: "Velox Real Estate",
  },
  {
    quote: "The transcript logs alone saved us from three compliance issues last quarter. We can audit every single call.",
    name: "Jordan Ellis",
    role: "Head of Compliance",
    company: "Halo Financial",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 sm:py-32 px-6 bg-surface-elevated">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-14">
            <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Testimonials</span>
            <h2 className="text-[2rem] sm:text-[2.75rem] font-semibold tracking-[-0.03em] text-foreground leading-[1.08]">
              Don&apos;t just take our word for it
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} variant="fade-up" delay={i * 100} duration={500}>
              <div className="bg-surface-panel rounded-2xl border border-border-soft/60 p-7 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="font-body text-[0.88rem] text-text-body leading-[1.7] flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div>
                  <p className="font-display text-[0.82rem] font-semibold text-text-strong">{t.name}</p>
                  <p className="font-body text-[0.72rem] text-text-subtle">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
