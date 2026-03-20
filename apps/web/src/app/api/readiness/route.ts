import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { getSettingsReadiness } from "@/lib/settings-data";

export const dynamic = "force-dynamic";

function hasAuthorizedSession(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return false;
  }

  try {
    const session = JSON.parse(sessionCookie) as { email?: string };
    return Boolean(session.email);
  } catch {
    return false;
  }
}

function hasAuthorizedRuntimeSecret(request: NextRequest) {
  const runtimeSecret = process.env.RUNTIME_SHARED_SECRET;
  const providedSecret = request.headers.get("x-yapsolutely-runtime-secret");

  return Boolean(runtimeSecret && providedSecret && providedSecret === runtimeSecret);
}

function shouldSkipRuntimeProbes(request: NextRequest) {
  return request.headers.get("x-yapsolutely-readiness-mode") === "embedded";
}

export async function GET(request: NextRequest) {
  if (!hasAuthorizedSession(request) && !hasAuthorizedRuntimeSecret(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        detail: "Sign in to the dashboard or provide x-yapsolutely-runtime-secret to inspect readiness.",
      },
      { status: 401 },
    );
  }

  const readiness = await getSettingsReadiness({
    includeRuntimeProbes: !shouldSkipRuntimeProbes(request),
  });

  return NextResponse.json(
    {
      status: "ok",
      service: "yapsolutely-web-readiness",
      checkedAt: new Date().toISOString(),
      readiness,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}