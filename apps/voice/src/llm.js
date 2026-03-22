import { getRuntimeToolDefinitions, runTool } from "./tool-runtime.js";

const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
const anthropicMaxTokens = Number(process.env.ANTHROPIC_MAX_TOKENS || 220);

export function isLlmConfigured() {
  return Boolean(anthropicApiKey);
}

function buildSystemPrompt(session) {
  const sections = [
    session.systemPrompt || "You are a helpful phone-call voice agent for Yapsolutely.",
    "Keep responses concise, natural for phone calls, and usually under two short sentences unless collecting structured booking details.",
    "If the caller interrupts, gracefully adapt to the new turn instead of forcing the previous answer.",
  ];

  if (session.agentName) {
    sections.push(`Agent name: ${session.agentName}.`);
  }

  if (session.agentDescription) {
    sections.push(`Agent role: ${session.agentDescription}.`);
  }

  if (session.transferNumber) {
    sections.push(`Transfer target if escalation is requested: ${session.transferNumber}.`);
  }

  if (session.phoneNumber) {
    sections.push(`Inbound number currently serving the caller: ${session.phoneNumber}.`);
  }

  return sections.join("\n\n");
}

function buildAnthropicMessages(session) {
  const history = [];

  if (session.firstMessage) {
    history.push({
      role: "assistant",
      content: session.firstMessage,
    });
  }

  for (const item of session.history) {
    history.push({
      role: item.role,
      content: item.content,
    });
  }

  return history.map((item) => ({
    role: item.role,
    content:
      typeof item.content === "string"
        ? [{ type: "text", text: item.content }]
        : item.content,
  }));
}

async function createAnthropicResponse(payload, signal) {
  const maxAttempts = 3;
  const retryableStatuses = new Set([429, 503, 529]);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
      signal,
    });

    const data = await response.json().catch(() => null);

    if (response.ok) {
      return data;
    }

    if (attempt < maxAttempts && retryableStatuses.has(response.status)) {
      const delay = Math.min(1000 * attempt, 3000);
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    throw new Error(data?.error?.message || data?.error || `Anthropic request failed (${response.status})`);
  }
}

export async function generateAssistantReply(session, signal, recordEvent) {
  const tools = getRuntimeToolDefinitions(session);
  let messages = buildAnthropicMessages(session);
  let iterations = 0;

  while (iterations < 3) {
    iterations += 1;

    const data = await createAnthropicResponse(
      {
        model: anthropicModel,
        max_tokens: anthropicMaxTokens,
        temperature: 0.2,
        system: buildSystemPrompt(session),
        messages,
        tools,
      },
      signal,
    );

    const contentBlocks = Array.isArray(data?.content) ? data.content : [];
    const text = contentBlocks
      .filter((item) => item?.type === "text" && item?.text)
      .map((item) => item.text)
      .join("\n")
      .trim();
    const toolUses = contentBlocks.filter((item) => item?.type === "tool_use");

    if (toolUses.length === 0) {
      return text;
    }

    const toolResults = [];

    for (const toolUse of toolUses) {
      const result = await runTool({
        session,
        toolName: toolUse.name,
        input: toolUse.input,
        logToolEvent: async (toolText, payload) => {
          await recordEvent("TOOL", toolText, payload);
        },
      });

      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(result),
        is_error: !result?.ok,
      });
    }

    messages = [
      ...messages,
      {
        role: "assistant",
        content: contentBlocks,
      },
      {
        role: "user",
        content: toolResults,
      },
    ];
  }

  return "I completed the requested action. Is there anything else you need before we wrap up?";
}
