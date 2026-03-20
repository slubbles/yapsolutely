#!/usr/bin/env node

const DEFAULT_WEB_URL = "https://web.84.247.176.111.sslip.io";
const DEFAULT_VOICE_URL = "https://voice.84.247.176.111.sslip.io";
const DEFAULT_PHONE_NUMBER = "+13186108198";
const REQUEST_TIMEOUT_MS = 5000;

const config = {
  webUrl: (process.env.YAPS_WEB_URL || process.env.NEXT_PUBLIC_APP_URL || DEFAULT_WEB_URL).replace(/\/$/, ""),
  voiceUrl: (process.env.YAPS_VOICE_URL || process.env.VOICE_STREAM_BASE_URL || DEFAULT_VOICE_URL)
    .replace(/\/$/, "")
    .replace(/^ws(s?):\/\//, "http$1://"),
  phoneNumber: process.env.YAPS_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER || DEFAULT_PHONE_NUMBER,
  runtimeSecret: process.env.YAPS_RUNTIME_SECRET || process.env.RUNTIME_SHARED_SECRET || "",
};

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function formatUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function fetchJson(label, url, { headers = {} } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(`${label} returned non-JSON output.`);
    }

    if (!response.ok) {
      throw new Error(
        `${label} responded with ${response.status}${data?.error ? ` (${data.error})` : ""}.`,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`${label} timed out after ${REQUEST_TIMEOUT_MS}ms.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function printPass(label, detail) {
  console.log(`✅ ${label}${detail ? ` — ${detail}` : ""}`);
}

function printConfig() {
  console.log("Yapsolutely production preflight\n");
  console.log(`• web:   ${config.webUrl}`);
  console.log(`• voice: ${config.voiceUrl}`);
  console.log(`• phone: ${config.phoneNumber}`);
  console.log(`• secret: ${config.runtimeSecret ? "provided" : "missing"}`);
  console.log("");
}

async function main() {
  if (!config.runtimeSecret) {
    fail("Missing YAPS_RUNTIME_SECRET or RUNTIME_SHARED_SECRET.");
  }

  printConfig();

  const authHeaders = {
    "x-yapsolutely-runtime-secret": config.runtimeSecret,
  };

  const webHealth = await fetchJson("web /api/health", formatUrl(config.webUrl, "/api/health"));
  assert(webHealth?.ok === true, "web /api/health did not report ok=true.");
  assert(webHealth?.service === "yapsolutely-web", "web /api/health returned an unexpected service name.");
  printPass("Web health", `runtime mode ${webHealth.runtimeMode || "unknown"}`);

  const voiceHealth = await fetchJson("voice /health", formatUrl(config.voiceUrl, "/health"));
  assert(voiceHealth?.ok === true, "voice /health did not report ok=true.");
  assert(voiceHealth?.service === "yapsolutely-voice", "voice /health returned an unexpected service name.");
  printPass("Voice health", `pipeline mode ${voiceHealth.pipelineMode || "unknown"}`);

  const webReadiness = await fetchJson(
    "web /api/readiness",
    formatUrl(config.webUrl, "/api/readiness"),
    { headers: authHeaders },
  );
  assert(webReadiness?.status === "ok", "web /api/readiness did not return status=ok.");
  assert(
    webReadiness?.readiness?.readyForLiveValidation === true,
    "web readiness says the stack is not ready for live validation.",
  );
  assert(
    Array.isArray(webReadiness?.readiness?.missingKeys) && webReadiness.readiness.missingKeys.length === 0,
    "web readiness still reports missing keys.",
  );
  assert(
    webReadiness?.readiness?.runtimeHealth?.status === "reachable",
    "web readiness cannot reach the voice /health endpoint.",
  );
  assert(
    webReadiness?.readiness?.runtimeReadiness?.status === "reachable",
    "web readiness cannot reach the voice /readiness endpoint.",
  );
  printPass(
    "Web readiness",
    `${webReadiness.readiness.configuredCount}/${webReadiness.readiness.totalCount} configured`,
  );

  const voiceReadiness = await fetchJson(
    "voice /readiness",
    formatUrl(config.voiceUrl, "/readiness"),
    { headers: authHeaders },
  );
  assert(voiceReadiness?.status === "ready", "voice /readiness did not return status=ready.");
  assert(
    Array.isArray(voiceReadiness?.missingKeys) && voiceReadiness.missingKeys.length === 0,
    "voice readiness still reports missing keys.",
  );
  assert(
    voiceReadiness?.webApp?.health?.status === "reachable",
    "voice readiness cannot reach web /api/health.",
  );
  assert(
    voiceReadiness?.webApp?.readiness?.status === "reachable",
    "voice readiness cannot reach web /api/readiness.",
  );
  assert(
    voiceReadiness?.webApp?.readiness?.readyForLiveValidation === true,
    "voice readiness says the web app is not ready for live validation.",
  );
  printPass("Voice readiness", `${voiceReadiness.configuredCount}/${voiceReadiness.totalCount} configured`);

  const resolveAgent = await fetchJson(
    "runtime resolve-agent",
    `${formatUrl(config.webUrl, "/api/runtime/resolve-agent")}?phoneNumber=${encodeURIComponent(config.phoneNumber)}`,
    { headers: authHeaders },
  );
  assert(resolveAgent?.agent?.id, "resolve-agent did not return an agent id.");
  assert(resolveAgent?.agent?.status === "ACTIVE", "resolved agent is not ACTIVE.");
  assert(resolveAgent?.agent?.isActive === true, "resolved agent is not callable (isActive=false).");
  assert(resolveAgent?.phoneNumber?.value === config.phoneNumber, "resolved phone number did not match the requested number.");
  printPass(
    "Runtime agent resolution",
    `${resolveAgent.agent.name} ← ${resolveAgent.phoneNumber.value}`,
  );

  console.log("\n🎉 Production preflight passed.");
  console.log("Next human-only steps: place a real call, verify the dashboard transcript, and record the Loom demo.");
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : "Unknown preflight failure.");
});