import PublicPageShell from "@/components/landing/PublicPageShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, Search, Flag, Download, Clock, Eye } from "lucide-react";

export const metadata = {
  title: "Call Transcripts | Yapsolutely",
  description: "Full transcripts for every AI phone call. Search, review, flag, and export conversation records for quality assurance.",
};

const benefits = [
  {
    icon: FileText,
    title: "Word-for-word transcripts",
    description: "Every call is transcribed in real time with speaker attribution. See exactly what the agent said and what the caller said, turn by turn.",
  },
  {
    icon: Search,
    title: "Full-text search",
    description: "Search across all transcripts instantly. Find specific conversations by keyword, caller question, or agent response. Nothing gets buried.",
  },
  {
    icon: Flag,
    title: "Flag and review",
    description: "Mark conversations that need human attention. Build a review queue for quality assurance, training data collection, or compliance audits.",
  },
  {
    icon: Download,
    title: "Export anywhere",
    description: "Download individual transcripts or bulk export your call data. CSV, text, and JSON formats give you flexibility for any downstream workflow.",
  },
  {
    icon: Clock,
    title: "Timestamped events",
    description: "Every transcript event carries a precise timestamp. Correlate what was said with when it was said for detailed post-call analysis.",
  },
  {
    icon: Eye,
    title: "Tool action visibility",
    description: "When your agent performs actions during a call — booking appointments, capturing leads, sending SMS — those actions appear inline in the transcript.",
  },
];

const useCases = [
  { title: "Quality assurance", description: "Review agent performance systematically. Identify patterns in how agents handle difficult questions and improve prompts based on real conversation data." },
  { title: "Compliance and audit trails", description: "Maintain a complete record of every interaction. Searchable, timestamped, and exportable for regulatory requirements or internal audits." },
  { title: "Agent training and iteration", description: "Use real transcripts to refine system prompts. See where agents go off-script, where callers get confused, and where conversations break down." },
];

export default function TranscriptsPage() {
  return (
    <PublicPageShell>
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <div className="mb-20 sm:mb-28">
          <span className="font-body text-[0.65rem] text-text-subtle/60 uppercase tracking-[0.2em] block mb-4">Feature</span>
          <h1 className="font-display text-[2rem] sm:text-[3.25rem] font-semibold tracking-[-0.03em] text-foreground mb-6 leading-[1.08]">
            Every conversation,
            <br className="hidden sm:block" />
            fully transcribed
          </h1>
          <p className="font-body text-[1rem] sm:text-[1.1rem] text-text-subtle max-w-2xl leading-[1.75] mb-8">
            Automatic, real-time transcripts for every call your agents handle. Search across your entire call history, flag conversations for review, and export data when you need it. No black boxes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
              <Link href="/sign-up">Start building <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button variant="ghost" size="lg" className="font-body text-[0.95rem] text-text-subtle" asChild>
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            Complete call visibility
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

        {/* Use cases */}
        <div className="mb-20 sm:mb-28">
          <h2 className="font-display text-[1.5rem] sm:text-[2rem] font-semibold tracking-[-0.02em] text-foreground mb-10">
            Built for teams that care about quality
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {useCases.map((uc) => (
              <div key={uc.title} className="bg-surface-elevated rounded-2xl p-7 border border-border-soft/20">
                <h3 className="font-display text-[1rem] font-semibold text-foreground mb-3">{uc.title}</h3>
                <p className="font-body text-[0.85rem] text-text-subtle leading-[1.7]">{uc.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-dark rounded-3xl p-10 sm:p-14 text-center mb-8">
          <h2 className="font-display text-[1.5rem] sm:text-[2.25rem] font-semibold tracking-[-0.02em] text-surface-dark-foreground mb-4 leading-[1.1]">
            See what your agents are really saying
          </h2>
          <p className="font-body text-[0.95rem] text-surface-dark-foreground/60 max-w-lg mx-auto mb-8 leading-[1.7]">
            Full transcripts from the first word. Sign up and get complete visibility into every conversation your agents handle.
          </p>
          <Button variant="hero" size="lg" className="rounded-full font-display text-[0.95rem] btn-press" asChild>
            <Link href="/sign-up">Get started free <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </PublicPageShell>
  );
}
