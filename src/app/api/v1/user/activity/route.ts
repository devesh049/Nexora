import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { getCurrentUser } from "@/lib/server/session";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const result = await query(
      'SELECT ua."id", ua."type", ua."toolSlug", ua."createdAt", a."name" AS "applicationName", a."slug" AS "applicationSlug" FROM "UserActivity" ua LEFT JOIN "Application" a ON a."id" = ua."applicationId" WHERE ua."userId" = $1 ORDER BY ua."createdAt" DESC LIMIT 50',
      [user.id],
    );
    return NextResponse.json({ data: result.rows });
  } catch {
    return NextResponse.json({ error: "Activity is unavailable." }, { status: 503 });
  }
}
