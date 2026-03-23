"use client";

import ScrollReveal from "@/components/landing/ScrollReveal";
import { Phone, FileText, Shield } from "lucide-react";

const useCases = [
  {
    icon: Phone,
    title: "After-hours reception",
    description:
      "Let an AI agent answer calls when your team is offline. Capture caller details, qualify leads, and route urgent requests — so you never miss an opportunity.",
  },
  {
    icon: FileText,
    title: "Appointment scheduling",
    description:
      "Voice agents can collect availability preferences, confirm bookings, and send follow-ups. Your team focuses on high-value work instead of phone tag.",
  },
  {
    icon: Shield,
    title: "Call auditing and compliance",
    description:
      "Every conversation is transcribed and logged automatically. Review full transcripts, flag calls for quality assurance, and maintain an auditable record.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 sm:py-32 px-6 bg-surface-elevated">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fade-up">
          <div className="text-center mb-14">
            <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Use cases</span>
            <h2 className="text-[2rem] sm:text-[2.75rem] font-semibold tracking-[-0.03em] text-foreground leading-[1.08]">
              Built for real business workflows
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {useCases.map((uc, i) => (
            <ScrollReveal key={uc.title} variant="fade-up" delay={i * 100} duration={500}>
              <div className="bg-surface-panel rounded-2xl border border-border-soft/60 p-7 h-full flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center mb-5">
                  <uc.icon className="w-5 h-5 text-text-subtle" />
                </div>

                <h3 className="font-display text-[0.95rem] font-semibold text-text-strong mb-3">
                  {uc.title}
                </h3>

                <p className="font-body text-[0.88rem] text-text-body leading-[1.7] flex-1">
                  {uc.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
