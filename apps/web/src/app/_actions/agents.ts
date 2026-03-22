"use server";

import { AgentStatus, Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function readReturnTo(formData: FormData, agentId?: string) {
  const value = readText(formData, "returnTo");

  if (value.startsWith("/")) {
    return value;
  }

  return agentId ? `/agents/${agentId}` : "/agents";
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function normalizeAgentStatus(status: string) {
  if (
    status === AgentStatus.ACTIVE ||
    status === AgentStatus.PAUSED ||
    status === AgentStatus.ARCHIVED
  ) {
    return status;
  }

  return AgentStatus.DRAFT;
}

async function createUniqueAgentSlug(
  client: typeof prisma | Prisma.TransactionClient,
  name: string,
  currentAgentId?: string,
) {
  const baseSlug = toSlug(name);

  if (!baseSlug) {
    return undefined;
  }

  const existingSlugs = await client.agent.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
      ...(currentAgentId
        ? {
            NOT: {
              id: currentAgentId,
            },
          }
        : {}),
    },
    select: {
      slug: true,
    },
  });

  const takenSlugs = new Set(
    existingSlugs
      .map((record) => record.slug)
      .filter((slug): slug is string => Boolean(slug)),
  );

  if (!takenSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;

  while (takenSlugs.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

export async function createAgentAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const name = readText(formData, "name");
  const description = readText(formData, "description");
  const systemPrompt = readText(formData, "systemPrompt");
  const firstMessage = readText(formData, "firstMessage");
  const voiceModel = readText(formData, "voiceModel");
  const transferNumber = readText(formData, "transferNumber");

  if (!name || !systemPrompt) {
    redirect("/agents/new?error=missing-required-fields");
  }

  try {
    const user = await prisma.user.upsert({
      where: {
        email: session.email,
      },
      update: {
        name: session.name,
      },
      create: {
        email: session.email,
        name: session.name,
      },
    });

    const slug = await createUniqueAgentSlug(prisma, name);

    const agent = await prisma.agent.create({
      data: {
        userId: user.id,
        name,
        slug,
        description: description || null,
        systemPrompt,
        firstMessage: firstMessage || null,
        voiceModel: voiceModel || process.env.VOICE_MODEL || null,
        transferNumber: transferNumber || null,
        status: AgentStatus.DRAFT,
        config: {
          source: "milestone-a-form",
        },
      },
    });

    redirect(`/agents/${agent.id}`);
  } catch {
    redirect("/agents/new?error=database-unavailable");
  }
}

export async function updateAgentAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const agentId = readText(formData, "agentId");
  const name = readText(formData, "name");
  const description = readText(formData, "description");
  const systemPrompt = readText(formData, "systemPrompt");
  const firstMessage = readText(formData, "firstMessage");
  const voiceModel = readText(formData, "voiceModel");
  const transferNumber = readText(formData, "transferNumber");
  const status = readText(formData, "status");
  const phoneNumberId = readText(formData, "phoneNumberId");
  const isActive = readCheckbox(formData, "isActive");
  const returnTo = readReturnTo(formData, agentId);

  if (!agentId || !name || !systemPrompt) {
    redirect(`${returnTo}?error=missing-required-fields`);
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      redirect("/sign-in");
    }

    const existingAgent = await prisma.agent.findFirst({
      where: {
        id: agentId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingAgent) {
      redirect(`/agents/${agentId}?error=not-found`);
    }

    const normalizedStatus = normalizeAgentStatus(status);
    const normalizedIsActive = normalizedStatus === AgentStatus.ACTIVE ? isActive : false;

    await prisma.$transaction(async (tx) => {
      const slug = await createUniqueAgentSlug(tx, name, agentId);

      await tx.agent.update({
        where: {
          id: agentId,
        },
        data: {
          name,
          slug,
          description: description || null,
          systemPrompt,
          firstMessage: firstMessage || null,
          voiceModel: voiceModel || process.env.VOICE_MODEL || null,
          transferNumber: transferNumber || null,
          isActive: normalizedIsActive,
          status: normalizedStatus,
          config: {
            source: "milestone-a-update-form",
          },
        },
      });

      await tx.phoneNumber.updateMany({
        where: {
          userId: user.id,
          agentId,
        },
        data: {
          agentId: null,
        },
      });

      if (phoneNumberId) {
        await tx.phoneNumber.updateMany({
          where: {
            id: phoneNumberId,
            userId: user.id,
          },
          data: {
            agentId,
          },
        });
      }
    });

    redirect(`${returnTo}?updated=1`);
  } catch {
    redirect(`${returnTo}?error=database-unavailable`);
  }
}

export async function archiveAgentAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const agentId = readText(formData, "agentId");

  if (!agentId) {
    redirect("/agents?error=missing-agent-id");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      redirect("/sign-in");
    }

    const existingAgent = await prisma.agent.findFirst({
      where: {
        id: agentId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingAgent) {
      redirect(`/agents/${agentId}?error=not-found`);
    }

    await prisma.$transaction(async (tx) => {
      await tx.phoneNumber.updateMany({
        where: {
          userId: user.id,
          agentId,
        },
        data: {
          agentId: null,
        },
      });

      await tx.agent.update({
        where: {
          id: agentId,
        },
        data: {
          status: AgentStatus.ARCHIVED,
          isActive: false,
          config: {
            source: "milestone-a-archive-form",
          },
        },
      });
    });

    redirect(`/agents/${agentId}?archived=1`);
  } catch {
    redirect(`/agents/${agentId}?error=database-unavailable`);
  }
}

export async function toggleAgentStatusAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const agentId = readText(formData, "agentId");
  const newStatus = readText(formData, "newStatus");

  if (!agentId || !newStatus) {
    redirect("/agents?error=missing-fields");
  }

  const normalizedStatus = normalizeAgentStatus(newStatus);

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    if (!user) {
      redirect("/sign-in");
    }

    const existingAgent = await prisma.agent.findFirst({
      where: { id: agentId, userId: user.id },
      select: { id: true },
    });

    if (!existingAgent) {
      redirect(`/agents/${agentId}?error=not-found`);
    }

    await prisma.agent.update({
      where: { id: agentId },
      data: {
        status: normalizedStatus,
        isActive: normalizedStatus === AgentStatus.ACTIVE,
      },
    });

    redirect(`/agents/${agentId}?updated=1`);
  } catch {
    redirect(`/agents/${agentId}?error=database-unavailable`);
  }
}

