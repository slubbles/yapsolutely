import PublicPageShell from "@/components/landing/PublicPageShell";
import { Sparkles, Bug, Zap, ArrowUpRight, Lock, Phone, Bot, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Changelog — Yapsolutely",
  description: "Product updates, new features, and improvements to the Yapsolutely platform.",
};

type ChangeType = "feature" | "improvement" | "fix" | "security";

interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  description: string;
  changes: { type: ChangeType; text: string }[];
}

const typeConfig: Record<ChangeType, { label: string; icon: typeof Sparkles; color: string }> = {
  feature: { label: "Feature", icon: Sparkles, color: "text-violet-600 bg-violet-400/10" },
  improvement: { label: "Improvement", icon: Zap, color: "text-blue-600 bg-blue-400/10" },
  fix: { label: "Fix", icon: Bug, color: "text-amber-600 bg-amber-400/10" },
  security: { label: "Security", icon: Lock, color: "text-emerald-600 bg-emerald-400/10" },
};

const changelog: ChangelogEntry[] = [
  {
    date: "March 22, 2026",
    version: "0.9.0",
    title: "Design system polish & micro-interactions",
    description: "Major visual refinement pass across the entire platform with compact design language, skeleton loading states, and accessibility improvements.",
    changes: [
      { type: "improvement", text: "All loading skeletons aligned to compact design language" },
      { type: "improvement", text: "EmptyState component refined with tighter proportions" },
      { type: "feature", text: "Card-lift hover effect on interactive metric cards" },
      { type: "improvement", text: "Focus-visible keyboard navigation rings across all interactive elements" },
      { type: "fix", text: "Footer copyright year now renders dynamically" },
    ],
  },
  {
    date: "March 21, 2026",
    version: "0.8.0",
    title: "Compact dashboard & nav refinements",
    description: "Dashboard redesigned with compact metrics strip, refined AppNavRail with left accent bar, all pages aligned to consistent design tokens.",
    changes: [
      { type: "improvement", text: "Dashboard metrics converted to compact strip layout" },
      { type: "improvement", text: "AppNavRail active indicator changed to left accent bar" },
      { type: "improvement", text: "All dashboard pages aligned to 1.12rem/1100px/mb-5 pattern" },
      { type: "fix", text: "Removed dead PageHeader component" },
    ],
  },
  {
    date: "March 20, 2026",
    version: "0.7.0",
    title: "Deploy & system surfaces complete",
    description: "Numbers, batch-calls, billing, settings, and knowledge-base pages rebuilt with production-grade layouts.",
    changes: [
      { type: "feature", text: "Numbers page with metrics strip, compact table, and assignment dialog" },
      { type: "feature", text: "Batch calls campaign planning surface" },
      { type: "feature", text: "Billing page with cost drivers and metrics" },
      { type: "improvement", text: "Settings redesigned with compact section cards" },
    ],
  },
  {
    date: "March 19, 2026",
    version: "0.6.0",
    title: "Monitor surfaces & call management",
    description: "Calls list and detail pages rebuilt with stats strips, filter tabs, and compact data tables.",
    changes: [
      { type: "feature", text: "Calls list with filter tabs, stats strip, and 5-column table" },
      { type: "feature", text: "Call detail with 8/4 transcript + sidecar layout" },
      { type: "feature", text: "Analytics, QA, and alerts pages scaffolded" },
      { type: "improvement", text: "Call volume chart on dashboard" },
    ],
  },
  {
    date: "March 18, 2026",
    version: "0.5.0",
    title: "Agent workspace & flow builder",
    description: "Complete agent management surfaces with workspace tabs, detail views, and flow builder scaffolding.",
    changes: [
      { type: "feature", text: "Agent workspace with Overview/Build/Flow/Test tabs" },
      { type: "feature", text: "Agent detail page with metrics and recent calls" },
      { type: "feature", text: "Flow builder placeholder surface" },
      { type: "feature", text: "Agent create page with template selection" },
    ],
  },
  {
    date: "March 17, 2026",
    version: "0.4.0",
    title: "Landing page & auth rebuild",
    description: "Flagship landing page with editorial hero, trust strip, and product showcase. Auth pages redesigned with split-pane layout.",
    changes: [
      { type: "feature", text: "Asymmetric hero with proof stats grid" },
      { type: "feature", text: "Product showcase with platform feature cards" },
      { type: "feature", text: "Sign-in and sign-up with split-pane auth entry shell" },
      { type: "feature", text: "Onboarding funnel: secure-account → verify-identity → survey" },
    ],
  },
  {
    date: "March 15, 2026",
    version: "0.3.0",
    title: "Voice runtime & real-time pipeline",
    description: "Complete voice runtime with Deepgram STT/TTS, Anthropic Claude conversation engine, and Twilio integration.",
    changes: [
      { type: "feature", text: "Real-time voice pipeline with WebSocket streaming" },
      { type: "feature", text: "Conversation engine with tool calling support" },
      { type: "feature", text: "5 built-in tools: check_availability, book_appointment, transfer_call, lookup_customer, end_call" },
      { type: "security", text: "API key authentication for runtime endpoints" },
    ],
  },
  {
    date: "March 12, 2026",
    version: "0.2.0",
    title: "Database & agent management",
    description: "PostgreSQL schema with Prisma ORM, agent CRUD operations, and phone number management.",
    changes: [
      { type: "feature", text: "Prisma schema for agents, calls, phone numbers, transcripts" },
      { type: "feature", text: "Agent CRUD server actions" },
      { type: "feature", text: "Phone number provisioning and assignment" },
      { type: "security", text: "Google OAuth and bcrypt password authentication" },
    ],
  },
  {
    date: "March 10, 2026",
    version: "0.1.0",
    title: "Initial platform setup",
    description: "Monorepo structure with Next.js web app and Node.js voice runtime. Design tokens, fonts, and base component library.",
    changes: [
      { type: "feature", text: "Next.js 16 web application with Tailwind v4" },
      { type: "feature", text: "General Sans + Satoshi font system" },
      { type: "feature", text: "Design tokens: surfaces, text hierarchy, shadows, radii" },
      { type: "feature", text: "49+ shadcn/ui components configured" },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PublicPageShell>
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <h1 className="font-display text-[1.75rem] sm:text-[2.5rem] font-semibold tracking-[-0.03em] text-foreground mb-3 leading-[1.08]">
            Changelog
          </h1>
          <p className="font-body text-[0.9rem] text-text-subtle max-w-lg leading-[1.65]">
            Product updates, new features, and improvements. Follow along as we build the future of AI voice agents.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-0">
          {changelog.map((entry, idx) => (
            <div key={entry.version} className="relative pl-8 pb-12 last:pb-0">
              {/* Timeline line */}
              {idx < changelog.length - 1 && (
                <div className="absolute left-[7px] top-3 bottom-0 w-px bg-border-soft/60" />
              )}
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-border-soft bg-background" />

              <div className="flex items-center gap-3 mb-3">
                <span className="font-body text-[0.72rem] text-text-subtle">{entry.date}</span>
                <span className="font-mono text-[0.65rem] text-text-subtle/50 px-1.5 py-0.5 rounded bg-surface-subtle">{entry.version}</span>
              </div>

              <h2 className="font-display text-[1.05rem] font-semibold text-text-strong tracking-[-0.01em] mb-1.5">
                {entry.title}
              </h2>
              <p className="font-body text-[0.82rem] text-text-subtle leading-[1.6] mb-4">
                {entry.description}
              </p>

              <ul className="space-y-2">
                {entry.changes.map((change, i) => {
                  const cfg = typeConfig[change.type];
                  return (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.6rem] font-body font-medium shrink-0 mt-0.5 ${cfg.color}`}>
                        <cfg.icon className="w-2.5 h-2.5" />
                        {cfg.label}
                      </span>
                      <span className="font-body text-[0.78rem] text-text-body leading-[1.5]">{change.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PublicPageShell>
  );
}
