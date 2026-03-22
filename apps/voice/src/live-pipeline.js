import { WebSocket } from "ws";
import { performPendingHangup } from "./tool-runtime.js";
import { generateAssistantReply } from "./llm.js";

const deepgramApiKey = process.env.DEEPGRAM_API_KEY || "";
const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";
const deepgramSttModel = process.env.DEEPGRAM_STT_MODEL || "nova-3";
const deepgramEndpointingMs = Number(process.env.DEEPGRAM_STT_ENDPOINTING_MS || 300);
const deepgramUtteranceEndMs = Number(process.env.DEEPGRAM_UTTERANCE_END_MS || 800);
const defaultVoiceModel =
  process.env.DEEPGRAM_TTS_MODEL || process.env.VOICE_MODEL || "aura-2-thalia-en";

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function normalizeLanguage(language) {
  if (!language) {
    return "en-US";
  }

  return language.replace("_", "-");
}

function buildDeepgramListenUrl(session) {
  const params = new URLSearchParams({
    encoding: "mulaw",
    sample_rate: "8000",
    channels: "1",
    interim_results: "true",
    vad_events: "true",
    endpointing: String(deepgramEndpointingMs),
    utterance_end_ms: String(deepgramUtteranceEndMs),
    punctuate: "true",
    smart_format: "true",
    model: deepgramSttModel,
    language: normalizeLanguage(session.language),
  });

  return `wss://api.deepgram.com/v1/listen?${params.toString()}`;
}

