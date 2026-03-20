type SettingStatus = "configured" | "missing";

export type WebHealthSummary = {
  ok: true;
  service: "yapsolutely-web";
  timestamp: string;
  runtimeMode: string;
  appUrl: string;
  voiceBaseUrl: string;
  checks: {
    authSecretConfigured: boolean;
    runtimeSharedSecretConfigured: boolean;
    databaseConfigured: boolean;
    voiceBaseUrlConfigured: boolean;
    voiceWebSocketUrlConfigured: boolean;
  };
};

export type SettingCheck = {
  key: string;
  label: string;
  status: SettingStatus;
  detail: string;
};

export type SettingSection = {
  title: string;
  description: string;
  checks: SettingCheck[];
};

export type SettingsReadiness = {
  readyForLiveValidation: boolean;
  configuredCount: number;
  totalCount: number;
  missingKeys: string[];
  sections: SettingSection[];
  runtimeMode: string;
  appUrl: string;
  voiceBaseUrl: string;
  voiceWebSocketUrl: string;
  runtimeHealth: {
    status: "reachable" | "unreachable" | "skipped";
    detail: string;
    activeStreams?: number;
    reportedPipelineMode?: string;
  };
  runtimeReadiness: {
    status: "reachable" | "unreachable" | "skipped";
    detail: string;
    readinessStatus?: string;
    configuredCount?: number;
    totalCount?: number;
    missingKeys?: string[];
    webHealthStatus?: string;
    webReadinessStatus?: string;
    webReadyForLiveValidation?: boolean;
  };
};

type ReadinessOptions = {
  includeRuntimeProbes?: boolean;
};

function hasRealValue(value: string | undefined) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();

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

export function getWebHealthSummary(): WebHealthSummary {
  const runtimeMode = process.env.VOICE_PIPELINE_MODE || "mock";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const voiceBaseUrl = process.env.VOICE_STREAM_BASE_URL || "localhost:3001";
  const voiceWebSocketUrl = process.env.VOICE_STREAM_WSS_URL || "ws://localhost:3001/twilio/stream";

  return {
    ok: true,
    service: "yapsolutely-web",
    timestamp: new Date().toISOString(),
    runtimeMode,
    appUrl,
    voiceBaseUrl,
    checks: {
      authSecretConfigured: hasRealValue(process.env.AUTH_SECRET),
      runtimeSharedSecretConfigured: hasRealValue(process.env.RUNTIME_SHARED_SECRET),
      databaseConfigured: hasRealValue(process.env.DATABASE_URL),
      voiceBaseUrlConfigured: hasRealValue(process.env.VOICE_STREAM_BASE_URL),
      voiceWebSocketUrlConfigured: hasRealValue(voiceWebSocketUrl),
    },
  };
}

function buildCheck(key: string, label: string, detail: string): SettingCheck {
  return {
    key,
    label,
    status: hasRealValue(process.env[key]) ? "configured" : "missing",
    detail,
  };
}

