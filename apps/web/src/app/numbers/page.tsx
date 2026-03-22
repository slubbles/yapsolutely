import Link from "next/link";
import { deletePhoneNumberAction, registerPhoneNumberAction } from "@/app/_actions/phone-numbers";
import { ConsoleShell } from "@/components/console-shell";
import { FormSubmitButton } from "@/components/form-submit-button";
import { listAgentsForUser } from "@/lib/agent-data";
import { requireSession } from "@/lib/auth";
import { listPhoneNumbersWithAssignments } from "@/lib/phone-number-data";

function numberStatus(phoneNumber: { assignedAgentName: string | null; friendlyName: string | null }) {
  if (phoneNumber.assignedAgentName) {
    return { label: "Assigned", className: "bg-[var(--success-soft)] text-[#2f6f49]" };
  }

  if (phoneNumber.friendlyName) {
    return { label: "Unassigned", className: "bg-[var(--surface-subtle)] text-[var(--text-subtle)]" };
  }

  return { label: "Needs setup", className: "bg-[var(--warning-soft)] text-[#8d6336]" };
}

function contractStatus(phoneNumber: {
  assignedAgentName: string | null;
  friendlyName: string | null;
  twilioSid: string | null;
}) {
  if (phoneNumber.assignedAgentName && phoneNumber.twilioSid) {
    return {
      label: "Live contract",
      className: "bg-[var(--success-soft)] text-[#2f6f49]",
      note: "Mapped, identified, and ready for runtime lookup.",
    };
  }

  if (phoneNumber.assignedAgentName) {
    return {
      label: "Mapped only",
      className: "bg-[color:rgba(76,139,199,0.12)] text-[#466f9a]",
      note: "Assigned to an agent, but still missing a provider SID for cleaner ops traceability.",
    };
  }

  if (phoneNumber.friendlyName) {
    return {
      label: "Awaiting agent",
      className: "bg-[var(--warning-soft)] text-[#8d6336]",
      note: "Named and provisioned, but not yet attached to a live routing owner.",
    };
  }

  return {
    label: "Draft line",
    className: "bg-[var(--surface-subtle)] text-[var(--text-subtle)]",
    note: "Still needs naming, ownership, and runtime context before it should do real work.",
  };
}

