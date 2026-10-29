import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { getCurrentUser } from "@/lib/server/session";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const [profile, activity, favorites, subscription, usage] = await Promise.all([
      query('SELECT u."id", u."name", u."email", p."theme", p."preferences" FROM "User" u JOIN "UserProfile" p ON p."userId" = u."id" WHERE u."id" = $1 AND u."status" = \'ACTIVE\' LIMIT 1', [user.id]),
      query('SELECT "id", "type", "toolSlug", "applicationId", "createdAt" FROM "UserActivity" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 10', [user.id]),
      query('SELECT "id", "applicationId", "toolSlug", "createdAt" FROM "Favorite" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 20', [user.id]),
      query('SELECT "plan", "status", "currentPeriodStart", "currentPeriodEnd" FROM "Subscription" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 1', [user.id]),
      query('SELECT COALESCE(SUM("quantity"), 0)::int AS "quantity", COUNT(*)::int AS "records" FROM "UsageRecord" WHERE "userId" = $1 AND "createdAt" >= NOW() - INTERVAL \'30 days\'', [user.id]),
    ]);
    if (!profile.rows[0]) return NextResponse.json({ error: "Dashboard not found." }, { status: 404 });
    return NextResponse.json({ data: {
      profile: profile.rows[0],
      activity: activity.rows,
      favorites: favorites.rows,
      subscription: subscription.rows[0] ?? null,
      usage: usage.rows[0],
      billingEnabled: false,
    } });
  } catch {
    return NextResponse.json({ error: "Dashboard is unavailable." }, { status: 503 });
  }
}
