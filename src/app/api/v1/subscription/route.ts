import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { query } from "@/lib/server/db";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const result = await query<{ plan: string; status: string; currentPeriodStart: Date | null; currentPeriodEnd: Date | null }>(
      'SELECT "plan", "status", "currentPeriodStart", "currentPeriodEnd" FROM "Subscription" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 1',
      [user.id],
    );
    return NextResponse.json({ data: result.rows[0] ?? null, billingEnabled: false });
  } catch {
    return NextResponse.json({ error: "Subscription information is unavailable." }, { status: 503 });
  }
}
