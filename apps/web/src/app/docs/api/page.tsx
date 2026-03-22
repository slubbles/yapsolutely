import PublicPageShell from "@/components/landing/PublicPageShell";
import Link from "next/link";
import { ArrowRight, Book, Lock, Key, Users, Phone, Bot, FileText, Webhook, Zap, Settings } from "lucide-react";

export const metadata = {
  title: "API Reference — Yapsolutely",
  description: "Complete REST API reference for the Yapsolutely voice agent platform.",
};

const endpoints = [
  {
    category: "Authentication",
    icon: Key,
    items: [
      { method: "POST", path: "/api/v1/auth/token", description: "Generate an API access token" },
      { method: "POST", path: "/api/v1/auth/revoke", description: "Revoke an existing token" },
    ],
  },
  {
    category: "Agents",
    icon: Bot,
    items: [
      { method: "GET", path: "/api/v1/agents", description: "List all agents" },
      { method: "POST", path: "/api/v1/agents", description: "Create a new agent" },
      { method: "GET", path: "/api/v1/agents/:id", description: "Retrieve an agent" },
      { method: "PATCH", path: "/api/v1/agents/:id", description: "Update an agent" },
      { method: "DELETE", path: "/api/v1/agents/:id", description: "Delete an agent" },
    ],
  },
  {
    category: "Calls",
    icon: Phone,
    items: [
      { method: "GET", path: "/api/v1/calls", description: "List all calls" },
      { method: "GET", path: "/api/v1/calls/:id", description: "Retrieve a call" },
      { method: "GET", path: "/api/v1/calls/:id/transcript", description: "Get call transcript" },
      { method: "POST", path: "/api/v1/calls/:id/export", description: "Export call data" },
    ],
  },
  {
    category: "Phone Numbers",
    icon: Phone,
    items: [
      { method: "GET", path: "/api/v1/numbers", description: "List all phone numbers" },
      { method: "POST", path: "/api/v1/numbers", description: "Provision a new number" },
      { method: "PATCH", path: "/api/v1/numbers/:id", description: "Update number routing" },
      { method: "DELETE", path: "/api/v1/numbers/:id", description: "Release a phone number" },
    ],
  },
  {
    category: "Webhooks",
    icon: Webhook,
    items: [
      { method: "GET", path: "/api/v1/webhooks", description: "List webhook endpoints" },
      { method: "POST", path: "/api/v1/webhooks", description: "Register a webhook" },
      { method: "DELETE", path: "/api/v1/webhooks/:id", description: "Remove a webhook" },
    ],
  },
  {
    category: "Transcripts",
    icon: FileText,
    items: [
      { method: "GET", path: "/api/v1/transcripts", description: "List transcripts" },
      { method: "GET", path: "/api/v1/transcripts/:id", description: "Retrieve a transcript" },
      { method: "GET", path: "/api/v1/transcripts/:id/segments", description: "Get transcript segments" },
    ],
  },
];

const methodColor: Record<string, string> = {
  GET: "text-emerald-600 bg-emerald-400/10",
  POST: "text-blue-600 bg-blue-400/10",
  PATCH: "text-amber-600 bg-amber-400/10",
  DELETE: "text-red-500 bg-red-400/10",
  PUT: "text-violet-600 bg-violet-400/10",
};

export default function ApiReferencePage() {
  return (
    <PublicPageShell>
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/docs" className="font-body text-[0.72rem] text-text-subtle hover:text-text-body transition-colors">
              Docs
            </Link>
            <ArrowRight className="w-2.5 h-2.5 text-text-subtle/40" />
            <span className="font-body text-[0.72rem] text-text-body">API Reference</span>
          </div>
          <h1 className="font-display text-[1.75rem] sm:text-[2.5rem] font-semibold tracking-[-0.03em] text-foreground mb-3 leading-[1.08]">
            API Reference
          </h1>
          <p className="font-body text-[0.9rem] text-text-subtle max-w-xl leading-[1.65] mb-6">
            The Yapsolutely REST API lets you manage agents, calls, phone numbers, and transcripts programmatically. All endpoints require authentication via API key.
          </p>
          <div className="flex items-center gap-4 text-[0.75rem] font-body text-text-subtle">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>HTTPS only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Bearer token auth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>JSON responses</span>
            </div>
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-surface-dark rounded-xl p-4 sm:p-5 mb-10">
          <div className="font-body text-[0.62rem] text-surface-dark-foreground/30 uppercase tracking-[0.12em] mb-2">Base URL</div>
          <code className="font-mono text-[0.85rem] text-surface-dark-foreground/80">https://api.yapsolutely.com/v1</code>
        </div>

        {/* Endpoints */}
        <div className="space-y-10">
          {endpoints.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-2.5 mb-4">
                <group.icon className="w-4 h-4 text-text-subtle" />
                <h2 className="font-display text-[1rem] font-semibold text-text-strong tracking-[-0.01em]">{group.category}</h2>
              </div>
              <div className="bg-surface-panel rounded-xl border border-border-soft/60 overflow-hidden divide-y divide-border-soft/40">
                {group.items.map((endpoint) => (
                  <div key={`${endpoint.method}-${endpoint.path}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-subtle/30 transition-colors">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[0.6rem] font-mono font-semibold tracking-wider ${methodColor[endpoint.method] ?? "text-text-subtle bg-surface-subtle"}`}>
                      {endpoint.method}
                    </span>
                    <code className="font-mono text-[0.78rem] text-text-body flex-1">{endpoint.path}</code>
                    <span className="font-body text-[0.72rem] text-text-subtle hidden sm:block">{endpoint.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Auth example */}
        <div className="mt-14 sm:mt-20">
          <h2 className="font-display text-[1.12rem] font-semibold text-text-strong tracking-[-0.01em] mb-4">Authentication</h2>
          <p className="font-body text-[0.85rem] text-text-subtle leading-[1.65] mb-5">
            Include your API key in the <code className="font-mono text-[0.78rem] bg-surface-subtle px-1.5 py-0.5 rounded">Authorization</code> header of every request.
          </p>
          <div className="bg-surface-dark rounded-xl p-5 overflow-x-auto">
            <pre className="font-mono text-[0.78rem] text-surface-dark-foreground/70 leading-[1.7]">
{`curl https://api.yapsolutely.com/v1/agents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
