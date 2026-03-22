import { describe, it, expect, vi, beforeEach } from "vitest";
import { runTool, performPendingHangup } from "./tool-runtime.js";

// ─── Helpers ──────────────────────────

function makeSession(overrides = {}) {
  return {
    externalCallId: "call-test-123",
    callerNumber: "+14155550100",
    phoneNumber: "+18005551234",
    callSid: "CA_test_sid",
    transferNumber: "+19175550199",
    callMetadata: {},
    pendingHangup: null,
    ...overrides,
  };
}

const noopLog = vi.fn().mockResolvedValue(undefined);

// ─── capture_lead ──────────────────────────

describe("capture_lead", () => {
  it("captures lead data and returns ok", async () => {
    const session = makeSession();
    const result = await runTool({
      session,
      toolName: "capture_lead",
      input: {
        fullName: "Jane Doe",
        email: "jane@example.com",
        service: "Consultation",
      },
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(true);
    expect(result.lead.fullName).toBe("Jane Doe");
    expect(result.lead.email).toBe("jane@example.com");
    expect(result.lead.service).toBe("Consultation");
    expect(result.lead.callerNumber).toBe("+14155550100");
    expect(session.callMetadata.latestLeadCapture).toBeDefined();
  });

  it("handles missing input fields gracefully", async () => {
    const session = makeSession();
    const result = await runTool({
      session,
      toolName: "capture_lead",
      input: {},
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(true);
    expect(result.lead.fullName).toBeNull();
    expect(result.lead.email).toBeNull();
  });
});

// ─── end_call ──────────────────────────

describe("end_call", () => {
  it("queues a pending hangup on the session", async () => {
    const session = makeSession();
    const result = await runTool({
      session,
      toolName: "end_call",
      input: { reason: "caller-goodbye" },
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(true);
    expect(result.queued).toBe(true);
    expect(session.pendingHangup).toBeTruthy();
    expect(session.pendingHangup.reason).toBe("caller-goodbye");
  });

  it("uses default reason when none provided", async () => {
    const session = makeSession();
    const result = await runTool({
      session,
      toolName: "end_call",
      input: {},
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(true);
    expect(session.pendingHangup.reason).toBe("assistant-requested-end-call");
  });
});

// ─── create_calendar_event ──────────────────────────

describe("create_calendar_event", () => {
  it("creates an event and stores it in session metadata", async () => {
    const session = makeSession();
    const result = await runTool({
      session,
      toolName: "create_calendar_event",
      input: {
        title: "Consultation with Jane",
        dateTime: "2025-02-15T10:00:00Z",
        duration: "30 minutes",
        attendeeName: "Jane Doe",
      },
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(true);
    expect(result.event.title).toBe("Consultation with Jane");
    expect(result.event.dateTime).toBe("2025-02-15T10:00:00Z");
    expect(session.callMetadata.calendarEvents).toHaveLength(1);
  });

  it("appends multiple events to the array", async () => {
    const session = makeSession();
    await runTool({
      session,
      toolName: "create_calendar_event",
      input: { title: "Event 1", dateTime: "2025-01-01" },
      logToolEvent: noopLog,
    });
    await runTool({
      session,
      toolName: "create_calendar_event",
      input: { title: "Event 2", dateTime: "2025-01-02" },
      logToolEvent: noopLog,
    });
    expect(session.callMetadata.calendarEvents).toHaveLength(2);
    expect(session.callMetadata.calendarEvents[1].title).toBe("Event 2");
  });
});

// ─── transfer_call ──────────────────────────

describe("transfer_call", () => {
  it("fails gracefully when no transfer number is available", async () => {
    const session = makeSession({ transferNumber: "", callSid: "CA_123" });
    const result = await runTool({
      session,
      toolName: "transfer_call",
      input: {},
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/no transfer number/i);
  });

  it("fails when no callSid is present", async () => {
    const session = makeSession({ callSid: null });
    const result = await runTool({
      session,
      toolName: "transfer_call",
      input: { to: "+19175550199" },
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/no active call/i);
  });
});

// ─── send_sms_confirmation ──────────────────────────

describe("send_sms_confirmation", () => {
  it("returns error when destination number is missing", async () => {
    const session = makeSession({ callerNumber: "" });
    const result = await runTool({
      session,
      toolName: "send_sms_confirmation",
      input: { message: "Hello!" },
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/missing.*number/i);
  });

  it("returns error when message body is empty", async () => {
    const session = makeSession();
    const result = await runTool({
      session,
      toolName: "send_sms_confirmation",
      input: { message: "" },
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/missing.*message/i);
  });
});

// ─── unknown tool ──────────────────────────

describe("runTool — unknown", () => {
  it("returns error for unknown tool names", async () => {
    const session = makeSession();
    const result = await runTool({
      session,
      toolName: "nonexistent_tool",
      input: {},
      logToolEvent: noopLog,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/unknown tool/i);
  });
});

// ─── performPendingHangup ──────────────────────────

describe("performPendingHangup", () => {
  it("returns null when no pending hangup exists", async () => {
    const session = makeSession();
    const result = await performPendingHangup({ session, logToolEvent: noopLog });
    expect(result).toBeNull();
  });

  it("returns null when no callSid is present", async () => {
    const session = makeSession({
      callSid: null,
      pendingHangup: { requestedAt: new Date().toISOString(), reason: "test" },
    });
    const result = await performPendingHangup({ session, logToolEvent: noopLog });
    expect(result).toBeNull();
  });
});
