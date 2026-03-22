import { NextResponse } from "next/server";
import { getWebHealthSummary } from "@/lib/settings-data";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = getWebHealthSummary();

  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    // DB unreachable
  }

  const status = dbOk ? 200 : 503;

  return NextResponse.json({ ...summary, database: dbOk ? "connected" : "unreachable" }, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}