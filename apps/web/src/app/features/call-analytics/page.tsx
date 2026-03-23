import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Clock, CheckCircle, Filter, PieChart } from "lucide-react";

export const metadata = {
  title: "Call Analytics | Yapsolutely",
  description: "Track call volume, duration, resolution rates, and agent performance. Real-time analytics for your AI voice operation.",
};

const benefits = [
  {
    icon: BarChart3,
    title: "Real-time call metrics",
    description: "See call volume, average duration, and status breakdowns as they happen. Your dashboard updates with every completed call.",
  },
  {
    icon: TrendingUp,
    title: "Performance over time",
    description: "Track how your agents perform day over day and week over week. Spot trends, identify regressions, and measure the impact of prompt changes.",
  },
  {
    icon: CheckCircle,
    title: "Resolution tracking",
    description: "Know which calls were resolved autonomously, which needed transfer, and which failed. Resolution rate is the metric that matters most.",
  },
  {
    icon: Clock,
    title: "Duration analysis",
    description: "Understand how long your agents spend on calls. Short calls may indicate quick resolutions — or premature hang-ups. The data tells the story.",
  },
  {
    icon: Filter,
    title: "Filter by agent, number, or status",
    description: "Drill into specific agents, phone numbers, date ranges, or call outcomes. Find exactly the data you need without wading through noise.",
  },
  {
    icon: PieChart,
    title: "Export and integrate",
    description: "Download call data as CSV for use in spreadsheets, BI tools, or your own analytics stack. The data is yours to use however you need.",
  },
];

const metrics = [
  { label: "Total calls", value: "1,247", detail: "Last 30 days" },
  { label: "Avg duration", value: "3:42", detail: "Across all agents" },
  { label: "Resolution rate", value: "94%", detail: "Autonomous resolution" },
  { label: "Avg response time", value: "0.8s", detail: "First agent reply" },
];

export default function CallAnalyticsPage() {
  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <div className="mb-20 sm:mb-28">
          <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Feature</span>
          <h1 className="font-display text-[2rem] sm:text-[3.25rem] font-semibold tracking-[-0.03em] text-foreground mb-6 leading-[1.08]">
            Know exactly how your
            <br className="hidden sm:block" />
            agents are performing
          </h1>
          <p className="font-body text-[1rem] sm:text-[1.1rem] text-text-subtle max-w-2xl leading-[1.75] mb-8">
            Real-time call logs and analytics for your entire voice operation. Track volume, duration, resolution rates, and agent performance from a single dashboard. Data, not guesswork.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
              <Link href="/sign-up">Start tracking <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button variant="ghost" size="lg" className="font-body text-[0.95rem] text-text-subtle" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>

        {/* Sample metrics */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            Metrics that matter
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="bg-surface-elevated rounded-2xl p-6 border border-border-soft/20 text-center">
                <div className="font-display text-[1.75rem] sm:text-[2rem] font-bold text-foreground mb-1">{m.value}</div>
                <div className="font-display text-[0.85rem] font-medium text-foreground mb-1">{m.label}</div>
                <div className="font-body text-[0.7rem] text-text-subtle">{m.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits grid */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            Complete operational visibility
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-surface-elevated rounded-2xl p-6 border border-border-soft/20">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-text-body" />
                </div>
                <h3 className="font-display text-[1rem] font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="font-body text-[0.85rem] text-text-subtle leading-[1.7]">{b.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-dark rounded-3xl p-10 sm:p-14 text-center mb-8">
          <h2 className="font-display text-[1.5rem] sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-surface-dark-foreground mb-4 leading-[1.1]">
            Stop guessing. Start measuring.
          </h2>
          <p className="font-body text-[0.95rem] text-surface-dark-foreground/60 max-w-lg mx-auto mb-8 leading-[1.7]">
            Every call generates data. Yapsolutely turns that data into actionable insights so you can improve agent quality continuously.
          </p>
          <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
            <Link href="/sign-up">Get started free <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </PublicPageShell>
  );
}