async function synthesizeSpeech(session, text, signal) {
  const model = session.voiceModel || defaultVoiceModel;
  const maxAttempts = 3;
  const retryableStatuses = new Set([429, 503, 529]);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(
      `https://api.deepgram.com/v1/speak?model=${encodeURIComponent(model)}&encoding=mulaw&sample_rate=8000&container=none`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${deepgramApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
        signal,
      },
    );

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    if (attempt < maxAttempts && retryableStatuses.has(response.status)) {
      await wait(Math.min(1000 * attempt, 3000));
      continue;
    }

    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Deepgram TTS request failed (${response.status})`);
  }
}

async function streamAudioBufferToTwilio(socket, session, audioBuffer, shouldStop) {
  if (!audioBuffer.length) {
    return null;
  }

  const bytesPerMillisecond = 8;
  const maxChunkBytes = 320;
  let completed = true;

  for (let offset = 0; offset < audioBuffer.length; offset += maxChunkBytes) {
    if (shouldStop()) {
      completed = false;
      break;
    }

    const chunk = audioBuffer.subarray(offset, Math.min(offset + maxChunkBytes, audioBuffer.length));

    if (socket.readyState !== 1) {
      break;
    }

    socket.send(
      JSON.stringify({
        event: "media",
        streamSid: session.streamSid,
        media: {
          payload: chunk.toString("base64"),
        },
      }),
    );

    const delayMs = Math.max(20, Math.round(chunk.length / bytesPerMillisecond));
    await wait(delayMs);
  }

  if (completed && !shouldStop() && socket.readyState === 1) {
    const markName = `agent-response-${session.playbackToken}`;

    socket.send(
      JSON.stringify({
        event: "mark",
        streamSid: session.streamSid,
        mark: {
          name: markName,
        },
      }),
    );

    return markName;
  }

  return null;
}

function safeParseJson(rawValue) {
  try {
    return JSON.parse(rawValue.toString());
  } catch {
    return null;
  }
}

export function createLivePipelineController({ session, socket, recordEvent }) {
  const requestedLiveMode = session.pipelineMode === "live";

  if (!requestedLiveMode) {
    return {
      active: false,
      reason: "VOICE_PIPELINE_MODE is not set to live.",
      handleMediaMessage() {},
      async close() {},
    };
  }

  if (!deepgramApiKey || !anthropicApiKey) {
    return {
      active: false,
      reason: "Missing DEEPGRAM_API_KEY or ANTHROPIC_API_KEY for live pipeline mode.",
      handleMediaMessage() {},
      async close() {},
    };
  }

  session.history = [];
  session.pendingTranscript = "";
  session.pendingTurns = [];
  session.processingTurns = false;
  session.isGeneratingResponse = false;
  session.isPlayingAudio = false;
  session.playbackToken = 0;
  session.pendingPlaybackMark = null;
  session.activeResponseController = null;
  session.activeSynthesisController = null;

  const deepgramSocket = new WebSocket(buildDeepgramListenUrl(session), {
    headers: {
      Authorization: `Token ${deepgramApiKey}`,
    },
  });

  const keepAliveInterval = setInterval(() => {
    if (deepgramSocket.readyState === WebSocket.OPEN) {
      deepgramSocket.send(JSON.stringify({ type: "KeepAlive" }));
    }
  }, 8000);

  async function interruptActiveTurn(reason) {
    const hadActiveTurn = Boolean(
      session.activeResponseController ||
        session.activeSynthesisController ||
        session.isPlayingAudio ||
        session.pendingPlaybackMark,
    );

    if (!hadActiveTurn) {
      return;
    }

    session.activeResponseController?.abort();
    session.activeSynthesisController?.abort();
    session.activeResponseController = null;
    session.activeSynthesisController = null;
    session.isGeneratingResponse = false;

    if ((session.isPlayingAudio || session.pendingPlaybackMark) && socket.readyState === 1) {
      session.playbackToken += 1;
      session.isPlayingAudio = false;
      session.pendingPlaybackMark = null;
      socket.send(
        JSON.stringify({
          event: "clear",
          streamSid: session.streamSid,
        }),
      );
    }

    await recordEvent("SYSTEM", "Caller interruption detected; clearing the current agent response.", {
      type: "barge-in",
      reason,
    });
  }

  async function synthesizeAndPlay(text) {
    const controller = new AbortController();
    const playbackToken = session.playbackToken + 1;

    session.playbackToken = playbackToken;
    session.activeSynthesisController = controller;

    try {
      const audioBuffer = await synthesizeSpeech(session, text, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      session.isPlayingAudio = true;

      const playbackMarkName = await streamAudioBufferToTwilio(socket, session, audioBuffer, () => {
        return controller.signal.aborted || playbackToken !== session.playbackToken;
      });

      if (!controller.signal.aborted && playbackToken === session.playbackToken && playbackMarkName) {
        session.pendingPlaybackMark = playbackMarkName;
      } else if (playbackToken === session.playbackToken) {
        session.isPlayingAudio = false;
      }
    } finally {
      if (session.activeSynthesisController === controller) {
        session.activeSynthesisController = null;
      }

      if (playbackToken !== session.playbackToken || !session.pendingPlaybackMark) {
        session.isPlayingAudio = false;
      }
    }
  }

  async function handleMarkMessage(message) {
    const markName = message?.mark?.name || null;

    if (!markName || markName !== session.pendingPlaybackMark) {
      return false;
    }

    session.pendingPlaybackMark = null;
    session.isPlayingAudio = false;

    await performPendingHangup({
      session,
      logToolEvent: async (toolText, payload) => {
        await recordEvent("TOOL", toolText, payload);
      },
    });

    return true;
  }

  async function processUserTurn(text, payload) {
    if (!text) {
      return;
    }

    session.isGeneratingResponse = true;
    session.history.push({ role: "user", content: text });

    await recordEvent("USER", text, {
      type: "deepgram-final-transcript",
      ...payload,
    });

    const controller = new AbortController();
    session.activeResponseController = controller;

    let assistantReply = "";

    try {
      assistantReply = await generateAssistantReply(session, controller.signal, recordEvent);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      await recordEvent(
        "SYSTEM",
        "Live response generation failed, so the runtime is asking the caller to repeat the request.",
        {
          type: "live-response-error",
          message: error instanceof Error ? error.message : String(error),
        },
      );

      assistantReply =
        "I’m sorry — I ran into a temporary issue responding. Could you please repeat that?";
    } finally {
      if (session.activeResponseController === controller) {
        session.activeResponseController = null;
      }

      session.isGeneratingResponse = false;
    }

    if (!assistantReply) {
      return;
    }

    session.history.push({ role: "assistant", content: assistantReply });

    await recordEvent("AGENT", assistantReply, {
      type: "anthropic-response",
      voiceModel: session.voiceModel || defaultVoiceModel,
    });

    try {
      await synthesizeAndPlay(assistantReply);
    } catch (error) {
      if (!controller.signal.aborted) {
        await recordEvent("SYSTEM", "Speech synthesis failed before audio playback could finish.", {
          type: "tts-error",
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  async function drainTurnQueue() {
    if (session.processingTurns) {
      return;
    }

    session.processingTurns = true;

    try {
      while (session.pendingTurns.length > 0) {
        const nextTurn = session.pendingTurns.shift();

        if (!nextTurn) {
          continue;
        }

        await processUserTurn(nextTurn.text, nextTurn.payload);
      }
    } finally {
      session.processingTurns = false;
    }
  }

  function queueUserTurn(text, payload) {
    session.pendingTurns.push({ text, payload });
    void drainTurnQueue();
  }

  async function handleDeepgramMessage(message) {
    if (!message) {
      return;
    }

    if (message.type === "SpeechStarted") {
      await interruptActiveTurn("speech-started");
      return;
    }

    if (message.type === "Results") {
      const transcript = message.channel?.alternatives?.[0]?.transcript?.trim() || "";

      if (transcript && !message.is_final && (session.isPlayingAudio || session.isGeneratingResponse)) {
        await interruptActiveTurn("interim-transcript");
      }

      if (message.is_final && transcript) {
        session.pendingTranscript = [session.pendingTranscript, transcript].filter(Boolean).join(" ").trim();
      }

      if ((message.speech_final || message.from_finalize) && session.pendingTranscript) {
        const finalizedTranscript = session.pendingTranscript;
        session.pendingTranscript = "";

        queueUserTurn(finalizedTranscript, {
          confidence: message.channel?.alternatives?.[0]?.confidence ?? null,
          source: message.speech_final ? "speech-final" : "finalize",
        });
      }

      return;
    }

    if (message.type === "UtteranceEnd" && session.pendingTranscript) {
      const finalizedTranscript = session.pendingTranscript;
      session.pendingTranscript = "";

      queueUserTurn(finalizedTranscript, {
        source: "utterance-end",
      });
    }
  }

  deepgramSocket.on("open", () => {
    void recordEvent("SYSTEM", "Deepgram live transcription connection opened.", {
      type: "deepgram-open",
      model: deepgramSttModel,
      language: normalizeLanguage(session.language),
    });
  });

  deepgramSocket.on("message", (rawMessage) => {
    const message = safeParseJson(rawMessage);
    void handleDeepgramMessage(message);
  });

  deepgramSocket.on("close", (code, reasonBuffer) => {
    clearInterval(keepAliveInterval);
    void recordEvent("SYSTEM", "Deepgram live transcription connection closed.", {
      type: "deepgram-close",
      code,
      reason: reasonBuffer?.toString() || null,
    });
  });

  deepgramSocket.on("error", (error) => {
    void recordEvent("SYSTEM", "Deepgram live transcription connection errored.", {
      type: "deepgram-error",
      message: error instanceof Error ? error.message : String(error),
    });
  });

  return {
    active: true,
    reason: null,
    handleMediaMessage(message) {
      const audioPayload = message.media?.payload;

      if (!audioPayload || deepgramSocket.readyState !== WebSocket.OPEN) {
        return;
      }

      deepgramSocket.send(Buffer.from(audioPayload, "base64"));
    },
    async handleMarkMessage(message) {
      await handleMarkMessage(message);
    },
    async close() {
      clearInterval(keepAliveInterval);
      session.activeResponseController?.abort();
      session.activeSynthesisController?.abort();
      session.pendingPlaybackMark = null;
      session.isPlayingAudio = false;

      if (deepgramSocket.readyState === WebSocket.OPEN || deepgramSocket.readyState === WebSocket.CONNECTING) {
        deepgramSocket.close();
      }
    },
  };
}