export async function saveFlowAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const agentId = readText(formData, "agentId");
  const flowJson = readText(formData, "flow");

  if (!agentId || !flowJson) {
    redirect("/agents?error=missing-fields");
  }

  let flow: unknown[];
  try {
    flow = JSON.parse(flowJson);
    if (!Array.isArray(flow)) throw new Error("not array");
  } catch {
    redirect(`/agents/${agentId}/flow?error=invalid-flow`);
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    if (!user) {
      redirect("/sign-in");
    }

    const agent = await prisma.agent.findFirst({
      where: { id: agentId, userId: user.id },
      select: { id: true, config: true },
    });

    if (!agent) {
      redirect(`/agents/${agentId}?error=not-found`);
    }

    const existingConfig =
      agent.config && typeof agent.config === "object" && !Array.isArray(agent.config)
        ? (agent.config as Record<string, unknown>)
        : {};

    await prisma.agent.update({
      where: { id: agentId },
      data: {
        config: { ...existingConfig, flow: flow as Prisma.JsonArray, flowUpdatedAt: new Date().toISOString() },
      },
    });
  } catch {
    redirect(`/agents/${agentId}/flow?error=database-unavailable`);
  }
}

export async function generatePromptFromFlowAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const agentId = readText(formData, "agentId");
  const flowJson = readText(formData, "flow");
  const generatedPrompt = readText(formData, "generatedPrompt");

  if (!agentId || !generatedPrompt) {
    redirect("/agents?error=missing-fields");
  }

  let flow: unknown[] = [];
  try {
    flow = JSON.parse(flowJson);
    if (!Array.isArray(flow)) flow = [];
  } catch {
    flow = [];
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    if (!user) {
      redirect("/sign-in");
    }

    const agent = await prisma.agent.findFirst({
      where: { id: agentId, userId: user.id },
      select: { id: true, config: true },
    });

    if (!agent) {
      redirect(`/agents/${agentId}?error=not-found`);
    }

    const existingConfig =
      agent.config && typeof agent.config === "object" && !Array.isArray(agent.config)
        ? (agent.config as Record<string, unknown>)
        : {};

    await prisma.agent.update({
      where: { id: agentId },
      data: {
        systemPrompt: generatedPrompt,
        config: {
          ...existingConfig,
          flow: flow as Prisma.JsonArray,
          flowUpdatedAt: new Date().toISOString(),
          promptSource: "flow-builder",
        },
      },
    });

    redirect(`/agents/${agentId}?updated=1`);
  } catch {
    redirect(`/agents/${agentId}?error=database-unavailable`);
  }
}