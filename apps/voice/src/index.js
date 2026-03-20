import http from "node:http";
import { WebSocketServer } from "ws";
import {
  buildMockAgentReply,
  buildMockCallerTranscript,
  createStreamSession,
  shouldEmitMockTurn,
} from "./conversation-engine.js";
import { createLivePipelineController } from "./live-pipeline.js";
import { createSessionStore } from "./session-store.js";

const port = Number(process.env.PORT || 3001);
const streamBaseUrl = process.env.VOICE_STREAM_BASE_URL || "localhost:3001";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const runtimeSharedSecret = process.env.RUNTIME_SHARED_SECRET || "";
const voicePipelineMode = process.env.VOICE_PIPELINE_MODE || "mock";
const streamWebSocketUrl =
  process.env.VOICE_STREAM_WSS_URL ||
  `ws${streamBaseUrl.startsWith("https") ? "s" : ""}://${streamBaseUrl.replace(/^https?:\/\//, "")}/twilio/stream`;
const streamSessions = createSessionStore();
const pendingInboundContexts = new Map();
const fallbackAgentName = process.env.DEFAULT_AGENT_NAME || "Yapsolutely Front Desk";
const fallbackAgentDescription =
  process.env.DEFAULT_AGENT_DESCRIPTION ||
  "Handles inbound demo calls when dashboard-backed number routing is unavailable.";
const fallbackAgentFirstMessage =
  process.env.DEFAULT_AGENT_FIRST_MESSAGE ||
  "Hi, this is Yapsolutely Front Desk. How can I help you today?";
const fallbackAgentSystemPrompt =
  process.env.DEFAULT_AGENT_SYSTEM_PROMPT ||
  "You are Yapsolutely Front Desk, a concise and friendly inbound phone agent. Greet callers warmly, ask what they need, collect their name when helpful, answer briefly, and keep replies natural for a phone call.";
const fallbackAgentVoiceProvider = process.env.DEFAULT_AGENT_VOICE_PROVIDER || "deepgram";
const fallbackAgentVoiceModel =
  process.env.DEFAULT_AGENT_VOICE_MODEL || process.env.VOICE_MODEL || process.env.DEEPGRAM_TTS_MODEL || "aura-2-thalia-en";
const fallbackAgentLanguage = process.env.DEFAULT_AGENT_LANGUAGE || "en-US";

function hasRealValue(value) {
  if (!value) {
    return false;
  }

  const trimmed = String(value).trim();

  if (!trimmed) {
    return false;
  }

  const placeholderPatterns = [
    "replace-with",
    "your-",
    "your_",
    "user:password",
    "example",
    "localhost:3000",
    "your-project",
    "your-twilio",
    "your-anthropic",
    "your-deepgram",
    "your-voice-runtime-domain.com",
  ];

  return !placeholderPatterns.some((pattern) => trimmed.toLowerCase().includes(pattern));
}

function runtimeConfigChecks() {
  return [
    {
      key: "NEXT_PUBLIC_APP_URL",
      label: "Web app URL",
      configured: hasRealValue(process.env.NEXT_PUBLIC_APP_URL),
      detail: "Used by the runtime to reach the dashboard APIs.",
    },
    {
      key: "RUNTIME_SHARED_SECRET",
      label: "Runtime shared secret",
      configured: hasRealValue(process.env.RUNTIME_SHARED_SECRET),
      detail: "Used for secure runtime-to-web API access.",
    },
    {
      key: "VOICE_STREAM_BASE_URL",
      label: "Voice runtime base URL",
      configured: hasRealValue(process.env.VOICE_STREAM_BASE_URL),
      detail: "Used for Twilio and operator-facing runtime checks.",
    },
    {
      key: "VOICE_STREAM_WSS_URL",
      label: "Voice runtime websocket URL",
      configured: hasRealValue(process.env.VOICE_STREAM_WSS_URL),
      detail: "Used by Twilio Media Streams to connect to the runtime.",
    },
    {
      key: "TWILIO_ACCOUNT_SID",
      label: "Twilio account SID",
      configured: hasRealValue(process.env.TWILIO_ACCOUNT_SID),
      detail: "Required for live Twilio-integrated operations.",
    },
    {
      key: "TWILIO_AUTH_TOKEN",
      label: "Twilio auth token",
      configured: hasRealValue(process.env.TWILIO_AUTH_TOKEN),
      detail: "Required for live Twilio-integrated operations.",
    },
    {
      key: "TWILIO_PHONE_NUMBER",
      label: "Twilio phone number",
      configured: hasRealValue(process.env.TWILIO_PHONE_NUMBER),
      detail: "Inbound number used for live call validation.",
    },
    {
      key: "DEEPGRAM_API_KEY",
      label: "Deepgram API key",
      configured: hasRealValue(process.env.DEEPGRAM_API_KEY),
      detail: "Required for live STT and TTS.",
    },
    {
      key: "ANTHROPIC_API_KEY",
      label: "Anthropic API key",
      configured: hasRealValue(process.env.ANTHROPIC_API_KEY),
      detail: "Required for live LLM replies.",
    },
  ];
}

