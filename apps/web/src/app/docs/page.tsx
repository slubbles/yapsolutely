import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Book, Code2, Wrench, Zap, ArrowRight, Terminal, FileText, Webhook } from "lucide-react";

export const metadata = {
  title: "Documentation | Yapsolutely",
  description: "Learn how to build, deploy, and manage AI voice agents with Yapsolutely.",
};

const sections = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Set up your first AI voice agent in minutes. Configure prompts, assign a phone number, and start handling calls.",
    links: [
      { label: "Quickstart guide", href: "/docs#quickstart" },
      { label: "Create your first agent", href: "/docs#first-agent" },
      { label: "Assign a phone number", href: "/docs#phone-setup" },
    ],
  },
  {
    icon: Code2,
    title: "API Reference",
    description: "Complete reference for the Yapsolutely REST API. Manage agents, calls, numbers, and transcripts programmatically.",
    links: [
      { label: "Authentication", href: "/docs/api#auth" },
      { label: "Agents API", href: "/docs/api#agents" },
      { label: "Calls API", href: "/docs/api#calls" },
      { label: "Numbers API", href: "/docs/api#numbers" },
    ],
  },
  {
    icon: Wrench,
    title: "Agent Configuration",
    description: "Deep-dive into prompt engineering, voice model selection, tool integrations, and call flow customization.",
    links: [
      { label: "System prompts", href: "/docs#prompts" },
      { label: "Voice models", href: "/docs#voices" },
      { label: "Tool integrations", href: "/docs#tools" },
      { label: "Transfer & escalation", href: "/docs#transfer" },
    ],
  },
  {
    icon: Webhook,
    title: "Webhooks & Events",
    description: "Receive real-time notifications when calls start, end, or when specific events occur during conversations.",
    links: [
      { label: "Webhook setup", href: "/docs#webhooks" },
      { label: "Event types", href: "/docs#events" },
      { label: "Payload reference", href: "/docs#payloads" },
    ],
  },
  {
    icon: Terminal,
    title: "SDKs & Libraries",
    description: "Official client libraries for Node.js, Python, and REST. Integrate Yapsolutely into your existing stack.",
    links: [
      { label: "Node.js SDK", href: "/docs#node-sdk" },
      { label: "Python SDK", href: "/docs#python-sdk" },
      { label: "REST examples", href: "/docs#rest" },
    ],
  },
  {
    icon: FileText,
    title: "Guides & Tutorials",
    description: "Step-by-step walkthroughs for common use cases: appointment booking, customer support, lead qualification, and more.",
    links: [
      { label: "Appointment booking agent", href: "/docs#appointment" },
      { label: "Customer support agent", href: "/docs#support" },
      { label: "Lead qualification", href: "/docs#lead-qual" },
    ],
  },
];

export default function DocsPage() {
  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-border-soft/40 mb-6">
            <Book className="w-3 h-3 text-text-subtle" />
            <span className="font-body text-[0.7rem] text-text-subtle tracking-wide">Documentation</span>
          </div>
          <h1 className="font-display text-[2rem] sm:text-[3rem] font-semibold tracking-[-0.03em] text-foreground mb-4 leading-[1.08]">
            Build voice agents
            <br className="hidden sm:block" />
            that handle real calls
          </h1>
          <p className="font-body text-[0.95rem] text-text-subtle max-w-xl leading-[1.65] mb-8">
            Everything you need to create, deploy, and monitor AI-powered phone agents. From your first quickstart to production-grade integrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="hero" size="lg" className="rounded-full font-display btn-press" asChild>
              <Link href="/docs#quickstart">
                Quickstart
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="rounded-full font-body" asChild>
              <Link href="/docs/api">API Reference</Link>
            </Button>
          </div>
        </div>

        {/* Documentation grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section, i) => (
            <div
              key={section.title}
              className="bg-surface-panel rounded-2xl border border-border-soft/60 p-6 hover:border-border-soft hover:shadow-surface-sm transition-all duration-200 group stagger-item"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="w-9 h-9 rounded-xl bg-foreground/[0.04] flex items-center justify-center mb-4">
                <section.icon className="w-4 h-4 text-text-subtle group-hover:text-text-body transition-colors" />
              </div>
              <h3 className="font-display text-[0.92rem] font-semibold text-text-strong tracking-[-0.01em] mb-1.5">
                {section.title}
              </h3>
              <p className="font-body text-[0.78rem] text-text-subtle leading-[1.6] mb-4">
                {section.description}
              </p>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-[0.75rem] text-text-body hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowRight className="w-2.5 h-2.5 text-text-subtle/40" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 sm:mt-24 bg-surface-elevated rounded-2xl border border-border-soft/40 p-8 sm:p-10 text-center">
          <h2 className="font-display text-[1.25rem] sm:text-[1.5rem] font-semibold text-text-strong tracking-[-0.02em] mb-2">
            Need help?
          </h2>
          <p className="font-body text-[0.85rem] text-text-subtle max-w-md mx-auto mb-6">
            Our team is here to help you get the most out of Yapsolutely. Reach out anytime.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="hero" size="default" className="rounded-full font-display" asChild>
              <a href="mailto:hello@yapsolutely.com">Contact support</a>
            </Button>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
