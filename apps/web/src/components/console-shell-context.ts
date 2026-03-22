export type ConsoleShellContextItem = {
  label: string;
  href?: string;
  matchPaths?: string[];
  note?: string;
};

export type ConsoleShellContextAction = {
  label: string;
  href: string;
  style?: "primary" | "secondary";
};

export type ConsoleShellContext = {
  title: string;
  description: string;
  items: ConsoleShellContextItem[];
  actions: ConsoleShellContextAction[];
};

export type ConsoleShellSection =
  | "dashboard"
  | "agents"
  | "calls"
  | "numbers"
  | "knowledge"
  | "batch"
  | "monitor"
  | "settings"
  | "billing"
  | "workspace";

const sectionContexts: Record<ConsoleShellSection, ConsoleShellContext> = {
  agents: {
    title: "Agent workspace",
    description: "Build, activate, and refine the voices that actually answer incoming calls.",
    items: [
      { label: "Overview", note: "Identity, recent calls, and connected records live on the base agent route." },
      { label: "Build", note: "Prompt, voice, and first-message controls are grouped in one calmer editing surface." },
      { label: "Test", note: "Reserved for browser simulation and preflight validation once live-call hardening is complete." },
      { label: "Deploy", note: "Lifecycle state, number assignment, and runtime eligibility belong here." },
      { label: "Monitor", note: "Recent call outcomes and agent-specific review belong here." },
    ],
    actions: [
      { label: "All agents", href: "/agents", style: "secondary" },
      { label: "Create new agent", href: "/agents/new", style: "primary" },
      { label: "Review number assignments", href: "/numbers", style: "secondary" },
    ],
  },
  calls: {
    title: "Call review",
    description: "Use transcript evidence and outcome filters to spot where the runtime needs attention.",
    items: [
      { label: "All calls", href: "/calls", matchPaths: ["/calls"] },
      { label: "Completed", href: "/calls?status=COMPLETED" },
      { label: "In progress", href: "/calls?status=IN_PROGRESS" },
      { label: "Failed", href: "/calls?status=FAILED" },
      { label: "No answer", href: "/calls?status=NO_ANSWER" },
    ],
    actions: [
      { label: "Review flagged calls", href: "/calls?status=FAILED", style: "primary" },
      { label: "Open all transcripts", href: "/calls", style: "secondary" },
    ],
  },
  numbers: {
    title: "Number routing",
    description: "Keep inbound number ownership, agent mapping, and runtime lookup aligned from one place.",
    items: [
      { label: "Inventory", href: "/numbers", matchPaths: ["/numbers"] },
      { label: "Assigned", href: "/numbers?status=ASSIGNED" },
      { label: "Unassigned", href: "/numbers?status=UNASSIGNED" },
      { label: "Needs setup", href: "/numbers?status=NEEDS_SETUP" },
      { label: "Agent list", href: "/agents", matchPaths: ["/agents"] },
    ],
    actions: [
      { label: "Register a number", href: "/numbers#register-number", style: "primary" },
      { label: "Review agents", href: "/agents", style: "secondary" },
    ],
  },
  dashboard: {
    title: "Workspace home",
    description: "The operator home should summarize what matters now without drowning the user in equal-weight modules.",
    items: [
      { label: "Current state", note: "Active agents, assigned numbers, call volume, and runtime posture." },
      { label: "Recent proof", note: "Fresh calls and tool activity should stay one click away from the home surface." },
      { label: "Next actions", note: "The page should naturally point toward agent setup, routing, and readiness work." },
    ],
    actions: [
      { label: "Open agents", href: "/agents", style: "primary" },
      { label: "Review calls", href: "/calls", style: "secondary" },
    ],
  },
  knowledge: {
    title: "Knowledge layer",
    description: "Sources, sync state, and retrieval context should eventually live here as part of the build workflow.",
    items: [
      { label: "Knowledge base", href: "/knowledge-base", matchPaths: ["/knowledge-base"] },
      { label: "Agents", href: "/agents", matchPaths: ["/agents"] },
      { label: "Settings", href: "/settings", matchPaths: ["/settings"] },
    ],
    actions: [{ label: "Review agents", href: "/agents", style: "primary" }],
  },
  batch: {
    title: "Campaign deploy",
    description: "Outbound and follow-up workflows will eventually live here once inbound demo priorities are fully satisfied.",
    items: [
      { label: "Batch calls", href: "/batch-calls", matchPaths: ["/batch-calls"] },
      { label: "Numbers", href: "/numbers", matchPaths: ["/numbers"] },
      { label: "Calls", href: "/calls", matchPaths: ["/calls"] },
    ],
    actions: [{ label: "Review number routing", href: "/numbers", style: "primary" }],
  },
  monitor: {
    title: "Monitoring",
    description: "These surfaces are where proof turns into operational learning, quality loops, and actionable warnings.",
    items: [
      { label: "Calls", href: "/calls", matchPaths: ["/calls"] },
      { label: "Analytics", href: "/analytics", matchPaths: ["/analytics"] },
      { label: "QA", href: "/qa", matchPaths: ["/qa"] },
      { label: "Alerts", href: "/alerts", matchPaths: ["/alerts"] },
    ],
    actions: [
      { label: "Open calls", href: "/calls", style: "primary" },
      { label: "Review analytics", href: "/analytics", style: "secondary" },
    ],
  },
  settings: {
    title: "System readiness",
    description: "Track what is configured, what is missing, and which runtime checks still stand between you and live validation.",
    items: [
      { label: "Environment status", note: "Readiness, runtime health, and deployment posture live here." },
      { label: "Provider setup", note: "Twilio, Deepgram, Anthropic, secrets, and URLs." },
      { label: "Runtime probes", note: "Cross-service checks verify the voice runtime can see the web app." },
      { label: "Deployment docs", note: "Credential setup and live validation runbooks are already in the repo." },
    ],
    actions: [{ label: "Review credentials", href: "/settings", style: "primary" }],
  },
  billing: {
    title: "System workspace",
    description: "Billing, settings, and workspace-level controls should feel coherent even before every backend hook exists.",
    items: [
      { label: "Billing", href: "/billing", matchPaths: ["/billing"] },
      { label: "Settings", href: "/settings", matchPaths: ["/settings"] },
      { label: "Analytics", href: "/analytics", matchPaths: ["/analytics"] },
    ],
    actions: [{ label: "Review readiness", href: "/settings", style: "primary" }],
  },
  workspace: {
    title: "Workspace",
    description: "A calmer operator shell for navigation, context, and the next meaningful action.",
    items: [
      { label: "Agents", href: "/agents", matchPaths: ["/agents"] },
      { label: "Numbers", href: "/numbers", matchPaths: ["/numbers"] },
      { label: "Calls", href: "/calls", matchPaths: ["/calls"] },
      { label: "Settings", href: "/settings", matchPaths: ["/settings"] },
    ],
    actions: [{ label: "Open agents", href: "/agents", style: "primary" }],
  },
};

