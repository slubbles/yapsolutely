"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Send, RotateCcw, Bot, User, Loader2, Mic, MicOff, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

type AgentSummary = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  systemPrompt: string;
  firstMessage: string | null;
  voiceModel: string | null;
  status: string;
};

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
};

type VoiceState = "idle" | "connecting" | "listening" | "processing" | "speaking" | "error";

// ─── Voice mode hook ─────────────────────────────────────────

function useVoiceSession(agentId: string, onMessage: (msg: Message) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const playQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);

  const playAudioQueue = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    const audioCtx = ctxRef.current;
    if (!audioCtx) {
      isPlayingRef.current = false;
      return;
    }

    while (playQueueRef.current.length > 0) {
      const chunk = playQueueRef.current.shift()!;
      // Convert linear16 to float32 for playback
      const int16 = new Int16Array(chunk);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }
      const buffer = audioCtx.createBuffer(1, float32.length, 24000);
      buffer.copyToChannel(float32, 0);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
      });
    }

    isPlayingRef.current = false;
  }, []);

  const start = useCallback(async () => {
    setVoiceError(null);
    setVoiceState("connecting");

    try {
      // Get WebSocket URL from API
      const tokenRes = await fetch("/api/runtime/voice-ws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });

      if (!tokenRes.ok) {
        const data = await tokenRes.json().catch(() => null);
        throw new Error(data?.error || `Failed to get voice connection (${tokenRes.status})`);
      }

      const { wsUrl, agent } = await tokenRes.json();

      // Request mic access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });
      streamRef.current = stream;

      // Set up audio context for mic capture and playback
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      ctxRef.current = audioCtx;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        // Send agent config
        ws.send(JSON.stringify({ type: "config", agent }));
      };

      ws.onmessage = (event) => {
        if (typeof event.data === "string") {
          let msg;
          try {
            msg = JSON.parse(event.data);
          } catch {
            return;
          }

          if (msg.type === "ready") {
            setVoiceState("listening");
            // Start sending mic audio
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              if (ws.readyState !== WebSocket.OPEN) return;
              const float32Data = e.inputBuffer.getChannelData(0);
              // Convert float32 to linear16 PCM
              const int16 = new Int16Array(float32Data.length);
              for (let i = 0; i < float32Data.length; i++) {
                const s = Math.max(-1, Math.min(1, float32Data[i]));
                int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
              }
              ws.send(int16.buffer);
            };

            source.connect(processor);
            processor.connect(audioCtx.destination);
          }

          if (msg.type === "transcript" && msg.text) {
            // Show interim/final transcript as system message
            if (msg.is_final) {
              onMessage({
                id: `transcript-${Date.now()}`,
                role: "system",
                content: `🎤 "${msg.text}"`,
                timestamp: Date.now(),
              });
            }
          }

          if (msg.type === "user_final" && msg.text) {
            onMessage({
              id: `user-${Date.now()}`,
              role: "user",
              content: msg.text,
              timestamp: Date.now(),
            });
            setVoiceState("processing");
          }

          if (msg.type === "response" && msg.text) {
            onMessage({
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: msg.text,
              timestamp: Date.now(),
            });
            setVoiceState("speaking");
          }

          if (msg.type === "audio" && msg.payload) {
            const binary = atob(msg.payload);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            playQueueRef.current.push(bytes.buffer);
          }

          if (msg.type === "audio_end") {
            void playAudioQueue().then(() => {
              setVoiceState("listening");
            });
          }

          if (msg.type === "error") {
            setVoiceError(msg.message || "Voice pipeline error");
            setVoiceState("error");
          }

          if (msg.type === "status") {
            onMessage({
              id: `status-${Date.now()}`,
              role: "system",
              content: msg.message,
              timestamp: Date.now(),
            });
          }
        }
      };

      ws.onclose = () => {
        setVoiceState("idle");
      };

      ws.onerror = () => {
        setVoiceError("WebSocket connection failed");
        setVoiceState("error");
      };
    } catch (err) {
      setVoiceError(err instanceof Error ? err.message : "Failed to start voice session");
      setVoiceState("error");
    }
  }, [agentId, onMessage, playAudioQueue]);

  const stop = useCallback(() => {
    processorRef.current?.disconnect();
    processorRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    ctxRef.current?.close();
    ctxRef.current = null;
    playQueueRef.current = [];
    isPlayingRef.current = false;
    setVoiceState("idle");
    setVoiceError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { voiceState, voiceError, start, stop };
}

// ─── Voice state indicator ───────────────────────────────────

function VoiceStateIndicator({ state }: { state: VoiceState }) {
  const configs: Record<VoiceState, { label: string; color: string; pulse: boolean }> = {
    idle: { label: "Ready", color: "bg-text-subtle/30", pulse: false },
    connecting: { label: "Connecting…", color: "bg-yellow-400", pulse: true },
    listening: { label: "Listening", color: "bg-emerald-400", pulse: true },
    processing: { label: "Thinking…", color: "bg-blue-400", pulse: true },
    speaking: { label: "Speaking", color: "bg-purple-400", pulse: true },
    error: { label: "Error", color: "bg-red-400", pulse: false },
  };
  const cfg = configs[state];
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${cfg.color} ${cfg.pulse ? "animate-pulse" : ""}`} />
      <span className="font-body text-[0.72rem] text-text-subtle">{cfg.label}</span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────

export default function AgentTestClient({ agent }: { agent: AgentSummary }) {
  const slug = agent.slug ?? agent.id;
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [messages, setMessages] = useState<Message[]>(() => {
    if (agent.firstMessage) {
      return [{
        id: "first",
        role: "assistant" as const,
        content: agent.firstMessage,
        timestamp: Date.now(),
      }];
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const { voiceState, voiceError, start: startVoice, stop: stopVoice } =
    useVoiceSession(agent.id, addMessage);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (mode === "text") inputRef.current?.focus();
  }, [mode]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setError(null);
    setInput("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages
        .filter((m) => m.id !== "first" && m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/runtime/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, messages: apiMessages }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      const reply = data?.reply || "No response from agent.";
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, messages, agent.id]);

  const resetConversation = () => {
    if (mode === "voice") stopVoice();
    setMessages(
      agent.firstMessage
        ? [{ id: "first", role: "assistant", content: agent.firstMessage, timestamp: Date.now() }]
        : [],
    );
    setError(null);
    setInput("");
    if (mode === "text") inputRef.current?.focus();
  };

  const handleModeSwitch = (newMode: "text" | "voice") => {
    if (newMode === mode) return;
    if (mode === "voice") stopVoice();
    setMode(newMode);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Header */}
        <div className="shrink-0 border-b border-border-soft bg-surface-panel px-5 py-4">
          <div className="flex items-center justify-between max-w-[900px] mx-auto">
            <div className="flex items-center gap-3">
              <Link
                href={`/agents/${slug}`}
                className="inline-flex items-center gap-1.5 font-body text-[0.75rem] text-text-subtle hover:text-text-body transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Link>
              <div className="h-4 w-px bg-border-soft" />
              <div>
                <h1 className="font-display text-sm font-semibold text-text-strong">
                  Test: {agent.name}
                </h1>
                <p className="font-body text-[0.68rem] text-text-subtle">
                  {mode === "text" ? "Chat with your agent" : "Talk to your agent"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Mode toggle */}
              <div className="flex items-center bg-surface-subtle rounded-lg p-0.5 gap-0.5">
                <button
                  onClick={() => handleModeSwitch("text")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-body text-[0.72rem] transition-all ${
                    mode === "text"
                      ? "bg-surface-panel text-text-strong shadow-sm"
                      : "text-text-subtle hover:text-text-body"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Text
                </button>
                <button
                  onClick={() => handleModeSwitch("voice")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-body text-[0.72rem] transition-all ${
                    mode === "voice"
                      ? "bg-surface-panel text-text-strong shadow-sm"
                      : "text-text-subtle hover:text-text-body"
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Voice
                </button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetConversation}
                className="font-body text-[0.75rem] text-text-subtle gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
          <div className="max-w-[900px] mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-surface-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-6 h-6 text-text-subtle" />
                </div>
                <p className="font-body text-[0.85rem] text-text-subtle mb-1">
                  {mode === "text" ? "Start a conversation" : "Start a voice call"}
                </p>
                <p className="font-body text-[0.75rem] text-text-subtle/70">
                  {mode === "text"
                    ? `Type a message below to test how ${agent.name} responds.`
                    : `Click the microphone button below to start talking to ${agent.name}.`}
                </p>
              </div>
            )}

            {messages.map((msg) => {
              if (msg.role === "system") {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className="font-body text-[0.7rem] text-text-subtle/60 bg-surface-subtle px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                );
              }
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                      msg.role === "user"
                        ? "bg-surface-subtle"
                        : "bg-accent-warm/10"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5 text-text-subtle" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-accent-warm" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-text-strong text-white rounded-br-md"
                        : "bg-surface-panel border border-border-soft rounded-bl-md"
                    }`}
                  >
                    <p
                      className={`font-body text-[0.82rem] leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user" ? "" : "text-text-body"
                      }`}
                    >
                      {msg.content}
                    </p>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-accent-warm/10">
                  <Bot className="w-3.5 h-3.5 text-accent-warm" />
                </div>
                <div className="bg-surface-panel border border-border-soft rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-4 h-4 text-text-subtle animate-spin" />
                </div>
              </div>
            )}

            {(error || voiceError) && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-[75%]">
                <p className="font-body text-[0.78rem] text-red-700">{error || voiceError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="shrink-0 border-t border-border-soft bg-surface-panel px-5 py-4">
          <div className="max-w-[900px] mx-auto">
            {mode === "text" ? (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendMessage();
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message to test your agent…"
                    disabled={isLoading}
                    className="flex-1 bg-surface-subtle border border-border-soft rounded-xl px-4 py-2.5 font-body text-[0.82rem] text-text-body placeholder:text-text-subtle/50 focus:outline-none focus:ring-2 focus:ring-accent-warm/30 focus:border-accent-warm/40 disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    variant="hero"
                    size="default"
                    className="rounded-xl gap-1.5 px-5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </Button>
                </form>
                <p className="font-body text-[0.65rem] text-text-subtle/60 mt-2 text-center">
                  Text mode — tests the agent&apos;s prompt and behavior. Switch to Voice to test with your microphone.
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-4">
                  {voiceState === "idle" || voiceState === "error" ? (
                    <button
                      onClick={() => void startVoice()}
                      className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow-lg hover:shadow-xl"
                    >
                      <Mic className="w-6 h-6" />
                    </button>
                  ) : (
                    <button
                      onClick={stopVoice}
                      className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg hover:shadow-xl"
                    >
                      <MicOff className="w-6 h-6" />
                    </button>
                  )}
                </div>
                <VoiceStateIndicator state={voiceState} />
                <p className="font-body text-[0.65rem] text-text-subtle/60 text-center">
                  {voiceState === "idle"
                    ? "Click the microphone to start a voice conversation with your agent."
                    : voiceState === "listening"
                      ? "Speak naturally — your agent will respond when you pause."
                      : voiceState === "connecting"
                        ? "Setting up the voice pipeline…"
                        : voiceState === "processing"
                          ? "Your agent is thinking…"
                          : voiceState === "speaking"
                            ? "Your agent is responding…"
                            : "Something went wrong. Try again."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
