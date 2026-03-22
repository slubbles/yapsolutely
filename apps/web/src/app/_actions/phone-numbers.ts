"use server";

import { PhoneNumberProvider } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizePhoneNumber } from "@/lib/phone-number-data";
import {
  registerPhoneNumberSchema,
  deletePhoneNumberSchema,
  reassignPhoneNumberSchema,
} from "@/lib/validations";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function registerPhoneNumberAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const parsed = registerPhoneNumberSchema.safeParse({
    phoneNumber: readText(formData, "phoneNumber"),
    friendlyName: readText(formData, "friendlyName"),
    twilioSid: readText(formData, "twilioSid"),
    agentId: readText(formData, "agentId"),
  });

  if (!parsed.success) {
    redirect("/numbers?error=missing-phone-number");
  }

  const phoneNumber = normalizePhoneNumber(parsed.data.phoneNumber);
  const { friendlyName, twilioSid, agentId } = parsed.data;

  if (!phoneNumber) {
    redirect("/numbers?error=missing-phone-number");
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

    if (agentId) {
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
        redirect("/numbers?error=invalid-agent");
      }
    }

    const existingPhoneNumber = await prisma.phoneNumber.findUnique({
      where: {
        phoneNumber,
      },
      select: {
        id: true,
      },
    });

    if (existingPhoneNumber) {
      redirect("/numbers?error=duplicate-phone-number");
    }

    if (twilioSid) {
      const existingTwilioSid = await prisma.phoneNumber.findUnique({
        where: {
          twilioSid,
        },
        select: {
          id: true,
        },
      }).catch(() => null);

      if (existingTwilioSid) {
        redirect("/numbers?error=duplicate-twilio-sid");
      }
    }

    await prisma.phoneNumber.create({
      data: {
        userId: user.id,
        provider: PhoneNumberProvider.TWILIO,
        phoneNumber,
        friendlyName: friendlyName || null,
        twilioSid: twilioSid || null,
        agentId: agentId || null,
      },
    });

    redirect("/numbers?created=1");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/numbers?error=database-unavailable");
  }
}

export async function deletePhoneNumberAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const parsed = deletePhoneNumberSchema.safeParse({
    phoneNumberId: readText(formData, "phoneNumberId"),
  });

  if (!parsed.success) {
    redirect("/numbers?error=missing-phone-number-id");
  }

  const { phoneNumberId } = parsed.data;

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

    const existingPhoneNumber = await prisma.phoneNumber.findFirst({
      where: {
        id: phoneNumberId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!existingPhoneNumber) {
      redirect("/numbers?error=not-found");
    }

    await prisma.phoneNumber.delete({
      where: {
        id: phoneNumberId,
      },
    });

    redirect("/numbers?deleted=1");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/numbers?error=database-unavailable");
  }
}

export async function connectNumberToAgentAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const phoneNumberRaw = readText(formData, "phoneNumber");
  const friendlyName = readText(formData, "friendlyName");
  const agentId = readText(formData, "agentId");
  const agentSlug = readText(formData, "agentSlug");

  const phoneNumber = normalizePhoneNumber(phoneNumberRaw);
  if (!phoneNumber || !agentId) {
    redirect(`/agents/${agentSlug || agentId}?error=missing-fields`);
  }

  try {
    const user = await prisma.user.upsert({
      where: { email: session.email },
      update: { name: session.name },
      create: { email: session.email, name: session.name },
    });

    const agent = await prisma.agent.findFirst({
      where: { id: agentId, userId: user.id },
      select: { id: true },
    });
    if (!agent) redirect(`/agents/${agentSlug || agentId}?error=invalid-agent`);

    const existing = await prisma.phoneNumber.findUnique({
      where: { phoneNumber },
      select: { id: true },
    });
    if (existing) redirect(`/agents/${agentSlug || agentId}?error=duplicate-number`);

    await prisma.phoneNumber.create({
      data: {
        userId: user.id,
        provider: PhoneNumberProvider.TWILIO,
        phoneNumber,
        friendlyName: friendlyName || null,
        agentId,
      },
    });

    redirect(`/agents/${agentSlug || agentId}?connected=1`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect(`/agents/${agentSlug || agentId}?error=database-unavailable`);
  }
}

export async function disconnectNumberFromAgentAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const phoneNumberId = readText(formData, "phoneNumberId");
  const agentSlug = readText(formData, "agentSlug");

  if (!phoneNumberId) redirect(`/agents/${agentSlug}?error=missing-id`);

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });
    if (!user) redirect("/sign-in");

    const phone = await prisma.phoneNumber.findFirst({
      where: { id: phoneNumberId, userId: user!.id },
      select: { id: true },
    });
    if (!phone) redirect(`/agents/${agentSlug}?error=not-found`);

    await prisma.phoneNumber.update({
      where: { id: phoneNumberId },
      data: { agentId: null },
    });

    redirect(`/agents/${agentSlug}?disconnected=1`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect(`/agents/${agentSlug}?error=database-unavailable`);
  }
}

export async function reassignPhoneNumberAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const parsed = reassignPhoneNumberSchema.safeParse({
    phoneNumberId: readText(formData, "phoneNumberId"),
    agentId: readText(formData, "agentId"),
  });

  if (!parsed.success) {
    redirect("/numbers?error=missing-phone-number-id");
  }

  const { phoneNumberId, agentId } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true },
    });

    if (!user) {
      redirect("/sign-in");
    }

    const phone = await prisma.phoneNumber.findFirst({
      where: { id: phoneNumberId, userId: user.id },
      select: { id: true },
    });

    if (!phone) {
      redirect("/numbers?error=not-found");
    }

    if (agentId) {
      const agent = await prisma.agent.findFirst({
        where: { id: agentId, userId: user.id },
        select: { id: true },
      });
      if (!agent) {
        redirect("/numbers?error=invalid-agent");
      }
    }

    await prisma.phoneNumber.update({
      where: { id: phoneNumberId },
      data: { agentId: agentId || null },
    });

    redirect("/numbers?updated=1");
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/numbers?error=database-unavailable");
  }
}