function isAuthorizedRuntimeRequest(req) {
  if (!runtimeSharedSecret) {
    return true;
  }

  return req.headers["x-yapsolutely-runtime-secret"] === runtimeSharedSecret;
}

async function probeWebEndpoint(url, { includeRuntimeSecret = false } = {}) {
  if (!hasRealValue(appUrl)) {
    return {
      status: "skipped",
      detail: "Web app URL is still a placeholder, so probing is skipped.",
    };
  }

  try {
    const headers = {};

    if (includeRuntimeSecret && runtimeSharedSecret) {
      headers["x-yapsolutely-runtime-secret"] = runtimeSharedSecret;
      headers["x-yapsolutely-readiness-mode"] = "embedded";
    }

    const response = await fetch(url, {
      method: "GET",
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        status: "unreachable",
        detail: `Endpoint responded with status ${response.status}.`,
        data,
      };
    }

    return {
      status: "reachable",
      detail: "Endpoint is reachable from the voice runtime.",
      data,
    };
  } catch {
    return {
      status: "unreachable",
      detail: "Endpoint could not be reached from the voice runtime.",
    };
  }
}

async function getRuntimeReadinessSummary() {
  const checks = runtimeConfigChecks();
  const configuredCount = checks.filter((check) => check.configured).length;
  const missingKeys = checks.filter((check) => !check.configured).map((check) => check.key);
  const webHealthUrl = `${appUrl.replace(/\/$/, "")}/api/health`;
  const webReadinessUrl = `${appUrl.replace(/\/$/, "")}/api/readiness`;
  const webHealth = await probeWebEndpoint(webHealthUrl);
  const webReadiness = await probeWebEndpoint(webReadinessUrl, {
    includeRuntimeSecret: true,
  });

  return {
    status: missingKeys.length === 0 && voicePipelineMode === "live" ? "ready" : "needs_configuration",
    service: "yapsolutely-voice-readiness",
    checkedAt: new Date().toISOString(),
    pipelineMode: voicePipelineMode,
    configuredCount,
    totalCount: checks.length,
    missingKeys,
    checks,
    webApp: {
      url: appUrl,
      healthUrl: webHealthUrl,
      readinessUrl: webReadinessUrl,
      health: {
        status: webHealth.status,
        detail: webHealth.detail,
        service: webHealth.data?.service,
      },
      readiness: {
        status: webReadiness.status,
        detail: webReadiness.detail,
        service: webReadiness.data?.service,
        readyForLiveValidation: webReadiness.data?.readiness?.readyForLiveValidation,
      },
    },
    activeStreams: streamSessions.values().length,
  };
}

async function readRequestBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}

