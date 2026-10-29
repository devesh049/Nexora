import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { getCurrentUser } from "@/lib/server/session";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const result = await query<{ resource: string; quantity: number; records: number; lastUsedAt: Date | null }>(
      'SELECT "resource", SUM("quantity")::int AS "quantity", COUNT(*)::int AS "records", MAX("createdAt") AS "lastUsedAt" FROM "UsageRecord" WHERE "userId" = $1 AND "createdAt" >= NOW() - INTERVAL \'30 days\' GROUP BY "resource" ORDER BY "resource" LIMIT 100',
      [user.id],
    );
    return NextResponse.json({ data: result.rows, period: "30d" });
  } catch {
    return NextResponse.json({ error: "Usage information is unavailable." }, { status: 503 });
  }
}
