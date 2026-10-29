import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/session";
import { query, withTransaction } from "@/lib/server/db";
import { profileSchema } from "@/lib/validations/auth";


export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const result = await query<{
      id: string; name: string; email: string; emailVerified: Date | null;
      theme: string; preferences: Record<string, unknown>;
    }>(
      'SELECT u."id", u."name", u."email", u."emailVerified", p."theme", p."preferences" FROM "User" u JOIN "UserProfile" p ON p."userId" = u."id" WHERE u."id" = $1 AND u."status" = \'ACTIVE\' LIMIT 1',
      [user.id],
    );
    if (!result.rows[0]) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch {
    return NextResponse.json({ error: "Profile service is unavailable." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Expected application/json." }, { status: 415 });
  }
  let rawBody: string;
  try { rawBody = await request.text(); } catch { return NextResponse.json({ error: "Could not read request body." }, { status: 400 }); }
  if (new TextEncoder().encode(rawBody).byteLength > 2_048) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  let body: unknown;
  try { body = JSON.parse(rawBody); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid profile changes.", details: parsed.error.flatten().fieldErrors }, { status: 400 });

  try {
    const profile = await withTransaction(async (client) => {
      if (parsed.data.name !== undefined) {
        await client.query('UPDATE "User" SET "name" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = $2 AND "status" = \'ACTIVE\'', [parsed.data.name, user.id]);
      }
      if (parsed.data.theme !== undefined) {
        await client.query('UPDATE "UserProfile" SET "theme" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE "userId" = $2', [parsed.data.theme, user.id]);
      }
      await client.query(
        'INSERT INTO "AuditLog" ("id", "actorUserId", "action", "resourceType", "resourceId") VALUES ($1, $2, \'user.profile.updated\', \'User\', $2)',
        [randomUUID(), user.id],
      );
      const result = await client.query(
        'SELECT u."id", u."name", u."email", p."theme", p."preferences" FROM "User" u JOIN "UserProfile" p ON p."userId" = u."id" WHERE u."id" = $1',
        [user.id],
      );
      return result.rows[0];
    });
    if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    return NextResponse.json({ data: profile });
  } catch {
    return NextResponse.json({ error: "Profile update is unavailable." }, { status: 503 });
  }
}