function parseTwilioForm(body) {
  const params = new URLSearchParams(body);

  return {
    callSid: params.get("CallSid") || "",
    from: params.get("From") || "",
    to: params.get("To") || "",
    callStatus: params.get("CallStatus") || "",
    callerCity: params.get("CallerCity") || "",
    callerState: params.get("CallerState") || "",
    callerCountry: params.get("CallerCountry") || "",
    callDuration: params.get("CallDuration") || "",
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  return data;
}

function runtimeHeaders() {
  return {
    "Content-Type": "application/json",
    "x-yapsolutely-runtime-secret": runtimeSharedSecret,
  };
}

async function resolveAgentForNumber(phoneNumber) {
  if (!phoneNumber || !runtimeSharedSecret) {
    return null;
  }

  const url = `${appUrl}/api/runtime/resolve-agent?phoneNumber=${encodeURIComponent(phoneNumber)}`;
  return fetchJson(url, {
    method: "GET",
    headers: {
      "x-yapsolutely-runtime-secret": runtimeSharedSecret,
    },
  });
}

async function persistCallStart(payload) {
  if (!runtimeSharedSecret) {
    return null;
  }

  return fetchJson(`${appUrl}/api/runtime/calls/start`, {
    method: "POST",
    headers: runtimeHeaders(),
    body: JSON.stringify(payload),
  });
}

async function persistCallCompletion(payload) {
  if (!runtimeSharedSecret) {
    return null;
  }

  return fetchJson(`${appUrl}/api/runtime/calls/complete`, {
    method: "POST",
    headers: runtimeHeaders(),
    body: JSON.stringify(payload),
  });
}

async function persistCallEvent(payload) {
  if (!runtimeSharedSecret) {
    return null;
  }

  return fetchJson(`${appUrl}/api/runtime/calls/events`, {
    method: "POST",
    headers: runtimeHeaders(),
    body: JSON.stringify(payload),
  });
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildStreamTwiml({ introLine, greeting, callSid, agent }) {
  const safeIntro = escapeXml(introLine);
  const safeGreeting = escapeXml(greeting);
  const parameters = [
    ["callSid", callSid || ""],
    ["callerNumber", agent?.callerNumber || ""],
    ["toNumber", agent?.toNumber || ""],
    ["agentId", agent?.id || ""],
    ["agentName", agent?.name || ""],
    ["firstMessage", greeting || ""],
  ]
    .filter(([, value]) => value)
    .map(
      ([name, value]) => `    <Parameter name="${escapeXml(name)}" value="${escapeXml(value)}" />`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${safeIntro}</Say>
  <Pause length="1" />
  <Say voice="alice">${safeGreeting}</Say>
  <Pause length="1" />
  <Connect>
    <Stream url="${escapeXml(streamWebSocketUrl)}">
${parameters}
    </Stream>
  </Connect>
</Response>`;
}

function registerPendingInboundContext(callSid, agent) {
  if (!callSid || !agent) {
    return;
  }

  pendingInboundContexts.set(callSid, {
    userId: agent.userId || null,
    agentId: agent.id || null,
    agentName: agent.name || null,
    agentDescription: agent.description || null,
    agentStatus: agent.status || null,
    agentIsActive: Boolean(agent.isActive),
    phoneNumberId: agent.phoneNumberId || null,
    phoneNumber: agent.phoneNumber || null,
    phoneNumberFriendlyName: agent.phoneNumberFriendlyName || null,
    firstMessage: agent.firstMessage || null,
    systemPrompt: agent.systemPrompt || null,
    voiceProvider: agent.voiceProvider || null,
    voiceModel: agent.voiceModel || null,
    language: agent.language || null,
    transferNumber: agent.transferNumber || null,
    agentConfig: agent.config || null,
  });

  const timeout = setTimeout(() => {
    pendingInboundContexts.delete(callSid);
  }, 10 * 60 * 1000);

  if (typeof timeout.unref === "function") {
    timeout.unref();
  }
}

function buildFallbackAgentContext(inboundCall) {
  return {
    id: "fallback-demo-agent",
    name: fallbackAgentName,
    description: fallbackAgentDescription,
    status: "ACTIVE",
    isActive: true,
    systemPrompt: fallbackAgentSystemPrompt,
    firstMessage: fallbackAgentFirstMessage,
    voiceProvider: fallbackAgentVoiceProvider,
    voiceModel: fallbackAgentVoiceModel,
    language: fallbackAgentLanguage,
    config: {
      source: "runtime-fallback",
    },
    callerNumber: inboundCall.from,
    toNumber: inboundCall.to,
  };
}

async function recordStreamEvent(session, role, text, payload = {}) {
  if (!session?.externalCallId) {
    return;
  }

  session.sequence += 1;

  try {
    await persistCallEvent({
      externalCallId: session.externalCallId,
      role,
      sequence: session.sequence,
      text,
      payload,
    });
  } catch {
    // Stream event persistence is best-effort during scaffold phase.
  }
}

function mapTwilioCallStatus(callStatus) {
  switch ((callStatus || "").toLowerCase()) {
    case "queued":
      return "QUEUED";
    case "ringing":
      return "RINGING";
    case "in-progress":
      return "IN_PROGRESS";
    case "busy":
      return "BUSY";
    case "no-answer":
      return "NO_ANSWER";
    case "canceled":
      return "CANCELED";
    case "completed":
      return "COMPLETED";
    default:
      return "FAILED";
  }
}

function buildCompletionSummary(callStatus) {
  const normalizedStatus = mapTwilioCallStatus(callStatus);

  switch (normalizedStatus) {
    case "COMPLETED":
      return "Call completed through the runtime webhook flow.";
    case "BUSY":
      return "The destination line was busy before the conversation could complete.";
    case "NO_ANSWER":
      return "The call rang but was not answered long enough to complete.";
    case "CANCELED":
      return "The call was canceled before the conversation completed.";
    default:
      return "The call ended before completion during the scaffolded runtime flow.";
  }
}

async function emitMockTurn(socket, session, mediaMessage) {
  const callerText = buildMockCallerTranscript(session);
  const agentReply = buildMockAgentReply(session);

  await recordStreamEvent(session, "USER", callerText, {
    type: "mock-stt-turn",
    track: mediaMessage.media?.track || "inbound",
    chunk: mediaMessage.media?.chunk || null,
  });

  await recordStreamEvent(session, "AGENT", agentReply, {
    type: "mock-llm-turn",
    voiceModel: session.voiceModel,
  });

  session.mockTurnEmitted = true;

  socket.send(
    JSON.stringify({
      event: "mark",
      streamSid: session.streamSid,
      mark: {
        name: "mock-agent-turn-1",
      },
    }),
  );
}

const websocketServer = new WebSocketServer({ noServer: true });

websocketServer.on("connection", (socket) => {
  let session = null;

  socket.on("message", async (rawMessage) => {
    let message;

    try {
      message = JSON.parse(rawMessage.toString());
    } catch {
      return;
    }

    if (message.event === "connected") {
      return;
    }

    if (message.event === "start") {
      const streamSid = message.start?.streamSid || message.streamSid;
      session = createStreamSession({
        streamSid,
        startMessage: message,
        pipelineMode: voicePipelineMode,
      });

      const pendingContext = pendingInboundContexts.get(session.callSid);

      if (pendingContext) {
        Object.assign(session, pendingContext);
        pendingInboundContexts.delete(session.callSid);
      }

      streamSessions.set(streamSid, session);

      if (session.externalCallId) {
        try {
          await persistCallStart({
            externalCallId: session.externalCallId,
            userId: session.userId,
            agentId: session.agentId,
            phoneNumberId: session.phoneNumberId,
            status: "IN_PROGRESS",
            answeredAt: new Date().toISOString(),
            metadata: {
              source: "twilio-media-stream-start",
              streamSid,
              pipelineMode: session.pipelineMode,
              voiceProvider: session.voiceProvider,
              voiceModel: session.voiceModel,
              language: session.language,
            },
          });
        } catch {
          // The stream path should stay alive even if answer-state persistence fails.
        }
      }

      session.livePipeline = createLivePipelineController({
        session,
        socket,
        recordEvent: async (role, text, payload) => recordStreamEvent(session, role, text, payload),
      });

      if (session.livePipeline.active) {
        session.pipelineMode = "live";
      } else if (voicePipelineMode === "live") {
        session.pipelineMode = "mock";

        await recordStreamEvent(
          session,
          "SYSTEM",
          "Live voice pipeline was requested but is unavailable, so the session fell back to mock mode.",
          {
            type: "live-pipeline-unavailable",
            reason: session.livePipeline.reason,
          },
        );
      }

      await recordStreamEvent(session, "SYSTEM", "Twilio media stream connected.", {
        type: "stream-start",
        streamSid,
        callSid: session.callSid,
        pipelineMode: session.pipelineMode,
      });
      return;
    }

    if (message.event === "media" && session) {
      session.mediaPackets += 1;

      if (session.mediaPackets === 1) {
        await recordStreamEvent(session, "USER", "Inbound audio stream received.", {
          type: "media-first-packet",
          track: message.media?.track || "inbound",
          chunk: message.media?.chunk || null,
        });
      }

      if (session.livePipeline?.active) {
        session.livePipeline.handleMediaMessage(message);
        return;
      }

      if (shouldEmitMockTurn(session)) {
        await emitMockTurn(socket, session, message);
      }
      return;
    }

    if (message.event === "mark" && session) {
      await session.livePipeline?.handleMarkMessage?.(message);

      await recordStreamEvent(session, "SYSTEM", "Outbound stream mark acknowledged.", {
        type: "stream-mark",
        name: message.mark?.name || null,
      });
      return;
    }

    if (message.event === "stop") {
      const streamSid = message.stop?.streamSid || session?.streamSid;
      const activeSession = session || (streamSid ? streamSessions.get(streamSid) : null);

      if (activeSession) {
        await activeSession.livePipeline?.close();

        await recordStreamEvent(activeSession, "SYSTEM", "Twilio media stream ended.", {
          type: "stream-stop",
          streamSid: activeSession.streamSid,
          callSid: activeSession.callSid,
          mediaPackets: activeSession.mediaPackets,
        });

        if (activeSession.streamSid) {
          streamSessions.delete(activeSession.streamSid);
        }
      }

      socket.close();
    }
  });

  socket.on("close", () => {
    if (session?.streamSid) {
      streamSessions.delete(session.streamSid);
    }

    void session?.livePipeline?.close();
  });
});

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify(data, null, 2));
}

function sendTwiML(res, twiml) {
  res.writeHead(200, {
    "Content-Type": "text/xml",
  });
  res.end(twiml);
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || `localhost:${port}`}`);

  if (req.method === "GET" && requestUrl.pathname === "/health") {
    sendJson(res, 200, {
      ok: true,
      service: "yapsolutely-voice",
      port,
      streamBaseUrl,
      pipelineMode: voicePipelineMode,
      productData: {
        resolveAgentEndpoint: `${appUrl}/api/runtime/resolve-agent?phoneNumber=%2B15551234567`,
        authHeader: "x-yapsolutely-runtime-secret",
        streamWebSocketUrl,
      },
      activeStreams: streamSessions.values().length,
    });
    return;
  }

  if (req.method === "GET" && requestUrl.pathname === "/readiness") {
    (async () => {
      if (!isAuthorizedRuntimeRequest(req)) {
        sendJson(res, 401, {
          error: "Unauthorized",
          detail: "Provide x-yapsolutely-runtime-secret to inspect runtime readiness.",
        });
        return;
      }

      const readiness = await getRuntimeReadinessSummary();
      sendJson(res, 200, readiness);
    })().catch(() => {
      sendJson(res, 500, { error: "Failed to build runtime readiness summary" });
    });
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/twilio/inbound") {
    (async () => {
      const body = await readRequestBody(req);
      const inboundCall = parseTwilioForm(body);

      let resolvedAgent = null;

      try {
        resolvedAgent = await resolveAgentForNumber(inboundCall.to);
      } catch (error) {
        resolvedAgent = null;
      }

      const activeAgent = resolvedAgent?.agent
        ? {
            ...resolvedAgent.agent,
            userId: resolvedAgent.user.id,
            phoneNumberId: resolvedAgent.phoneNumber.id,
            phoneNumber: resolvedAgent.phoneNumber.value,
            phoneNumberFriendlyName: resolvedAgent.phoneNumber.friendlyName,
            callerNumber: inboundCall.from,
            toNumber: inboundCall.to,
          }
        : buildFallbackAgentContext(inboundCall);

      if (resolvedAgent?.agent) {
        try {
          await persistCallStart({
            externalCallId: inboundCall.callSid,
            callerNumber: inboundCall.from,
            toNumber: inboundCall.to,
            userId: resolvedAgent.user.id,
            agentId: resolvedAgent.agent.id,
            phoneNumberId: resolvedAgent.phoneNumber.id,
            startedAt: new Date().toISOString(),
            metadata: {
              source: "twilio-inbound-webhook",
              callerCity: inboundCall.callerCity,
              callerState: inboundCall.callerState,
              callerCountry: inboundCall.callerCountry,
              initialCallStatus: inboundCall.callStatus,
            },
          });
        } catch {
          // Keep the call path alive even if persistence is unavailable.
        }
      }

      const greeting = activeAgent.firstMessage || "Welcome to Yapsolutely. Your agent is getting ready.";
      const introLine = activeAgent.name
        ? `You have reached ${activeAgent.name}.`
        : "Welcome to Yapsolutely.";

      const twiml = buildStreamTwiml({
        introLine,
        greeting,
        callSid: inboundCall.callSid,
        agent: activeAgent,
      });

      registerPendingInboundContext(inboundCall.callSid, activeAgent);

      if (resolvedAgent?.agent) {
        try {
          await persistCallEvent({
            externalCallId: inboundCall.callSid,
            role: "SYSTEM",
            sequence: 1,
            text: introLine,
            payload: {
              type: "intro-line",
            },
          });

          await persistCallEvent({
            externalCallId: inboundCall.callSid,
            role: "AGENT",
            sequence: 2,
            text: greeting,
            payload: {
              type: "first-message",
              agentId: resolvedAgent.agent.id,
            },
          });
        } catch {
          // Transcript persistence should not block TwiML.
        }
      }

      sendTwiML(res, twiml);
    })().catch(() => {
      const fallbackTwiML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Welcome to Yapsolutely. The runtime is online, but the agent lookup failed.</Say>
</Response>`;
      sendTwiML(res, fallbackTwiML);
    });
    return;
  }

  if (req.method === "POST" && requestUrl.pathname === "/twilio/status") {
    (async () => {
      const body = await readRequestBody(req);
      const update = parseTwilioForm(body);

      try {
        await persistCallCompletion({
          externalCallId: update.callSid,
          status: mapTwilioCallStatus(update.callStatus),
          durationSeconds: update.callDuration ? Number(update.callDuration) : null,
          summary: buildCompletionSummary(update.callStatus),
          endedAt: new Date().toISOString(),
          metadata: {
            source: "twilio-status-webhook",
            finalCallStatus: update.callStatus,
          },
        });
      } catch {
        // Keep webhook responses resilient while the runtime is still being scaffolded.
      }

      sendJson(res, 200, { ok: true });
    })().catch(() => {
      sendJson(res, 500, { error: "Failed to process Twilio status update" });
    });
    return;
  }

  if (req.method === "GET" && requestUrl.pathname === "/") {
    sendJson(res, 200, {
      name: "Yapsolutely Voice Runtime",
      status: "stream-ready scaffold",
      endpoints: {
        health: "/health",
        readiness: "/readiness",
        twilioInbound: "/twilio/inbound",
        twilioStatus: "/twilio/status",
        twilioStream: "/twilio/stream (WebSocket)",
      },
      nextStep: "Replace the mock conversation engine with real STT, LLM, TTS, and interruption handling on top of the live Twilio media stream path.",
    });
    return;
  }

  sendJson(res, 404, {
    error: "Not found",
    path: requestUrl.pathname,
  });
});

server.on("upgrade", (req, socket, head) => {
  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || `localhost:${port}`}`);

  if (requestUrl.pathname !== "/twilio/stream") {
    socket.destroy();
    return;
  }

  websocketServer.handleUpgrade(req, socket, head, (upgradedSocket) => {
    websocketServer.emit("connection", upgradedSocket, req);
  });
});

server.listen(port, () => {
  console.log(`Yapsolutely voice runtime listening on http://localhost:${port}`);
});