export function isContextItemActive(pathname: string, search: string, item: ConsoleShellContextItem) {
  if (!item.href) {
    return false;
  }

  if (item.matchPaths?.some((matchPath) => pathname.startsWith(matchPath))) {
    return true;
  }

  if (item.href.includes("?")) {
    return `${pathname}${search ? `?${search}` : ""}` === item.href;
  }

  return pathname === item.href;
}

export function resolveConsoleShellSection(eyebrow: string): ConsoleShellSection {
  const normalizedEyebrow = eyebrow.toLowerCase();

  if (normalizedEyebrow.includes("agent") || normalizedEyebrow.includes("create")) {
    return "agents";
  }

  if (normalizedEyebrow.includes("call")) {
    return "calls";
  }

  if (normalizedEyebrow.includes("number")) {
    return "numbers";
  }

  if (normalizedEyebrow.includes("dashboard")) {
    return "dashboard";
  }

  if (normalizedEyebrow.includes("knowledge")) {
    return "knowledge";
  }

  if (normalizedEyebrow.includes("batch")) {
    return "batch";
  }

  if (
    normalizedEyebrow.includes("analytics") ||
    normalizedEyebrow.includes("qa") ||
    normalizedEyebrow.includes("alert")
  ) {
    return "monitor";
  }

  if (normalizedEyebrow.includes("setting")) {
    return "settings";
  }

  if (normalizedEyebrow.includes("billing")) {
    return "billing";
  }

  return "workspace";
}

export function getConsoleShellContext(section?: ConsoleShellSection, eyebrow?: string) {
  const resolvedSection = section ?? resolveConsoleShellSection(eyebrow ?? "");

  return sectionContexts[resolvedSection] ?? sectionContexts.workspace;
}