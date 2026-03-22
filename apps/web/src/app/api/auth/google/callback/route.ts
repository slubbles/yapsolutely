import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ensureWorkspaceUser, SESSION_COOKIE_NAME } from "@/lib/auth";

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const origin = `${url.protocol}//${url.host}`;

  // User denied consent or other Google error
  if (error) {
    return NextResponse.redirect(`${origin}/sign-in?error=google-denied`);
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(`${origin}/sign-in?error=google-missing-params`);
  }

  // Validate CSRF state
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  let intent = "sign-in";
  try {
    const statePayload = JSON.parse(
      Buffer.from(stateParam, "base64url").toString("utf-8")
    );
    if (!storedState || statePayload.csrf !== storedState) {
      return NextResponse.redirect(`${origin}/sign-in?error=google-invalid-state`);
    }
    intent = statePayload.intent || "sign-in";
  } catch {
    return NextResponse.redirect(`${origin}/sign-in?error=google-invalid-state`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/sign-in?error=google-not-configured`);
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  // Exchange authorization code for tokens
  let tokens: GoogleTokenResponse;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${origin}/sign-in?error=google-token-exchange`);
    }

    tokens = await tokenRes.json();
  } catch {
    return NextResponse.redirect(`${origin}/sign-in?error=google-token-exchange`);
  }

  // Fetch user profile from Google
  let profile: GoogleUserInfo;
  try {
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    if (!profileRes.ok) {
      return NextResponse.redirect(`${origin}/sign-in?error=google-profile-fetch`);
    }

    profile = await profileRes.json();
  } catch {
    return NextResponse.redirect(`${origin}/sign-in?error=google-profile-fetch`);
  }

  if (!profile.email) {
    return NextResponse.redirect(`${origin}/sign-in?error=google-no-email`);
  }

  // Set session cookie using the existing auth system
  const email = profile.email.toLowerCase();
  const name = profile.name || profile.given_name || undefined;

  cookieStore.set(
    SESSION_COOKIE_NAME,
    JSON.stringify({ email, name }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }
  );

  // Ensure user exists in database
  await ensureWorkspaceUser({ email, name });

  // Redirect based on intent
  if (intent === "sign-up") {
    return NextResponse.redirect(`${origin}/agents?onboarding=true`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