async function probeRuntimeHealth(voiceBaseUrl: string) {
  if (!hasRealValue(voiceBaseUrl)) {
    return {
      status: "skipped" as const,
      detail: "Voice runtime base URL is still a placeholder, so runtime health probing is skipped.",
    };
  }

  const normalizedBaseUrl = voiceBaseUrl.startsWith("http") ? voiceBaseUrl : `https://${voiceBaseUrl}`;
  const healthUrl = `${normalizedBaseUrl.replace(/\/$/, "")}/health`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(healthUrl, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        status: "unreachable" as const,
        detail: `Runtime health endpoint responded with status ${response.status}.`,
      };
    }

    return {
      status: "reachable" as const,
      detail: "Voice runtime health endpoint is reachable from the web app.",
      activeStreams: typeof data?.activeStreams === "number" ? data.activeStreams : undefined,
      reportedPipelineMode: typeof data?.pipelineMode === "string" ? data.pipelineMode : undefined,
    };
  } catch (error) {
    return {
      status: "unreachable" as const,
      detail:
        error instanceof Error && error.name === "AbortError"
          ? "Runtime health probe timed out."
          : "Runtime health endpoint could not be reached from the web app.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function probeRuntimeReadiness(voiceBaseUrl: string) {
  if (!hasRealValue(voiceBaseUrl)) {
    return {
      status: "skipped" as const,
      detail: "Voice runtime base URL is still a placeholder, so runtime readiness probing is skipped.",
    };
  }

  const runtimeSecret = process.env.RUNTIME_SHARED_SECRET;

  if (!hasRealValue(runtimeSecret)) {
    return {
      status: "skipped" as const,
      detail: "Runtime readiness probe needs RUNTIME_SHARED_SECRET before it can authenticate to the voice runtime.",
    };
  }

  const runtimeSecretHeader = runtimeSecret as string;

  const normalizedBaseUrl = voiceBaseUrl.startsWith("http") ? voiceBaseUrl : `https://${voiceBaseUrl}`;
  const readinessUrl = `${normalizedBaseUrl.replace(/\/$/, "")}/readiness`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  const headers: HeadersInit = {
    "x-yapsolutely-runtime-secret": runtimeSecretHeader,
  };

  try {
    const response = await fetch(readinessUrl, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        status: "unreachable" as const,
        detail: `Runtime readiness endpoint responded with status ${response.status}.`,
      };
    }

    return {
      status: "reachable" as const,
      detail: "Voice runtime readiness endpoint is reachable from the web app.",
      readinessStatus: typeof data?.status === "string" ? data.status : undefined,
      configuredCount: typeof data?.configuredCount === "number" ? data.configuredCount : undefined,
      totalCount: typeof data?.totalCount === "number" ? data.totalCount : undefined,
      missingKeys: Array.isArray(data?.missingKeys)
        ? data.missingKeys.filter((key: unknown): key is string => typeof key === "string")
        : undefined,
      webHealthStatus: typeof data?.webApp?.health?.status === "string" ? data.webApp.health.status : undefined,
      webReadinessStatus:
        typeof data?.webApp?.readiness?.status === "string" ? data.webApp.readiness.status : undefined,
      webReadyForLiveValidation:
        typeof data?.webApp?.readiness?.readyForLiveValidation === "boolean"
          ? data.webApp.readiness.readyForLiveValidation
          : undefined,
    };
  } catch (error) {
    return {
      status: "unreachable" as const,
      detail:
        error instanceof Error && error.name === "AbortError"
          ? "Runtime readiness probe timed out."
          : "Runtime readiness endpoint could not be reached from the web app.",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getSettingsReadiness(options: ReadinessOptions = {}): Promise<SettingsReadiness> {
  const includeRuntimeProbes = options.includeRuntimeProbes ?? true;
  const runtimeMode = process.env.VOICE_PIPELINE_MODE || "mock";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const voiceBaseUrl = process.env.VOICE_STREAM_BASE_URL || "localhost:3001";
  const voiceWebSocketUrl = process.env.VOICE_STREAM_WSS_URL || "ws://localhost:3001/twilio/stream";
  const runtimeHealth = includeRuntimeProbes
    ? await probeRuntimeHealth(voiceBaseUrl)
    : {
        status: "skipped" as const,
        detail: "Runtime health probing was skipped for an embedded cross-service readiness request.",
      };
  const runtimeReadiness = includeRuntimeProbes
    ? await probeRuntimeReadiness(voiceBaseUrl)
    : {
        status: "skipped" as const,
        detail: "Runtime readiness probing was skipped for an embedded cross-service readiness request.",
      };

  const sections: SettingSection[] = [
    {
      title: "Platform security",
      description: "Secrets the web app and voice runtime use to secure sessions and internal runtime calls.",
      checks: [
        buildCheck("AUTH_SECRET", "Auth secret", "Required for signed session/auth behavior."),
        buildCheck(
          "RUNTIME_SHARED_SECRET",
          "Runtime shared secret",
          "Required for secure runtime-to-web API access.",
        ),
      ],
    },
    {
      title: "Database",
      description: "Supabase/Postgres connection values needed for Prisma-backed production data.",
      checks: [
        buildCheck("DATABASE_URL", "Database URL", "Primary Postgres connection string."),
        buildCheck("DIRECT_URL", "Direct URL", "Direct connection string for Prisma operations."),
        buildCheck("SUPABASE_URL", "Supabase URL", "Project base URL for Supabase services."),
        buildCheck("SUPABASE_ANON_KEY", "Supabase anon key", "Public anon key for web-side integration."),
        buildCheck(
          "SUPABASE_SERVICE_ROLE_KEY",
          "Supabase service role key",
          "Privileged server-side key for backend operations.",
        ),
      ],
    },
    {
      title: "AI providers",
      description: "Required to move the voice runtime from mocked/testing behavior into live conversation mode.",
      checks: [
        buildCheck("ANTHROPIC_API_KEY", "Anthropic API key", "Required for live LLM response generation."),
        buildCheck("DEEPGRAM_API_KEY", "Deepgram API key", "Required for live STT/TTS processing."),
      ],
    },
    {
      title: "Telephony",
      description: "Twilio credentials and inbound numbers needed for real call handling.",
      checks: [
        buildCheck("TWILIO_ACCOUNT_SID", "Twilio account SID", "Required for webhook and call control operations."),
        buildCheck("TWILIO_AUTH_TOKEN", "Twilio auth token", "Required for Twilio API requests."),
        buildCheck("TWILIO_PHONE_NUMBER", "Twilio phone number", "Inbound number for live call testing."),
      ],
    },
    {
      title: "Deployment URLs",
      description: "Public URLs needed for production runtime/webhook wiring and live validation.",
      checks: [
        buildCheck("NEXT_PUBLIC_APP_URL", "Web app URL", "Public web/dashboard URL."),
        buildCheck("VOICE_STREAM_BASE_URL", "Voice runtime base URL", "Public voice runtime host."),
        buildCheck("VOICE_STREAM_WSS_URL", "Voice runtime websocket URL", "Public websocket URL for Twilio Media Streams."),
      ],
    },
  ];

  const allChecks = sections.flatMap((section) => section.checks);
  const configuredCount = allChecks.filter((check) => check.status === "configured").length;
  const missingKeys = allChecks.filter((check) => check.status === "missing").map((check) => check.key);
  const readyForLiveValidation =
    missingKeys.length === 0 && runtimeMode.toLowerCase() === "live" && hasRealValue(process.env.VOICE_STREAM_WSS_URL);

  return {
    readyForLiveValidation,
    configuredCount,
    totalCount: allChecks.length,
    missingKeys,
    sections,
    runtimeMode,
    appUrl,
    voiceBaseUrl,
    voiceWebSocketUrl,
    runtimeHealth,
    runtimeReadiness,
  };
}