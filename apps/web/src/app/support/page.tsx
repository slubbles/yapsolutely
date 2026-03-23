import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, MessageSquare, BookOpen, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Support | Yapsolutely",
  description: "Get help with Yapsolutely. Reach us by email or chat with our AI assistant.",
};

const channels = [
  {
    icon: Mail,
    title: "Email support",
    description: "Send us a message and we'll get back to you within 24 hours. For account issues, billing questions, or technical help.",
    action: "hello@yapsolutely.com",
    href: "mailto:hello@yapsolutely.com",
    cta: "Send an email",
  },
  {
    icon: MessageSquare,
    title: "AI chat assistant",
    description: "Get instant answers from our AI assistant. Available 24/7 and trained on our full documentation and knowledge base.",
    action: "Start a conversation",
    href: "/sign-in",
    cta: "Open chat",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Browse our guides, API reference, and tutorials. Most questions can be answered directly from the docs.",
    action: "docs.yapsolutely.xyz",
    href: "/docs",
    cta: "Browse docs",
  },
];

const faqs = [
  { q: "How do I assign a phone number to my agent?", a: "Go to your agent's detail page, scroll to the Phone Numbers section, and click 'Connect number'. You can provision a new number or assign an existing one." },
  { q: "What happens if my agent can't handle a call?", a: "You can configure transfer rules in your agent's settings. If the agent can't resolve the caller's request, it will transfer to a human operator or take a message." },
  { q: "How do I view call transcripts?", a: "Navigate to the Calls page in your dashboard. Click on any call to see the full transcript, timeline events, and any tool actions taken during the conversation." },
  { q: "Can I test my agent without making a real phone call?", a: "Yes. Open your agent's detail page and click 'Test Agent'. You can chat with your agent in text mode or use voice mode directly from your browser." },
  { q: "What voice providers do you support?", a: "We currently support Deepgram for both speech-to-text and text-to-speech, with multiple voice models available. More providers are on our roadmap." },
  { q: "How do I cancel or change my plan?", a: "Go to Settings → Billing in your dashboard. You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the next billing cycle." },
];

export default function SupportPage() {
  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border-soft/40 mb-6">
            <Clock className="w-3.5 h-3.5 text-text-subtle" />
            <span className="font-body text-[0.7rem] text-text-subtle tracking-wide">Typically replies within a few hours</span>
          </span>
          <h1 className="font-display text-[2rem] sm:text-[3rem] font-semibold tracking-[-0.03em] text-foreground mb-4 leading-[1.08]">
            How can we help?
          </h1>
          <p className="font-body text-[0.95rem] text-text-subtle max-w-lg mx-auto leading-[1.65]">
            Reach out through any channel below. Whether it&apos;s a quick question or a complex integration issue, we&apos;re here to help.
          </p>
        </div>

        {/* Support channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {channels.map((channel) => (
            <div key={channel.title} className="bg-surface-panel rounded-2xl border border-border-soft/60 p-7 flex flex-col transition-all duration-200 hover:shadow-surface-md hover:border-border-soft">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-5">
                <channel.icon className="w-5 h-5 text-text-body" />
              </div>
              <h3 className="font-display text-[1rem] font-semibold text-text-strong tracking-[-0.01em] mb-2">{channel.title}</h3>
              <p className="font-body text-[0.82rem] text-text-subtle leading-[1.65] mb-6 flex-1">{channel.description}</p>
              <Button variant="hero-outline" size="default" className="w-full rounded-xl font-display text-[0.85rem]" asChild>
                <Link href={channel.href}>
                  {channel.cta}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ section */}
        <div className="mb-20">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.025em] text-foreground mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-surface-panel rounded-xl border border-border-soft/60 p-6">
                <h3 className="font-display text-[0.88rem] font-medium text-text-strong mb-2">{faq.q}</h3>
                <p className="font-body text-[0.82rem] text-text-subtle leading-[1.65]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-dark rounded-2xl p-10 sm:p-14 text-center mb-10">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.025em] text-surface-dark-foreground mb-3 leading-[1.1]">
            Still need help?
          </h2>
          <p className="font-body text-[0.88rem] text-surface-dark-foreground/40 max-w-md mx-auto mb-8 leading-[1.65]">
            Our team is available Monday through Friday. Drop us an email and we&apos;ll get back to you as soon as possible.
          </p>
          <Button size="xl" className="bg-surface-dark-foreground text-surface-dark hover:bg-surface-dark-foreground/90 rounded-full font-display font-medium btn-press" asChild>
            <a href="mailto:hello@yapsolutely.com">
              Contact us
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </a>
          </Button>
        </div>
      </div>
    </PublicPageShell>
  );
}
