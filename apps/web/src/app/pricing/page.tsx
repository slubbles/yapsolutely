import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Pricing | Yapsolutely",
  description: "Simple, transparent pricing for AI voice agents. Start free, scale as you grow.",
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Get started with AI voice agents. Perfect for testing and small workloads.",
    cta: "Start free",
    ctaVariant: "hero-outline" as const,
    features: [
      "1 agent",
      "1 phone number",
      "50 minutes / month",
      "Call transcripts",
      "Basic analytics",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing teams. More agents, more minutes, and advanced features.",
    cta: "Start free trial",
    ctaVariant: "hero" as const,
    popular: true,
    features: [
      "10 agents",
      "5 phone numbers",
      "1,000 minutes / month",
      "Call transcripts & recordings",
      "Custom tools & integrations",
      "Webhook events",
      "Advanced analytics",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with advanced requirements. Custom limits, SLA, and dedicated support.",
    cta: "Contact sales",
    ctaVariant: "hero-outline" as const,
    features: [
      "Unlimited agents",
      "Unlimited phone numbers",
      "Custom minute packages",
      "SSO / SAML authentication",
      "Dedicated account manager",
      "Custom SLA & uptime guarantee",
      "On-premise deployment options",
      "Advanced security & compliance",
      "Custom AI model fine-tuning",
    ],
  },
];

export default async function PricingPage() {
  const session = await getSession();
  const isLoggedIn = !!session;

  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <h1 className="font-display text-[2rem] sm:text-[3rem] font-semibold tracking-[-0.03em] text-foreground mb-4 leading-[1.08]">
            Simple, transparent pricing
          </h1>
          <p className="font-body text-[0.95rem] text-text-subtle max-w-lg mx-auto leading-[1.65]">
            Start free, upgrade when you need more. No hidden fees, no per-seat charges. Pay only for what you use.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative bg-surface-panel rounded-2xl border p-7 sm:p-8 flex flex-col stagger-item transition-all duration-200 hover:shadow-surface-md ${
                plan.popular
                  ? "border-foreground/20 shadow-surface-md"
                  : "border-border-soft/60 hover:border-border-soft"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex px-3 py-1 rounded-full bg-foreground text-primary-foreground font-body text-[0.65rem] font-medium tracking-wide">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-[0.92rem] font-semibold text-text-strong tracking-[-0.01em] mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display text-[2rem] font-semibold text-foreground tracking-[-0.02em]">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="font-body text-[0.78rem] text-text-subtle">{plan.period}</span>
                  )}
                </div>
                <p className="font-body text-[0.78rem] text-text-subtle leading-[1.6]">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="font-body text-[0.78rem] text-text-body">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.ctaVariant}
                size="lg"
                className="w-full rounded-xl font-display btn-press"
                asChild
              >
                {plan.name === "Enterprise" ? (
                  <a href="mailto:sales@yapsolutely.com">
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </a>
                ) : (
                  <Link href={isLoggedIn ? "/dashboard" : "/sign-up"}>
                    {isLoggedIn ? "Go to dashboard" : plan.cta}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ-style bottom section */}
        <div className="mt-20 sm:mt-28 max-w-2xl mx-auto">
          <h2 className="font-display text-[1.25rem] font-semibold text-text-strong tracking-[-0.02em] text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What counts as a minute?",
                a: "A minute is measured from when a call connects to when it ends. Partial minutes are rounded up to the nearest second and billed proportionally.",
              },
              {
                q: "Can I change plans at any time?",
                a: "Yes. Upgrades take effect immediately with prorated billing. Downgrades take effect at the start of your next billing cycle.",
              },
              {
                q: "Do you offer annual billing?",
                a: "Yes. Annual plans include a 20% discount. Contact us for annual pricing on Pro and Enterprise plans.",
              },
              {
                q: "What happens if I exceed my minute limit?",
                a: "On the Pro plan, overage minutes are billed at $0.08/minute. We'll notify you when you reach 80% of your allocation. Starter plan calls are paused when limits are reached.",
              },
              {
                q: "Is there a free trial for Pro?",
                a: "Yes. The Pro plan includes a 14-day free trial with full access to all features. No credit card required to start.",
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-border-soft/40 pb-5">
                <h3 className="font-display text-[0.88rem] font-medium text-text-strong mb-1.5">{faq.q}</h3>
                <p className="font-body text-[0.78rem] text-text-subtle leading-[1.65]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
