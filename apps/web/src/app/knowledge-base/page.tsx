import Link from "next/link";
import { ConsoleShell } from "@/components/console-shell";
import { listAgentsForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";
import { getSettingsReadiness } from "@/lib/settings-data";

type KnowledgeBasePageProps = {
  searchParams?: Promise<{
    q?: string;
    type?: string;
    status?: string;
  }>;
};

type SourceStatus = "healthy" | "syncing" | "attention" | "draft";

type SourceItem = {
  id: string;
  title: string;
  type: "Web" | "Doc" | "FAQ";
  location: string;
  assignedAgents: string[];
  freshness: string;
  chunks: number;
  status: SourceStatus;
  note: string;
  scope: string;
  nextStep: string;
};

type BlockerItem = {
  title: string;
  level: "warning" | "info";
  detail: string;
};

const statusOptions = ["ALL", "HEALTHY", "SYNCING", "ATTENTION", "DRAFT"] as const;
const typeOptions = ["ALL", "WEB", "DOC", "FAQ"] as const;

function statusBadge(status: SourceStatus) {
  switch (status) {
    case "healthy":
      return { label: "Healthy", className: "bg-[var(--success-soft)] text-[#2f6f49]" };
    case "syncing":
      return { label: "Syncing", className: "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]" };
    case "attention":
      return { label: "Needs review", className: "bg-[var(--warning-soft)] text-[#8d6336]" };
    default:
      return { label: "Draft", className: "bg-[var(--surface-subtle)] text-[var(--text-subtle)]" };
  }
}

function sourceTypeBadge(type: SourceItem["type"]) {
  switch (type) {
    case "Web":
      return "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]";
    case "Doc":
      return "bg-[var(--warning-soft)] text-[#8d6336]";
    default:
      return "bg-[var(--surface-subtle)] text-[var(--text-subtle)]";
  }
}

function readinessTone(done: boolean) {
  return done
    ? "bg-[var(--success-soft)] text-[#2f6f49]"
    : "bg-[var(--warning-soft)] text-[#8d6336]";
}

function blockerTone(level: BlockerItem["level"]) {
  return level === "warning"
    ? "border-[color:rgba(160,91,65,0.18)] bg-[var(--warning-soft)] text-[#8d6336]"
    : "border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 text-[var(--text-body)]";
}

export default async function KnowledgeBasePage({ searchParams }: KnowledgeBasePageProps) {
  const session = await requireSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim().toLowerCase() || "";
  const type = resolvedSearchParams?.type?.trim().toUpperCase() || "ALL";
  const status = resolvedSearchParams?.status?.trim().toUpperCase() || "ALL";
  const [agents, readiness] = await Promise.all([listAgentsForUser(session.email), getSettingsReadiness()]);
  const normalizedType = typeOptions.includes(type as (typeof typeOptions)[number]) ? type : "ALL";
  const normalizedStatus = statusOptions.includes(status as (typeof statusOptions)[number]) ? status : "ALL";

  const agentLabels = agents.slice(0, 3).map((agent) => agent.name);
  const fallbackLabels = ["Inbound Sales", "Support Triage", "Front Desk Concierge"];
  const attachedAgents = agentLabels.length > 0 ? agentLabels : fallbackLabels;

  const sources: SourceItem[] = [
    {
      id: "src-homepage",
      title: "Pricing and product overview",
      type: "Web",
      location: "https://yapsolutely.ai/pricing",
      assignedAgents: [attachedAgents[0]],
      freshness: "Updated 2 hours ago",
      chunks: 18,
      status: "healthy",
      note: "Used for pricing objections, package comparisons, and plan qualification.",
      scope: "Pricing and qualification",
      nextStep: "Keep crawl freshness below 24 hours while pricing is still shifting.",
    },
    {
      id: "src-support",
      title: "Support triage playbook",
      type: "Doc",
      location: "support-triage-playbook.pdf",
      assignedAgents: [attachedAgents[1] || attachedAgents[0]],
      freshness: "Updated yesterday",
      chunks: 27,
      status: "healthy",
      note: "Covers routing rules, escalation boundaries, and tone expectations.",
      scope: "Escalation and support policy",
      nextStep: "Promote this to a shared baseline source for every support-facing agent.",
    },
    {
      id: "src-faq",
      title: "Clinic intake FAQ",
      type: "FAQ",
      location: "faq/clinic-intake-v3",
      assignedAgents: attachedAgents.slice(0, 2),
      freshness: "Syncing now",
      chunks: 12,
      status: "syncing",
      note: "Useful for appointment questions, office hours, and intake prerequisites.",
      scope: "FAQ recall",
      nextStep: "Verify the latest office-hours copy before the next sync completes.",
    },
    {
      id: "src-policy",
      title: "Refund and cancellation policy",
      type: "Web",
      location: "https://yapsolutely.ai/policies/refunds",
      assignedAgents: [attachedAgents[0]],
      freshness: "Last synced 6 days ago",
      chunks: 9,
      status: "attention",
      note: "Needs a review because the source structure changed during the last crawl.",
      scope: "Policy handling",
      nextStep: "Re-map selectors or convert this to a maintained doc if the page keeps drifting.",
    },
    {
      id: "src-onboarding",
      title: "New patient welcome packet",
      type: "Doc",
      location: "new-patient-welcome.docx",
      assignedAgents: [attachedAgents[2] || attachedAgents[0]],
      freshness: "Draft source",
      chunks: 0,
      status: "draft",
      note: "Prepared for upload but not yet chunked into retrieval-ready content.",
      scope: "New-caller onboarding",
      nextStep: "Upload and chunk before attaching this source to any live agent.",
    },
  ];

  const filteredSources = sources.filter((source) => {
    const matchesQuery =
      !query ||
      source.title.toLowerCase().includes(query) ||
      source.location.toLowerCase().includes(query) ||
      source.assignedAgents.some((agent) => agent.toLowerCase().includes(query));

    const matchesType = normalizedType === "ALL" || source.type.toUpperCase() === normalizedType;
    const matchesStatus = normalizedStatus === "ALL" || source.status.toUpperCase() === normalizedStatus;

    return matchesQuery && matchesType && matchesStatus;
  });

  const hasFilters = Boolean(query || normalizedType !== "ALL" || normalizedStatus !== "ALL");
  const needsAttention = sources.filter((source) => source.status === "attention" || source.status === "draft");
  const activeSources = sources.filter((source) => source.status !== "draft");
  const attachedAgentCount = new Set(sources.flatMap((source) => source.assignedAgents)).size;
  const totalChunks = activeSources.reduce((sum, source) => sum + source.chunks, 0);
  const syncingSources = sources.filter((source) => source.status === "syncing");
  const healthySources = sources.filter((source) => source.status === "healthy");
  const retrievalReadyRate = activeSources.length > 0 ? Math.round((healthySources.length / activeSources.length) * 100) : 0;
  const referenceAgentCount = agents.length > 0 ? agents.length : attachedAgents.length;
  const agentCoverageRate = referenceAgentCount > 0 ? Math.round((attachedAgentCount / referenceAgentCount) * 100) : 0;
  const uncoveredAgentCount = Math.max(referenceAgentCount - attachedAgentCount, 0);
  const syncQueue = sources.filter((source) => source.status !== "healthy");
  const draftSources = sources.filter((source) => source.status === "draft");
  const attentionSource = needsAttention.find((source) => source.status === "attention") ?? null;
  const strongestSource = healthySources[0] ?? null;
  const syncingSource = syncingSources[0] ?? null;
  const agentCoverageRows = (agents.length > 0 ? agents.slice(0, 4).map((agent) => agent.name) : attachedAgents).map((agentName) => ({
    agentName,
    sourceCount: sources.filter((source) => source.assignedAgents.includes(agentName)).length,
  }));
  const retrievalChecklist = [
    {
      title: "Healthy sources lead the mix",
      done: healthySources.length >= Math.max(1, needsAttention.length),
      note: "Strong retrieval feels trustworthy when healthy sources outnumber the ones still drifting or waiting on review.",
    },
    {
      title: "Drafts stay out of live memory",
      done: draftSources.length === 0,
      note: "Draft content should not be treated like runtime truth until it has chunks, scope, and a clear owner.",
    },
    {
      title: "Agents have scoped coverage",
      done: attachedAgentCount >= Math.min(referenceAgentCount, 2),
      note: "At least the front-line agents should have retrieval context before you expect polished contextual answers live.",
    },
    {
      title: "Sync drift is controlled",
      done: syncingSources.length <= 1,
      note: "A little syncing is normal. A crowded queue means the system is between versions more often than it should be.",
    },
  ];
  const callerReadiness = [
    {
      label: "Can answer cleanly now",
      body: strongestSource
        ? `${strongestSource.title} looks retrieval-ready and is already attached to ${strongestSource.assignedAgents.join(", ")}.`
        : "No clearly healthy source stands out yet, so retrieval confidence is still mostly aspirational.",
    },
    {
      label: "Should be reviewed before trusting",
      body: attentionSource
        ? `${attentionSource.title} is flagged for review, so answers in that topic area could drift if no one checks it first.`
        : "No obvious review-drift source is currently flagged in the visible set.",
    },
    {
      label: "Still in motion",
      body: syncingSource
        ? `${syncingSource.title} is currently syncing, so the agent may be between old and new versions of that knowledge.`
        : "No active sync is visible right now, which is pleasantly boring in the best way.",
    },
    {
      label: "Not ready for live retrieval",
      body: draftSources[0]
        ? `${draftSources[0].title} is still a draft source and should stay out of any caller-facing knowledge path until it is chunked and scoped.`
        : "No draft sources are hanging around in the current set.",
    },
  ];
  const primaryRecommendation = draftSources[0]
    ? {
        title: `Promote ${draftSources[0].title} out of draft first`,
        note: "The fastest credibility win is converting draft material into retrieval-ready content before adding more surface area.",
        nextStep: draftSources[0].nextStep,
      }
    : attentionSource
      ? {
          title: `Repair drift in ${attentionSource.title}`,
          note: "Review debt is more dangerous than missing content, because callers can get confidently stale answers.",
          nextStep: attentionSource.nextStep,
        }
      : uncoveredAgentCount > 0
        ? {
            title: "Expand source coverage across more agents",
            note: `${uncoveredAgentCount} visible workspace agent${uncoveredAgentCount === 1 ? " is" : "s are"} still missing scoped knowledge coverage.`,
            nextStep: "Attach at least one healthy, high-signal source to every front-line agent before broadening the library.",
          }
        : syncingSource
          ? {
              title: `Verify ${syncingSource.title} once sync completes`,
              note: "A sync in flight is fine, but it still means the system is between old and new truth right now.",
              nextStep: syncingSource.nextStep,
            }
          : {
              title: "Promote healthy sources into a repeatable baseline",
              note: "The current source set looks reasonably calm, so the next step is standardizing what every agent should inherit by default.",
              nextStep: strongestSource
                ? `Use ${strongestSource.title} as part of the baseline retrieval stack for similar agents.`
                : "Document the default source bundle before the library grows noisier.",
            };

  const ingestBlockers: BlockerItem[] = [
    draftSources.length > 0
      ? {
          title: "Draft sources are still sitting outside retrieval",
          level: "warning",
          detail: `${draftSources.length} draft source${draftSources.length === 1 ? " is" : "s are"} still unchunked, which means promising content exists without being safe to use live.`,
        }
      : null,
    attentionSource
      ? {
          title: "At least one live source needs review",
          level: "warning",
          detail: `${attentionSource.title} is already attached but flagged for drift, so the knowledge layer needs inspection before it earns trust.`,
        }
      : null,
    !readiness.readyForLiveValidation
      ? {
          title: "Environment still limits honest live retrieval validation",
          level: "warning",
          detail:
            readiness.missingKeys.length > 0
              ? `Live validation is still blocked by ${readiness.missingKeys.length} missing configuration value${readiness.missingKeys.length === 1 ? "" : "s"}.`
              : "Provider wiring still needs final validation before knowledge performance should be treated as fully production-real.",
        }
      : null,
    uncoveredAgentCount > 0
      ? {
          title: "Knowledge coverage is uneven across agents",
          level: "info",
          detail: `${uncoveredAgentCount} visible workspace agent${uncoveredAgentCount === 1 ? " is" : "s are"} still missing attached source coverage in the current set.`,
        }
      : null,
  ].filter((item): item is BlockerItem => Boolean(item));

  return (
    <ConsoleShell
      eyebrow="Knowledge base"
      section="knowledge"
      title="Bring docs, webpages, and business context into the build layer."
      description="Give agents retrieval-ready source material so the runtime can answer with context instead of cheerful improvisation."
      userEmail={session.email}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
            Build surface
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] sm:text-[1.9rem]">
                Retrieval quality starts with calm source hygiene, not hopeful prompting.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                Treat docs, webpages, and internal FAQs like build assets: ingest them deliberately, scope them to the right agents, and keep freshness visible before callers ever hear an answer.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <a
                  href="#source-intake"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Plan intake
                </a>
                <Link
                  href="/agents"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Review agents
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Healthy sources", value: String(healthySources.length) },
                { label: "Sync queue", value: String(syncQueue.length) },
                { label: "Total chunks", value: String(totalChunks) },
                { label: "Coverage", value: `${agentCoverageRate}%` },
              ].map((item) => (
                <div key={item.label} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[color:rgba(229,226,225,0.48)]">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-[var(--surface-dark-foreground)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">What should happen next</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                A practical recommendation based on today’s source inventory, coverage, and live-readiness posture.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              {retrievalReadyRate}% ready
            </span>
          </div>
          <div className="mt-4 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
            <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{primaryRecommendation.title}</div>
            <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{primaryRecommendation.note}</p>
            <p className="mt-3 text-[0.72rem] leading-6 text-[var(--text-subtle)]">{primaryRecommendation.nextStep}</p>
          </div>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Healthy sync ratio",
                value: `${healthySources.length}/${activeSources.length || 0}`,
                note: "Sources already chunked and not currently drifting or waiting on review.",
              },
              {
                label: "Review debt",
                value: `${needsAttention.length} sources`,
                note: "Anything in attention or draft mode should be treated as build work, not trusted runtime memory.",
              },
              {
                label: "Agent attachment",
                value: `${attachedAgentCount}/${referenceAgentCount}`,
                note: "How many visible workspace agents already have at least one scoped source.",
              },
              {
                label: "Environment posture",
                value: readiness.readyForLiveValidation ? "Ready for honest validation" : "Planning-first mode",
                note: readiness.readyForLiveValidation
                  ? "The current environment contract supports taking retrieval quality more seriously under live conditions."
                  : "Knowledge planning can continue, but provider/runtime gaps still limit honest end-to-end validation.",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">{item.label}</div>
                <div className="mt-2 text-[0.95rem] font-medium text-[var(--text-strong)]">{item.value}</div>
                <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">If a caller asked right now</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
                A practical read on what the current source set is actually safe to answer, what is still drifting, and what should stay out of live retrieval until it grows up.
              </p>
            </div>
            <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
              ingest → verify → answer
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {callerReadiness.map((item, index) => (
              <div key={item.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--text-strong)] text-[0.72rem] font-semibold text-white">
                    {index + 1}
                  </div>
                  <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{item.label}</div>
                </div>
                <p className="mt-3 text-[0.78rem] leading-6 text-[var(--text-body)]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Knowledge launch checklist</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                The fast operator pass before letting retrieval shape live answers.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              {retrievalChecklist.filter((item) => item.done).length}/{retrievalChecklist.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {retrievalChecklist.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.72rem] font-semibold ${readinessTone(item.done)}`}>
                    {item.done ? "✓" : "!"}
                  </span>
                  <div className="text-[0.82rem] font-medium text-[var(--text-strong)]">{item.title}</div>
                </div>
                <p className="mt-3 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.16fr_0.84fr]">
        <form className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)] md:grid-cols-[1fr_180px_180px_auto]">
          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Search sources</span>
            <input
              type="search"
              name="q"
              defaultValue={resolvedSearchParams?.q || ""}
              placeholder="Title, URL, filename, or attached agent..."
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Type</span>
            <select
              name="type"
              defaultValue={normalizedType}
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(32,36,43,0.2)]"
            >
              <option value="ALL">All types</option>
              <option value="WEB">Webpages</option>
              <option value="DOC">Documents</option>
              <option value="FAQ">FAQs</option>
            </select>
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Status</span>
            <select
              name="status"
              defaultValue={normalizedStatus}
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(32,36,43,0.2)]"
            >
              <option value="ALL">All statuses</option>
              <option value="HEALTHY">Healthy</option>
              <option value="SYNCING">Syncing</option>
              <option value="ATTENTION">Needs review</option>
              <option value="DRAFT">Draft</option>
            </select>
          </label>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
            >
              Apply filters
            </button>
            {hasFilters ? (
              <Link
                href="/knowledge-base"
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Visible sources", value: String(filteredSources.length), note: "Results in the current search and status view." },
            { label: "Attached agents", value: String(attachedAgentCount), note: "Distinct agents currently scoped to at least one knowledge source." },
            { label: "Healthy syncs", value: String(healthySources.length), note: "Sources that look retrieval-ready without needing review first." },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]"
            >
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--text-subtle)]">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-5">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px]">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Source</th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Type</th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Scope</th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Attached agents</th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Chunks</th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Status</th>
                    <th className="px-5 py-3 text-right text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Freshness</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSources.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10">
                        <h3 className="text-lg font-semibold text-[var(--text-strong)]">No sources matched those filters</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-body)]">
                          Try broadening the query or clearing the filters. This view checks titles, source locations, attached agent names, and source health.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredSources.map((source) => {
                      const badge = statusBadge(source.status);

                      return (
                        <tr
                          key={source.id}
                          className="border-b border-[var(--border-soft)] transition-colors last:border-b-0 hover:bg-[var(--surface-subtle)]/55"
                        >
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{source.title}</div>
                              <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.64rem] font-medium ${sourceTypeBadge(source.type)}`}>
                                {source.type}
                              </span>
                            </div>
                            <div className="mt-1 text-[0.74rem] text-[var(--text-subtle)]">{source.location}</div>
                            <div className="mt-1 max-w-[34rem] text-[0.74rem] leading-6 text-[var(--text-body)]">{source.note}</div>
                          </td>
                          <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">{source.type}</td>
                          <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">{source.scope}</td>
                          <td className="px-5 py-4 text-[0.78rem] text-[var(--text-body)]">
                            {source.assignedAgents.join(", ")}
                          </td>
                          <td className="px-5 py-4 font-mono text-[0.76rem] text-[var(--text-subtle)]">{source.chunks}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${badge.className}`}>
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right text-[0.75rem] text-[var(--text-subtle)]">{source.freshness}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div
            id="source-intake"
            className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Source intake lanes</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
                  Pick the right ingestion path up front so retrieval stays scoped, fresh, and calm instead of turning into one giant mystery bucket.
                </p>
              </div>
              <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                source → chunk → attach → retrieve
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                {
                  title: "Web crawler intake",
                  note: "Use for pricing, policies, and fast-moving pages that already exist publicly.",
                  action: "Track freshness and selector drift so the agent does not quote stale pages with confidence.",
                },
                {
                  title: "Document upload lane",
                  note: "Use for PDFs, handbooks, onboarding packets, and internal SOPs that need chunking first.",
                  action: "Prioritize chunk count, ownership, and approved audience before attaching to a live workflow.",
                },
                {
                  title: "Structured FAQ memory",
                  note: "Use for small high-signal question sets where answer accuracy matters more than broad recall.",
                  action: "Pair with the relevant agent and keep copy tight enough that retrieval stays deterministic.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4"
                >
                  <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{item.title}</div>
                  <p className="mt-2 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                  <p className="mt-3 text-[0.72rem] leading-6 text-[var(--text-subtle)]">{item.action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Ingestion operating rules</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
                  Treat ingestion like build discipline, not a content dump: every source needs freshness, ownership, scoped attachment, and a reason it belongs in the live retrieval path.
                </p>
              </div>
              <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                source → chunk → attach → retrieve
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                "Webpages should carry crawl freshness and ownership status.",
                "Uploaded docs should expose chunk count and retrieval readiness.",
                "Agent attachment must stay scoped so one team’s source does not leak into another flow.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 text-[0.78rem] leading-6 text-[var(--text-body)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div
            id="rollout-checklist"
            className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Retrieval rollout checklist</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
                  A lightweight operator checklist so retrieval readiness feels deliberate before it reaches any live caller flow.
                </p>
              </div>
              <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                {healthySources.length} ready now
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                {
                  title: "Chunk the draft queue",
                  done: sources.every((source) => source.status !== "draft"),
                  note: "Draft sources should never reach runtime until they have real chunk counts and ownership.",
                },
                {
                  title: "Resolve sync drift",
                  done: sources.every((source) => source.status !== "attention"),
                  note: "Any attention source should be reviewed before it quietly becomes caller-facing truth.",
                },
                {
                  title: "Scope agents cleanly",
                  done: attachedAgentCount >= Math.min(referenceAgentCount, 2),
                  note: "Attachment should be intentional enough that at least the active frontline agents have source coverage.",
                },
                {
                  title: "Watch freshness",
                  done: syncingSources.length === 0,
                  note: "Syncing is healthy during change, but it still means the system is between versions right now.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.72rem] font-semibold ${item.done ? "bg-[var(--success-soft)] text-[#2f6f49]" : "bg-[var(--warning-soft)] text-[#8d6336]"}`}
                    >
                      {item.done ? "✓" : "!"}
                    </span>
                    <div className="text-[0.84rem] font-medium text-[var(--text-strong)]">{item.title}</div>
                  </div>
                  <p className="mt-3 text-[0.76rem] leading-6 text-[var(--text-body)]">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Launch blockers</h3>
            </div>
            <div className="space-y-3 p-4">
              {ingestBlockers.map((item) => (
                <div key={item.title} className={["rounded-[16px] border px-4 py-4", blockerTone(item.level)].join(" ")}>
                  <div className="text-[0.78rem] font-medium">{item.title}</div>
                  <p className="mt-2 text-[0.74rem] leading-6 opacity-90">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Scope summary</h3>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: "Active sources", value: String(activeSources.length) },
                { label: "Needs review", value: String(needsAttention.length) },
                { label: "Workspace agents", value: String(agents.length) },
                { label: "Avg. chunks / active", value: activeSources.length > 0 ? String(Math.round(activeSources.reduce((sum, source) => sum + source.chunks, 0) / activeSources.length)) : "0" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between px-1 py-1.5">
                  <span className="text-[0.78rem] text-[var(--text-body)]">{item.label}</span>
                  <span className="font-mono text-xs text-[var(--text-subtle)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Sync queue</h3>
            </div>
            <div className="p-4 space-y-2">
              {syncQueue.length > 0 ? (
                syncQueue.map((source) => {
                  const badge = statusBadge(source.status);

                  return (
                    <div key={source.id} className="rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-[0.74rem] font-medium text-[var(--text-strong)]">{source.title}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[0.6rem] ${badge.className}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">{source.nextStep}</p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No sync queue right now. Gloriously uneventful.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Needs attention</h3>
            </div>
            <div className="p-4 space-y-2">
              {needsAttention.map((source) => {
                const badge = statusBadge(source.status);

                return (
                  <div key={source.id} className="rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[0.74rem] font-medium text-[var(--text-strong)]">{source.title}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[0.6rem] ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">{source.note}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Agent coverage</h3>
            <div className="mt-4 space-y-3">
              {agentCoverageRows.map((row) => (
                <div
                  key={row.agentName}
                  className="flex items-center justify-between rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-3"
                >
                  <span className="text-[0.78rem] text-[var(--text-body)]">{row.agentName}</span>
                  <span className="font-mono text-[0.68rem] text-[var(--text-subtle)]">
                    {row.sourceCount} sources
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm">
              <Link href="/agents" className="font-medium text-[var(--text-strong)] underline underline-offset-4">
                Review agent routing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}