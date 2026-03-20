import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient, AgentStatus, PhoneNumberProvider } from '@prisma/client';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);
}

async function createUniqueSlug(baseName) {
  const baseSlug = slugify(baseName) || 'agent';
  const existing = await prisma.agent.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
    select: {
      slug: true,
    },
  });

  const taken = new Set(existing.map((item) => item.slug).filter(Boolean));

  if (!taken.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (taken.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

async function loadSystemPrompt() {
  const promptPath = path.resolve(__dirname, '../prompts/yapsolutely-front-desk.md');
  return fs.readFile(promptPath, 'utf8');
}

async function main() {
  const email = process.env.SEED_USER_EMAIL || 'karim@yapsolutely.ai';
  const name = process.env.SEED_USER_NAME || 'Karim';
  const phoneNumber = process.env.SEED_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER;
  const twilioSid = process.env.SEED_TWILIO_SID || '';
  const agentName = process.env.SEED_AGENT_NAME || 'Yapsolutely Front Desk';
  const firstMessage =
    process.env.SEED_AGENT_FIRST_MESSAGE ||
    'Hi, this is Yapsolutely Front Desk. How can I help you today?';
  const voiceModel = process.env.SEED_AGENT_VOICE_MODEL || process.env.VOICE_MODEL || 'aura-2-thalia-en';
  const systemPrompt = await loadSystemPrompt();

  if (!phoneNumber) {
    throw new Error('SEED_PHONE_NUMBER or TWILIO_PHONE_NUMBER is required.');
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name },
  });

  let agent = await prisma.agent.findFirst({
    where: {
      userId: user.id,
      name: agentName,
    },
  });

  if (!agent) {
    agent = await prisma.agent.create({
      data: {
        userId: user.id,
        name: agentName,
        slug: await createUniqueSlug(agentName),
        description: 'Inbound demo agent for live qualification and appointment-style calls.',
        systemPrompt,
        firstMessage,
        voiceProvider: 'deepgram',
        voiceModel,
        language: 'en-US',
        status: AgentStatus.ACTIVE,
        isActive: true,
        config: {
          source: 'production-seed',
          flow: ['greet', 'qualify', 'collect-details', 'confirm', 'close'],
        },
      },
    });
  } else {
    agent = await prisma.agent.update({
      where: { id: agent.id },
      data: {
        description: 'Inbound demo agent for live qualification and appointment-style calls.',
        systemPrompt,
        firstMessage,
        voiceProvider: 'deepgram',
        voiceModel,
        language: 'en-US',
        status: AgentStatus.ACTIVE,
        isActive: true,
        config: {
          source: 'production-seed',
          flow: ['greet', 'qualify', 'collect-details', 'confirm', 'close'],
        },
      },
    });
  }

  const existingPhone = await prisma.phoneNumber.findFirst({
    where: {
      OR: [{ phoneNumber }, ...(twilioSid ? [{ twilioSid }] : [])],
    },
  });

  const phoneData = {
    userId: user.id,
    agentId: agent.id,
    provider: PhoneNumberProvider.TWILIO,
    phoneNumber,
    friendlyName: process.env.SEED_PHONE_FRIENDLY_NAME || phoneNumber,
    twilioSid: twilioSid || null,
  };

  const phoneRecord = existingPhone
    ? await prisma.phoneNumber.update({
        where: { id: existingPhone.id },
        data: phoneData,
      })
    : await prisma.phoneNumber.create({
        data: phoneData,
      });

  console.log(
    JSON.stringify(
      {
        ok: true,
        user: { id: user.id, email: user.email },
        agent: { id: agent.id, name: agent.name, status: agent.status, isActive: agent.isActive },
        phoneNumber: { id: phoneRecord.id, value: phoneRecord.phoneNumber, twilioSid: phoneRecord.twilioSid },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
