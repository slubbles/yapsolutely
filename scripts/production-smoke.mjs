#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const DEFAULT_VOICE_URL = "https://voice.84.247.176.111.sslip.io";
const DEFAULT_PHONE_NUMBER = "+13186108198";
const DEFAULT_CALLER_NUMBER = "+15551234567";
const DEFAULT_REMOTE_REPO_PATH = "/opt/yapsolutely";
const DEFAULT_SSH_SCRIPT = "/tmp/ssh-vps.sh";
const REQUEST_TIMEOUT_MS = 10000;
const CALL_DURATION_SECONDS = 34;

const config = {
  voiceUrl: (process.env.YAPS_VOICE_URL || process.env.VOICE_STREAM_BASE_URL || DEFAULT_VOICE_URL)
    .replace(/\/$/, "")
    .replace(/^ws(s?):\/\//, "http$1://"),
  phoneNumber: process.env.YAPS_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER || DEFAULT_PHONE_NUMBER,
  callerNumber: process.env.YAPS_CALLER_NUMBER || DEFAULT_CALLER_NUMBER,
  sshScriptPath: process.env.YAPS_SSH_SCRIPT || DEFAULT_SSH_SCRIPT,
  remoteRepoPath: process.env.YAPS_REMOTE_REPO_PATH || DEFAULT_REMOTE_REPO_PATH,
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

function printPass(label, detail) {
  console.log(`✅ ${label}${detail ? ` — ${detail}` : ""}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatUrl(baseUrl, path) {
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

function buildCallSid() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CA_SMOKE_${Date.now()}_${suffix}`;
}

async function postForm(label, url, formData) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(formData),
      signal: controller.signal,
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(`${label} responded with ${response.status}.`);
    }

    return text;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`${label} timed out after ${REQUEST_TIMEOUT_MS}ms.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function runRemoteSql(sql) {
  const remoteCommand = `cd ${config.remoteRepoPath}/deploy
. ./.env
docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A -F '|' <<'SQL'
${sql}
SQL`;

  return execFileSync(config.sshScriptPath, [remoteCommand], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function parsePipeRow(output, expectedColumns) {
  const row = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);

  if (!row) {
    return null;
  }

  const parts = row.split("|");
  assert(parts.length >= expectedColumns.length, `Expected at least ${expectedColumns.length} columns but got ${parts.length}.`);

  return Object.fromEntries(expectedColumns.map((column, index) => [column, parts[index] ?? ""]));
}

function printConfig(callSid) {
  console.log("Yapsolutely production smoke check\n");
  console.log(`• voice:   ${config.voiceUrl}`);
  console.log(`• to:      ${config.phoneNumber}`);
  console.log(`• from:    ${config.callerNumber}`);
  console.log(`• callSid: ${callSid}`);
  console.log(`• ssh:     ${config.sshScriptPath}`);
  console.log("");
}

async function main() {
  const callSid = buildCallSid();
  printConfig(callSid);

  const inboundTwiml = await postForm(
    "voice /twilio/inbound",
    formatUrl(config.voiceUrl, "/twilio/inbound"),
    {
      CallSid: callSid,
      From: config.callerNumber,
      To: config.phoneNumber,
      CallStatus: "ringing",
    },
  );

  assert(inboundTwiml.includes("<Connect>"), "Inbound webhook did not return TwiML with <Connect>.");
  assert(inboundTwiml.includes("<Stream "), "Inbound webhook did not return stream TwiML.");
  printPass("Inbound webhook", "returned TwiML with media stream instructions");

  const statusResponse = await postForm(
    "voice /twilio/status",
    formatUrl(config.voiceUrl, "/twilio/status"),
    {
      CallSid: callSid,
      CallStatus: "completed",
      CallDuration: String(CALL_DURATION_SECONDS),
    },
  );

  assert(statusResponse.includes('"ok": true') || statusResponse.includes('"ok":true'), "Status webhook did not acknowledge successfully.");
  printPass("Status webhook", `acknowledged completed call with duration ${CALL_DURATION_SECONDS}s`);

  await sleep(1500);

  const callRow = parsePipeRow(
    runRemoteSql(`SELECT COALESCE("id", ''), COALESCE("status"::text, ''), COALESCE("durationSeconds"::text, ''), COALESCE("summary", ''), COALESCE("agentId", ''), COALESCE("phoneNumberId", ''), COALESCE("callerNumber", ''), COALESCE("toNumber", '') FROM "Call" WHERE "externalCallId" = '${callSid}' LIMIT 1;`),
    ["id", "status", "durationSeconds", "summary", "agentId", "phoneNumberId", "callerNumber", "toNumber"],
  );

  assert(callRow, "No Call row was persisted for the smoke test callSid.");
  assert(callRow.status === "COMPLETED", `Expected persisted call status COMPLETED but got ${callRow.status || "<empty>"}.`);
  assert(callRow.durationSeconds === String(CALL_DURATION_SECONDS), `Expected durationSeconds=${CALL_DURATION_SECONDS} but got ${callRow.durationSeconds || "<empty>"}.`);
  assert(callRow.agentId, "Persisted Call row is missing agentId.");
  assert(callRow.phoneNumberId, "Persisted Call row is missing phoneNumberId.");
  assert(callRow.toNumber === config.phoneNumber, `Expected toNumber=${config.phoneNumber} but got ${callRow.toNumber || "<empty>"}.`);
  printPass("Call persistence", `${callRow.status} call row stored in production Postgres`);

  const eventRow = parsePipeRow(
    runRemoteSql(`SELECT COUNT(*)::text, COALESCE(string_agg("role"::text, ',' ORDER BY "sequence"), '') FROM "CallEvent" WHERE "callId" = '${callRow.id}';`),
    ["count", "roles"],
  );

  assert(eventRow, "Could not query CallEvent rows for the smoke test call.");
  const eventCount = Number(eventRow.count || "0");
  assert(Number.isFinite(eventCount) && eventCount >= 2, `Expected at least 2 CallEvent rows but found ${eventRow.count || "0"}.`);
  assert(eventRow.roles.includes("SYSTEM"), "Expected a SYSTEM CallEvent in the smoke test transcript timeline.");
  assert(eventRow.roles.includes("AGENT"), "Expected an AGENT CallEvent in the smoke test transcript timeline.");
  printPass("Event persistence", `${eventCount} transcript/event rows stored (${eventRow.roles})`);

  console.log("\n🎉 Production smoke check passed.");
  console.log("This verifies simulated inbound/status webhooks still persist call and transcript-event proof in production.");
}

main().catch((error) => {
  fail(error instanceof Error ? error.message : "Unknown smoke-check failure.");
});