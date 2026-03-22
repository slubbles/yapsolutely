const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const runtimeSharedSecret = process.env.RUNTIME_SHARED_SECRET || "";
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || "";
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || "";
const defaultSmsFromNumber = process.env.TWILIO_SMS_FROM_NUMBER || process.env.TWILIO_PHONE_NUMBER || "";

function runtimeHeaders() {
  return {
    "Content-Type": "application/json",
    "x-yapsolutely-runtime-secret": runtimeSharedSecret,
  };
}

function sanitizePhoneNumber(value) {
  if (!value) {
    return "";
  }

  const trimmed = String(value).trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\D/g, "")}`;
  }

  return `+${trimmed.replace(/\D/g, "")}`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed with status ${response.status}`);
  }

  return data;
}

async function mergeCallMetadata({ externalCallId, metadata }) {
  if (!runtimeSharedSecret || !externalCallId) {
    return null;
  }

  return fetchJson(`${appUrl}/api/runtime/calls/start`, {
    method: "POST",
    headers: runtimeHeaders(),
    body: JSON.stringify({
      externalCallId,
      metadata,
    }),
  });
}

async function postTwilioForm(pathname, params) {
  if (!twilioAccountSid || !twilioAuthToken) {
    throw new Error("Missing Twilio account credentials.");
  }

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/${pathname}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams(params),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Twilio request failed with status ${response.status}`);
  }

  return response.json().catch(() => ({}));
}

function toolDefinitions(session) {
  return [
    {
      name: "capture_lead",
      description:
        "Capture structured lead or booking details gathered during the call so the product can save them in call metadata.",
      input_schema: {
        type: "object",
        properties: {
          fullName: {
            type: "string",
            description: "The caller's full name if known.",
          },
          email: {
            type: "string",
            description: "The caller's email address if provided.",
          },
          service: {
            type: "string",
            description: "The service or reason for the call.",
          },
          preferredDateTime: {
            type: "string",
            description: "The requested appointment or follow-up time in plain text.",
          },
          notes: {
            type: "string",
            description: "Any useful extra notes collected from the caller.",
          },
        },
        additionalProperties: false,
      },
    },
    {
      name: "send_sms_confirmation",
      description:
        "Send a confirmation SMS to the caller or another provided phone number after collecting booking or support details.",
      input_schema: {
        type: "object",
        properties: {
          to: {
            type: "string",
            description: "Destination phone number in E.164 format. If omitted, the caller number is used.",
          },
          message: {
            type: "string",
            description: "The SMS body to send.",
          },
        },
        required: ["message"],
        additionalProperties: false,
      },
    },
    {
      name: "end_call",
      description:
        "Gracefully end the active Twilio call after the assistant says goodbye or confirms the next step.",
      input_schema: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Short internal reason for ending the call.",
          },
        },
        additionalProperties: false,
      },
    },
    {
      name: "create_calendar_event",
      description:
        "Create a calendar event or appointment from details collected during the call. The event is stored in the call metadata for the dashboard to display.",
      input_schema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Event title (e.g. 'Consultation with Jane Smith').",
          },
          dateTime: {
            type: "string",
            description: "Preferred date and time in plain text or ISO 8601 format.",
          },
          duration: {
            type: "string",
            description: "Expected duration (e.g. '30 minutes', '1 hour').",
          },
          attendeeName: {
            type: "string",
            description: "Name of the caller or attendee.",
          },
          attendeeEmail: {
            type: "string",
            description: "Email address of the attendee if provided.",
          },
          attendeePhone: {
            type: "string",
            description: "Phone number of the attendee.",
          },
          notes: {
            type: "string",
            description: "Any additional notes about the appointment.",
          },
        },
        required: ["title", "dateTime"],
        additionalProperties: false,
      },
    },
    {
      name: "transfer_call",
      description:
        "Transfer the active call to a live human agent or a specific phone number.",
      input_schema: {
        type: "object",
        properties: {
          to: {
            type: "string",
            description: "Phone number to transfer to in E.164 format. If omitted, uses the agent's configured transfer number.",
          },
          reason: {
            type: "string",
            description: "Short reason for the transfer (e.g. 'Caller requested manager').",
          },
        },
        additionalProperties: false,
      },
    },
  ].filter(Boolean);
}

async function captureLead({ session, input, logToolEvent }) {
  const lead = {
    fullName: input?.fullName || null,
    email: input?.email || null,
    service: input?.service || null,
    preferredDateTime: input?.preferredDateTime || null,
    notes: input?.notes || null,
    callerNumber: session.callerNumber || null,
    capturedAt: new Date().toISOString(),
  };

  await mergeCallMetadata({
    externalCallId: session.externalCallId,
    metadata: {
      ...(session.callMetadata || {}),
      latestLeadCapture: lead,
    },
  }).catch(() => null);

  session.callMetadata = {
    ...(session.callMetadata || {}),
    latestLeadCapture: lead,
  };

  await logToolEvent("Captured structured lead details from the call.", {
    toolName: "capture_lead",
    lead,
  });

  return {
    ok: true,
    lead,
  };
}

async function sendSmsConfirmation({ session, input, logToolEvent }) {
  const to = sanitizePhoneNumber(input?.to || session.callerNumber);
  const from = sanitizePhoneNumber(session.phoneNumber || defaultSmsFromNumber);
  const body = String(input?.message || "").trim();

  if (!to) {
    await logToolEvent("SMS confirmation could not be sent because the destination number is missing.", {
      toolName: "send_sms_confirmation",
      to,
      from,
    });

    return {
      ok: false,
      error: "Missing destination phone number.",
    };
  }

  if (!from) {
    await logToolEvent("SMS confirmation could not be sent because the sender number is missing.", {
      toolName: "send_sms_confirmation",
      to,
      from,
    });

    return {
      ok: false,
      error: "Missing sender phone number.",
    };
  }

  if (!body) {
    return {
      ok: false,
      error: "Missing SMS message body.",
    };
  }

  try {
    const twilioResponse = await postTwilioForm("Messages.json", {
      To: to,
      From: from,
      Body: body,
    });

    await logToolEvent("Sent an SMS confirmation to the caller.", {
      toolName: "send_sms_confirmation",
      to,
      from,
      body,
      sid: twilioResponse.sid || null,
    });

    return {
      ok: true,
      sid: twilioResponse.sid || null,
      to,
      from,
    };
  } catch (error) {
    await logToolEvent("SMS confirmation failed to send.", {
      toolName: "send_sms_confirmation",
      to,
      from,
      body,
      message: error instanceof Error ? error.message : String(error),
    });

    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function endCall({ session, input, logToolEvent }) {
  session.pendingHangup = {
    requestedAt: new Date().toISOString(),
    reason: input?.reason || "assistant-requested-end-call",
  };

  await logToolEvent("Queued a graceful call end after the assistant finishes speaking.", {
    toolName: "end_call",
    reason: session.pendingHangup.reason,
  });

  return {
    ok: true,
    queued: true,
    reason: session.pendingHangup.reason,
  };
}

async function createCalendarEvent({ session, input, logToolEvent }) {
  const event = {
    title: input?.title || "Untitled appointment",
    dateTime: input?.dateTime || null,
    duration: input?.duration || null,
    attendeeName: input?.attendeeName || null,
    attendeeEmail: input?.attendeeEmail || null,
    attendeePhone: input?.attendeePhone || session.callerNumber || null,
    notes: input?.notes || null,
    createdAt: new Date().toISOString(),
  };

  // Store event in call metadata
  const existingEvents = session.callMetadata?.calendarEvents || [];
  const updatedEvents = [...existingEvents, event];

  await mergeCallMetadata({
    externalCallId: session.externalCallId,
    metadata: {
      ...(session.callMetadata || {}),
      calendarEvents: updatedEvents,
    },
  }).catch(() => null);

  session.callMetadata = {
    ...(session.callMetadata || {}),
    calendarEvents: updatedEvents,
  };

  await logToolEvent("Created a calendar event from call details.", {
    toolName: "create_calendar_event",
    event,
  });

  return {
    ok: true,
    event,
  };
}

async function transferCall({ session, input, logToolEvent }) {
  const transferTo = sanitizePhoneNumber(input?.to || session.transferNumber);
  const reason = input?.reason || "caller-requested-transfer";

  if (!transferTo) {
    await logToolEvent("Call transfer failed — no transfer number configured or provided.", {
      toolName: "transfer_call",
      reason,
    });

    return {
      ok: false,
      error: "No transfer number available. Please provide a phone number to transfer to.",
    };
  }

  if (!session.callSid) {
    await logToolEvent("Call transfer failed — no active Twilio call SID available.", {
      toolName: "transfer_call",
      transferTo,
      reason,
    });

    return {
      ok: false,
      error: "Cannot transfer — no active call reference.",
    };
  }

  // Use Twilio's update call API to redirect to a TwiML that dials the transfer number
  try {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="alice">Transferring you now. Please hold.</Say><Dial>${escapeXml(transferTo)}</Dial></Response>`;

    await postTwilioForm(`Calls/${session.callSid}.json`, {
      Twiml: twiml,
    });

    await logToolEvent("Transferred the call to a live agent.", {
      toolName: "transfer_call",
      transferTo,
      reason,
    });

    return {
      ok: true,
      transferTo,
      reason,
    };
  } catch (error) {
    await logToolEvent("Call transfer failed during Twilio API call.", {
      toolName: "transfer_call",
      transferTo,
      reason,
      message: error instanceof Error ? error.message : String(error),
    });

    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function runTool({ session, toolName, input, logToolEvent }) {
  switch (toolName) {
    case "capture_lead":
      return captureLead({ session, input, logToolEvent });
    case "send_sms_confirmation":
      return sendSmsConfirmation({ session, input, logToolEvent });
    case "end_call":
      return endCall({ session, input, logToolEvent });
    case "create_calendar_event":
      return createCalendarEvent({ session, input, logToolEvent });
    case "transfer_call":
      return transferCall({ session, input, logToolEvent });
    default:
      return {
        ok: false,
        error: `Unknown tool: ${toolName}`,
      };
  }
}

export async function performPendingHangup({ session, logToolEvent }) {
  if (!session.pendingHangup || !session.callSid) {
    return null;
  }

  const pendingHangup = session.pendingHangup;
  session.pendingHangup = null;

  try {
    const response = await postTwilioForm(`Calls/${session.callSid}.json`, {
      Status: "completed",
    });

    await logToolEvent("Ended the Twilio call after the assistant finished speaking.", {
      toolName: "end_call",
      reason: pendingHangup.reason,
      sid: response.sid || session.callSid,
    });

    return {
      ok: true,
      sid: response.sid || session.callSid,
    };
  } catch (error) {
    await logToolEvent("Graceful call end failed when attempting to update Twilio call status.", {
      toolName: "end_call",
      reason: pendingHangup.reason,
      message: error instanceof Error ? error.message : String(error),
    });

    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function getRuntimeToolDefinitions(session) {
  return toolDefinitions(session);
}