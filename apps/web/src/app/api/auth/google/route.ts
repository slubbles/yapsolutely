import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Google OAuth is not configured" },
      { status: 503 }
    );
  }

  // Determine the callback URL from the request origin
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // Check if this is a sign-up flow (pass intent through state)
  const intent = url.searchParams.get("intent") || "sign-in";

  // Generate CSRF state token
  const state = crypto.randomBytes(32).toString("hex");
  const statePayload = JSON.stringify({ csrf: state, intent });
  const encodedState = Buffer.from(statePayload).toString("base64url");

  // Store CSRF token in a short-lived httpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: encodedState,
    access_type: "online",
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
