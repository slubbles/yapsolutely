import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const voiceRuntimeUrl =
  process.env.VOICE_RUNTIME_URL ||
  process.env.NEXT_PUBLIC_VOICE_RUNTIME_URL ||
  "http://localhost:3001";
const runtimeSharedSecret = process.env.RUNTIME_SHARED_SECRET || "";

export async function POST(req: NextRequest) {
  const session = await requireSession();

  let body: { agentId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { agentId } = body;
  if (!agentId) {
    return NextResponse.json({ error: "Missing agentId" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 403 });
  }

  const agent = await prisma.agent.findFirst({
    where: { id: agentId, userId: user.id },
    select: {
      id: true,
      name: true,
      description: true,
      systemPrompt: true,
      firstMessage: true,
      voiceModel: true,
      transferNumber: true,
    },
  });

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Build the WebSocket URL for the voice runtime
  const baseUrl = voiceRuntimeUrl.replace(/\/$/, "");
  const wsBase = baseUrl
    .replace(/^http:/, "ws:")
    .replace(/^https:/, "wss:");
  const wsUrl = `${wsBase}/browser/stream?secret=${encodeURIComponent(runtimeSharedSecret)}`;

  return NextResponse.json({
    wsUrl,
    agent: {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      systemPrompt: agent.systemPrompt,
      firstMessage: agent.firstMessage,
      voiceModel: agent.voiceModel,
      transferNumber: agent.transferNumber,
      language: "en-US",
    },
  });
}
