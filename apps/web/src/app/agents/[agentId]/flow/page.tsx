import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getAgentBySlugOrIdForUser } from "@/lib/agent-data";
import FlowBuilderClient, { type FlowBlock } from "./flow-builder-client";

export default async function FlowBuilderPage({ params }: { params: Promise<{ agentId: string }> }) {
  const session = await requireSession();
  const { agentId } = await params;
  const agent = await getAgentBySlugOrIdForUser(session.email, agentId);

  if (!agent) notFound();

  const config = (agent.config && typeof agent.config === "object" && !Array.isArray(agent.config))
    ? (agent.config as Record<string, unknown>)
    : {};

  return (
    <FlowBuilderClient
      agent={{
        id: agent.id,
        name: agent.name,
        slug: agent.slug,
        description: agent.description,
        systemPrompt: agent.systemPrompt,
        firstMessage: agent.firstMessage,
      }}
      savedFlow={(config.flow as FlowBlock[]) ?? []}
    />
  );
}
