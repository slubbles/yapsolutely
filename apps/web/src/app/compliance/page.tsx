import PublicPageShell from "@/components/landing/PublicPageShell";
import { Shield, Globe, Lock, Eye, FileCheck, Server, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Compliance | Yapsolutely",
  description: "Learn how Yapsolutely meets GDPR, CCPA, TCPA, and other regulatory requirements.",
};

const frameworks = [
  {
    icon: Globe,
    title: "GDPR",
    subtitle: "General Data Protection Regulation",
    items: [
      "Data processing agreements (DPA) available on request",
      "Right to access, rectify, and delete personal data",
      "Data portability — export your data at any time",
      "Lawful basis for processing documented for all data flows",
      "Sub-processor list maintained and available",
      "72-hour breach notification commitment",
    ],
  },
  {
    icon: Shield,
    title: "CCPA / CPRA",
    subtitle: "California Consumer Privacy Act",
    items: [
      "Right to know what personal information is collected",
      "Right to delete personal information",
      "Right to opt out of sale of personal information",
      "We do not sell personal information to third parties",
      "Non-discrimination for exercising privacy rights",
    ],
  },
  {
    icon: FileCheck,
    title: "TCPA",
    subtitle: "Telephone Consumer Protection Act",
    items: [
      "AI disclosure requirements documented in Terms of Service",
      "Users must ensure callers are informed they are speaking with AI",
      "Platform supports consent-based call handling workflows",
      "Do-not-call list integration guidance provided",
      "Call recording consent workflows available",
    ],
  },
];

const practices = [
  { icon: Lock, title: "Encryption", desc: "All data encrypted in transit (TLS 1.3) and at rest (AES-256). Database connections use SSL." },
  { icon: Server, title: "Infrastructure", desc: "Hosted on dedicated infrastructure with network isolation, automated backups, and access controls." },
  { icon: Eye, title: "Access control", desc: "Role-based access, session-based authentication, bcrypt password hashing, and OAuth 2.0 support." },
  { icon: Shield, title: "Vendor security", desc: "All third-party providers (Twilio, Deepgram, Anthropic) operate under data processing agreements with SOC 2 compliance." },
  { icon: FileCheck, title: "Audit trail", desc: "Full call logs, transcript history, and system events recorded for compliance and review purposes." },
  { icon: Globe, title: "Data residency", desc: "Primary infrastructure in US data centers. Contact us for specific data residency requirements." },
];

export default function CompliancePage() {
  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border-soft/40 mb-6">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-body text-[0.7rem] text-text-subtle tracking-wide">Security &amp; Compliance</span>
          </span>
          <h1 className="font-display text-[2rem] sm:text-[3rem] font-semibold tracking-[-0.03em] text-foreground mb-4 leading-[1.08]">
            Built for trust and compliance
          </h1>
          <p className="font-body text-[0.95rem] text-text-subtle max-w-lg mx-auto leading-[1.65]">
            We take data protection seriously. Yapsolutely is designed to meet the requirements of major privacy and telecommunications regulations.
          </p>
        </div>

        {/* Regulatory frameworks */}
        <div className="space-y-6 mb-20">
          {frameworks.map((fw) => (
            <div key={fw.title} className="bg-surface-panel rounded-2xl border border-border-soft/60 p-7 sm:p-9">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <fw.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-display text-[1.1rem] font-semibold text-text-strong tracking-[-0.01em]">{fw.title}</h2>
                  <p className="font-body text-[0.78rem] text-text-subtle">{fw.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fw.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="font-body text-[0.82rem] text-text-body leading-[1.6]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Security practices */}
        <div className="mb-20">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.025em] text-foreground mb-8 text-center">
            Security practices
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {practices.map((p) => (
              <div key={p.title} className="bg-surface-panel rounded-xl border border-border-soft/60 p-6">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <p.icon className="w-4.5 h-4.5 text-text-body" />
                </div>
                <h3 className="font-display text-[0.88rem] font-medium text-text-strong mb-1.5">{p.title}</h3>
                <p className="font-body text-[0.78rem] text-text-subtle leading-[1.65]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-dark rounded-2xl p-10 sm:p-14 text-center mb-10">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.025em] text-surface-dark-foreground mb-3 leading-[1.1]">
            Questions about compliance?
          </h2>
          <p className="font-body text-[0.88rem] text-surface-dark-foreground/40 max-w-md mx-auto mb-8 leading-[1.65]">
            If you need a DPA, have questions about data handling, or require documentation for your compliance review, reach out to our team.
          </p>
          <a
            href="mailto:compliance@yapsolutely.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-dark-foreground text-surface-dark hover:bg-surface-dark-foreground/90 font-display font-medium text-[0.92rem] transition-colors"
          >
            Contact compliance team
          </a>
        </div>
      </div>
    </PublicPageShell>
  );
}
