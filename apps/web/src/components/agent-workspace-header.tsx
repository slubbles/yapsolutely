import Link from "next/link";
import { AgentStatus } from "@prisma/client";

type AgentWorkspaceHeaderProps = {
  agent: {
    id: string;
    name: string;
    description: string | null;
    status: AgentStatus;
    isActive: boolean;
    voiceModel: string | null;
    updatedAt: Date;
    phoneNumbers: Array<{ id: string }>;
    calls: Array<{ id: string }>;
  };
  currentView: "overview" | "build" | "test" | "deploy" | "monitor";
};

function statusClassName(status: AgentStatus, isActive: boolean) {
  if (!isActive || status === AgentStatus.ARCHIVED) {
    return "bg-[var(--surface-subtle)] text-[var(--text-subtle)]";
  }

  if (status === AgentStatus.ACTIVE) {
    return "bg-[var(--success-soft)] text-[#2f6f49]";
  }

  if (status === AgentStatus.DRAFT) {
    return "bg-[var(--warning-soft)] text-[#8d6336]";
  }

  return "bg-[var(--surface-subtle)] text-[var(--text-subtle)]";
}

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return "—";
  }

  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const views = [
  { key: "overview", label: "Overview", href: (agentId: string) => `/agents/${agentId}` },
  { key: "build", label: "Build", href: (agentId: string) => `/agents/${agentId}/build` },
  { key: "test", label: "Test", href: (agentId: string) => `/agents/${agentId}/test` },
  { key: "deploy", label: "Deploy", href: (agentId: string) => `/agents/${agentId}/deploy` },
  { key: "monitor", label: "Monitor", href: (agentId: string) => `/agents/${agentId}/monitor` },
] as const;

export function AgentWorkspaceHeader({ agent, currentView }: AgentWorkspaceHeaderProps) {
  return (
    <div className="mb-5 space-y-4">
      <div className="rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-panel)] px-5 py-5 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              href="/agents"
              className="inline-flex items-center gap-1.5 text-[0.75rem] text-[var(--text-subtle)] transition hover:text-[var(--text-strong)]"
            >
              ← Back to agents
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h2 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[var(--text-strong)] sm:text-[1.62rem]">
                {agent.name}
              </h2>
              <span
                className={`inline-flex rounded-[10px] px-2.5 py-1 text-[0.68rem] font-medium ${statusClassName(agent.status, agent.isActive)}`}
              >
                {agent.status}
              </span>
              <span className="inline-flex rounded-[10px] bg-[var(--surface-subtle)] px-2.5 py-1 text-[0.68rem] font-medium text-[var(--text-subtle)]">
                {agent.isActive ? "Callable" : "Inactive"}
              </span>
            </div>
            <p className="mt-3 max-w-3xl text-[0.86rem] leading-7 text-[var(--text-body)]">
              {agent.description ||
                "This agent record powers runtime lookup, number assignment, and live call capture. The rest of the workspace simply makes those levers easier to operate."}
            </p>
          </div>

          <div className="grid min-w-[230px] grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {[
              { label: "Calls", value: agent.calls.length.toString() },
              { label: "Numbers", value: agent.phoneNumbers.length.toString() },
              { label: "Updated", value: formatDate(agent.updatedAt) },
              { label: "Voice", value: agent.voiceModel || "Default" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--surface-subtle)]/65 px-4 py-3"
              >
                <div className="text-[0.62rem] uppercase tracking-[0.12em] text-[var(--text-subtle)]">
                  {item.label}
                </div>
                <div className="mt-1 text-[0.82rem] font-medium text-[var(--text-strong)]">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-[22px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-2 shadow-[var(--shadow-sm)]">
        {views.map((view) => {
          const active = view.key === currentView;

          return (
            <Link
              key={view.key}
              href={view.href(agent.id)}
              className={[
                "rounded-[16px] px-4 py-2.5 text-[0.8rem] font-medium transition",
                active
                  ? "bg-[var(--text-strong)] text-white"
                  : "text-[var(--text-subtle)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-strong)]",
              ].join(" ")}
            >
              {view.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}