function maskSid(value: string | null) {
  if (!value) {
    return "No SID recorded";
  }

  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

type NumbersPageProps = {
  searchParams?: Promise<{
    error?: string;
    created?: string;
    deleted?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function NumbersPage({ searchParams }: NumbersPageProps) {
  const session = await requireSession();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query = resolvedSearchParams?.q?.trim() || "";
  const status = resolvedSearchParams?.status?.trim().toUpperCase() || "ALL";
  const [phoneNumbers, agents] = await Promise.all([
    listPhoneNumbersWithAssignments(session.email, {
      query,
      status,
    }),
    listAgentsForUser(session.email),
  ]);
  const hasFilters = Boolean(query || status !== "ALL");
  const needsAttention = phoneNumbers.filter((item) => !item.assignedAgentName || !item.twilioSid).slice(0, 3);
  const assignedCount = phoneNumbers.filter((item) => item.assignedAgentName).length;
  const namedUnassignedCount = phoneNumbers.filter((item) => !item.assignedAgentName && item.friendlyName).length;
  const needsSetupCount = phoneNumbers.filter((item) => !item.assignedAgentName && !item.friendlyName).length;
  const sourceLineReadyCount = phoneNumbers.filter((item) => item.assignedAgentName && item.twilioSid).length;
  const coveredAgentsCount = new Set(phoneNumbers.filter((item) => item.assignedAgentId).map((item) => item.assignedAgentId)).size;
  const coverageRate = agents.length > 0 ? Math.round((coveredAgentsCount / agents.length) * 100) : 0;
  const routingChecklist = [
    {
      title: "Assign every production line",
      done: phoneNumbers.every((item) => !item.friendlyName || Boolean(item.assignedAgentName)),
      note: "Friendly names are a good sign, but named numbers should not sit ownerless for long.",
    },
    {
      title: "Capture provider SID",
      done: phoneNumbers.every((item) => !item.assignedAgentName || Boolean(item.twilioSid)),
      note: "Provider identifiers make debugging and handoff notes much calmer later.",
    },
    {
      title: "Cover active agents",
      done: agents.length === 0 ? false : coveredAgentsCount >= Math.min(agents.length, 2),
      note: "At least the frontline agents should have a clear inbound route before the demo path gets busy.",
    },
    {
      title: "Keep draft lines obvious",
      done: needsSetupCount === 0,
      note: "Unlabeled numbers should stand out immediately instead of lurking in the inventory.",
    },
  ];
  const sourceLineRows = phoneNumbers.slice(0, 4).map((phoneNumber) => ({
    ...phoneNumber,
    contract: contractStatus(phoneNumber),
  }));
  const agentCoverageRows = (agents.length > 0 ? agents.slice(0, 4).map((agent) => agent.name) : []).map((agentName) => ({
    agentName,
    numberCount: phoneNumbers.filter((item) => item.assignedAgentName === agentName).length,
  }));

  return (
    <ConsoleShell
      section="numbers"
      eyebrow="Numbers"
      title="Register and map inbound numbers to agents."
      description="Keep routing clear: register numbers, map them to the right agent, and make the runtime contract obvious from the same workspace."
      userEmail={session.email}
    >
      {resolvedSearchParams?.created ? (
        <div className="mb-6 rounded-[20px] border border-[color:rgba(47,111,73,0.16)] bg-[var(--success-soft)] px-5 py-4 text-sm text-[#2f6f49]">
          Phone number registered successfully.
        </div>
      ) : null}

      {resolvedSearchParams?.deleted ? (
        <div className="mb-6 rounded-[20px] border border-[color:rgba(47,111,73,0.16)] bg-[var(--success-soft)] px-5 py-4 text-sm text-[#2f6f49]">
          Phone number removed successfully.
        </div>
      ) : null}

      {resolvedSearchParams?.error ? (
        <div className="mb-6 rounded-[20px] border border-[color:rgba(210,120,80,0.18)] bg-[var(--warning-soft)] px-5 py-4 text-sm text-[var(--text-body)]">
          {resolvedSearchParams.error === "missing-phone-number"
            ? "A phone number is required."
            : resolvedSearchParams.error === "invalid-agent"
              ? "The selected agent is invalid for the current user."
              : resolvedSearchParams.error === "duplicate-phone-number"
                ? "That phone number is already registered."
                : resolvedSearchParams.error === "duplicate-twilio-sid"
                  ? "That Twilio SID is already registered."
                  : resolvedSearchParams.error === "not-found"
                    ? "That phone number record could not be found for the current user."
            : "Database is not configured yet, so the number could not be saved."}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-[var(--radius-panel)] bg-[var(--surface-dark)] p-6 text-[var(--surface-dark-foreground)] shadow-[var(--shadow-md)] sm:p-7">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.18em] text-[color:rgba(229,226,225,0.56)]">
            Deploy surface
          </div>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)] lg:items-end">
            <div>
              <h2 className="font-display text-[1.55rem] font-semibold tracking-[-0.04em] sm:text-[1.9rem]">
                Routing works best when every line has a clear owner, contract, and reason to exist.
              </h2>
              <p className="mt-3 max-w-2xl text-[0.86rem] leading-7 text-[color:rgba(229,226,225,0.68)]">
                This deploy workspace now treats phone numbers like real product infrastructure: register them cleanly, scope them to the right agent, and keep the runtime contract obvious before the next inbound call arrives.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <Link
                  href="/agents"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.76rem] font-medium text-[var(--surface-dark-foreground)] transition hover:bg-white/10"
                >
                  Review agents
                </Link>
                <a
                  href="#register-number"
                  className="rounded-full border border-white/10 px-4 py-2 text-[0.76rem] font-medium text-[color:rgba(229,226,225,0.72)] transition hover:bg-white/5 hover:text-[var(--surface-dark-foreground)]"
                >
                  Add number
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Assigned lines", value: String(assignedCount) },
                { label: "Source-line ready", value: String(sourceLineReadyCount) },
                { label: "Needs setup", value: String(namedUnassignedCount + needsSetupCount) },
                { label: "Agent coverage", value: `${coverageRate}%` },
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
              <h3 className="text-[1rem] font-semibold text-[var(--text-strong)]">Routing posture</h3>
              <p className="mt-1 text-[0.76rem] leading-6 text-[var(--text-subtle)]">
                A compact read on whether the inventory looks demo-ready or still half-staged.
              </p>
            </div>
            <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
              {sourceLineReadyCount} live contracts
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Routing owners",
                value: `${coveredAgentsCount}/${agents.length || 0}`,
                note: "How many workspace agents currently have at least one number attached.",
              },
              {
                label: "Named but unassigned",
                value: String(namedUnassignedCount),
                note: "Good intent, but these lines still need a responsible agent before they should ring live.",
              },
              {
                label: "Provider traceability",
                value: `${phoneNumbers.filter((item) => item.twilioSid).length}/${phoneNumbers.length}`,
                note: "Recorded Twilio SIDs make routing support and deployment handoff much less theatrical.",
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

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)]">
        <form className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)] md:grid-cols-[1fr_170px_auto]">
          <label className="block">
            <span className="sr-only">Search numbers</span>
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search numbers..."
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label className="block">
            <span className="sr-only">Status</span>
            <select
              name="status"
              defaultValue={status}
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(32,36,43,0.2)]"
            >
              <option value="ALL">All statuses</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="UNASSIGNED">Unassigned</option>
              <option value="NEEDS_SETUP">Needs setup</option>
            </select>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="mt-3 rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)]"
            >
              Filters
            </button>
            {hasFilters ? (
              <Link
                href="/numbers"
                className="mt-3 rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-medium text-[var(--text-body)] transition hover:text-[var(--text-strong)]"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Visible numbers", value: String(phoneNumbers.length), note: "Rows in the current search and routing filter." },
            { label: "Needs review", value: String(needsAttention.length), note: "Lines that are still missing ownership or provider traceability." },
            { label: "Agents covered", value: String(coveredAgentsCount), note: "Distinct agents that already have an inbound route." },
          ].map((item) => (
            <div key={item.label} className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-[var(--text-subtle)]">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--text-strong)]">{item.value}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead>
                  <tr className="border-b border-[var(--border-soft)]">
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Number</th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Agent</th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Status</th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Contract</th>
                    <th className="px-5 py-3 text-left text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Provider trace</th>
                    <th className="px-5 py-3 text-right text-[0.68rem] font-medium uppercase tracking-[0.1em] text-[var(--text-subtle)]">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {phoneNumbers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-sm text-[var(--text-body)]">
                        {hasFilters
                          ? "No numbers matched those filters yet. Try broadening the query or clearing the status filter."
                          : "No phone numbers registered yet. Add your first Twilio number below to start building the inbound routing layer."}
                      </td>
                    </tr>
                  ) : (
                    phoneNumbers.map((phoneNumber) => {
                      const statusInfo = numberStatus(phoneNumber);
                      const contractInfo = contractStatus(phoneNumber);

                      return (
                        <tr
                          key={phoneNumber.id}
                          className="border-b border-[var(--border-soft)] transition-colors last:border-b-0 hover:bg-[var(--surface-subtle)]/55"
                        >
                          <td className="px-5 py-4">
                            <div className="font-mono text-[0.78rem] text-[var(--text-body)]">{phoneNumber.phoneNumber}</div>
                            <div className="mt-1 text-[0.74rem] text-[var(--text-subtle)]">{phoneNumber.friendlyName || "Unnamed line"}</div>
                          </td>
                          <td className="px-5 py-4 text-[0.8rem] text-[var(--text-body)]">{phoneNumber.assignedAgentName || "—"}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${contractInfo.className}`}>
                              {contractInfo.label}
                            </span>
                            <div className="mt-1 text-[0.72rem] leading-6 text-[var(--text-subtle)]">{contractInfo.note}</div>
                          </td>
                          <td className="px-5 py-4 text-[0.75rem] text-[var(--text-subtle)]">
                            <div>Twilio · {maskSid(phoneNumber.twilioSid)}</div>
                          </td>
                          <td className="px-5 py-4 text-right text-[0.75rem] text-[var(--text-subtle)]">{phoneNumber.createdAt.toLocaleDateString()}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Routing rollout checklist</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-body)]">
                  A simple operator checklist so number inventory stays deliberate before runtime validation, Twilio webhook work, and live-call demos start leaning on it heavily.
                </p>
              </div>
              <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                register → map → trace → validate
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {routingChecklist.map((item) => (
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

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-[1.02rem] font-semibold text-[var(--text-strong)]">Runtime contract</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                  The voice runtime resolves inbound numbers through the shared product API. This is the contract that turns inventory into actual call routing.
                </p>
              </div>
              <div className="rounded-[18px] bg-[var(--surface-dark)] px-4 py-3 font-mono text-xs text-[var(--surface-dark-foreground)]">
                /api/runtime/resolve-agent?phoneNumber=%2B15551234567
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                "Numbers should be normalized and persisted exactly as the runtime will look them up.",
                "Assigned agents define the live resolution path for inbound calls hitting this number.",
                "Runtime requests must include the x-yapsolutely-runtime-secret header before the web app returns live routing details.",
              ].map((item) => (
                <div key={item} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-4 text-[0.78rem] leading-6 text-[var(--text-body)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Assignment summary</h3>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: "Total numbers", value: String(phoneNumbers.length) },
                { label: "Assigned", value: String(phoneNumbers.filter((item) => item.assignedAgentName).length) },
                { label: "Unassigned", value: String(phoneNumbers.filter((item) => !item.assignedAgentName).length) },
                { label: "Agents with numbers", value: String(new Set(phoneNumbers.filter((item) => item.assignedAgentId).map((item) => item.assignedAgentId)).size) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 px-1">
                  <span className="text-[0.78rem] text-[var(--text-body)]">{item.label}</span>
                  <span className="font-mono text-xs text-[var(--text-subtle)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Needs attention</h3>
            </div>
            <div className="p-4 space-y-2">
              {needsAttention.length > 0 ? (
                needsAttention.map((item) => {
                  const statusInfo = numberStatus(item);
                  const contractInfo = contractStatus(item);

                  return (
                    <div key={item.id} className="rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-[0.7rem] text-[var(--text-body)]">{item.phoneNumber}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[0.6rem] ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">
                        {item.assignedAgentName
                          ? `${item.friendlyName || "Number"} is mapped, but still worth reviewing routing details.`
                          : item.friendlyName
                            ? `Named \"${item.friendlyName}\" but not yet assigned to an agent.`
                            : "Number provisioned but not yet named or assigned to an agent."}
                      </p>
                      <p className="mt-2 text-[0.72rem] leading-relaxed text-[var(--text-body)]">{contractInfo.note}</p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-lg p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)] bg-[var(--surface-subtle)]/35">
                  No unassigned numbers in the current result set.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-soft)] px-5 py-4">
              <h3 className="text-sm font-medium text-[var(--text-strong)]">Source line readiness</h3>
            </div>
            <div className="p-4 space-y-2">
              {sourceLineRows.length > 0 ? (
                sourceLineRows.map((row) => (
                  <div key={row.id} className="rounded-lg p-3 transition-colors hover:bg-[var(--surface-subtle)]/40">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="font-mono text-[0.7rem] text-[var(--text-body)]">{row.phoneNumber}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[0.6rem] ${row.contract.className}`}>{row.contract.label}</span>
                    </div>
                    <p className="text-[0.72rem] leading-relaxed text-[var(--text-subtle)]">
                      {row.assignedAgentName || "No agent assigned"} · {maskSid(row.twilioSid)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-[var(--surface-subtle)]/35 p-3 text-[0.74rem] leading-6 text-[var(--text-subtle)]">
                  No registered numbers yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
            <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Agent coverage</h3>
            <div className="mt-4 space-y-3">
              {(agentCoverageRows.length > 0 ? agentCoverageRows : agents.slice(0, 4).map((agent) => ({ agentName: agent.name, numberCount: 0 }))).map((row) => (
                <div
                  key={row.agentName}
                  className="flex items-center justify-between rounded-[16px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/55 px-4 py-3"
                >
                  <span className="text-[0.78rem] text-[var(--text-body)]">{row.agentName}</span>
                  <span className="font-mono text-[0.68rem] text-[var(--text-subtle)]">{row.numberCount} lines</span>
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

      <form
        id="register-number"
        action={registerPhoneNumberAction}
        className="mt-6 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-sm)]"
      >
        <h2 className="text-[1.08rem] font-semibold text-[var(--text-strong)]">Register a number</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
          Until Twilio purchase automation is wired, manually register owned numbers and map them to the correct agent here.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Phone number</span>
            <input
              type="text"
              name="phoneNumber"
              placeholder="+15551234567"
              required
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Friendly name</span>
            <input
              type="text"
              name="friendlyName"
              placeholder="Main sales line"
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Assign to agent</span>
            <select
              name="agentId"
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition focus:border-[color:rgba(32,36,43,0.2)]"
              defaultValue=""
            >
              <option value="">Unassigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-medium text-[var(--text-body)]">Twilio SID</span>
            <input
              type="text"
              name="twilioSid"
              placeholder="PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="mt-3 h-11 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-strong)] outline-none transition placeholder:text-[color:rgba(124,129,139,0.8)] focus:border-[color:rgba(32,36,43,0.2)]"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-[24px] bg-[var(--surface-subtle)] p-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-xl text-sm leading-6 text-[var(--text-body)]">
            Once saved, this number becomes eligible for runtime lookup and can immediately participate in inbound call routing.
          </p>
          <div className="flex items-center gap-3">
            <FormSubmitButton
              label="Save number"
              pendingLabel="Saving number…"
              className="rounded-[18px] bg-[var(--text-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[color:rgba(22,24,29,0.92)] disabled:cursor-wait disabled:opacity-75"
            />
          </div>
        </div>
      </form>

      {phoneNumbers.length > 0 ? (
        <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[0.95rem] font-semibold text-[var(--text-strong)]">Cleanup</h3>
              <p className="mt-1 text-[0.78rem] leading-6 text-[var(--text-subtle)]">
                Remove numbers you no longer want available for routing in this workspace.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {phoneNumbers.map((phoneNumber) => (
              <form key={phoneNumber.id} action={deletePhoneNumberAction}>
                <input type="hidden" name="phoneNumberId" value={phoneNumber.id} />
                <FormSubmitButton
                  label={`Remove ${phoneNumber.phoneNumber}`}
                  pendingLabel="Removing…"
                  className="rounded-[14px] border border-[color:rgba(210,120,80,0.18)] bg-[var(--warning-soft)] px-3 py-2 text-xs font-medium text-[#8d6336] transition hover:opacity-85 disabled:cursor-wait disabled:opacity-75"
                />
              </form>
            ))}
          </div>
        </div>
      ) : null}
    </ConsoleShell>
  );
}