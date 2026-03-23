import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE_NAME = "yapsolutely_session";

export type SessionUser = {
  email: string;
  name?: string;
  plan?: string;
};

export async function ensureWorkspaceUser(session: SessionUser) {
  try {
    return await prisma.user.upsert({
      where: {
        email: session.email,
      },
      update: {
        name: session.name,
      },
      create: {
        email: session.email,
        name: session.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const base = JSON.parse(sessionCookie) as SessionUser;
    // Enrich with plan from DB if available
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: base.email },
        select: { plan: true },
      });
      if (dbUser?.plan) base.plan = dbUser.plan;
    } catch {
      // DB not available, use cookie data only
    }
    return base;
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  await ensureWorkspaceUser(session);

  return session;
}