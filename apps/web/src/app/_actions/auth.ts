"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ensureWorkspaceUser, SESSION_COOKIE_NAME } from "@/lib/auth";

function normalizeEmail(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeName(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

async function setSessionCookie(email: string, name?: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify({ email, name }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function signInAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));

  if (!email) {
    redirect("/sign-in?error=missing-email");
  }

  await setSessionCookie(email);
  await ensureWorkspaceUser({ email });
  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const name = normalizeName(formData.get("name"));

  if (!email) {
    redirect("/sign-up?error=missing-email");
  }

  await setSessionCookie(email, name || undefined);
  await ensureWorkspaceUser({ email, name: name || undefined });
  redirect("/secure-account");
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/sign-in");
}