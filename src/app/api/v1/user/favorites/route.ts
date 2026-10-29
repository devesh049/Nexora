import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/server/db";
import { getCurrentUser } from "@/lib/server/session";


const favoriteSchema = z.object({
  applicationId: z.string().min(1).max(64).optional(),
  toolSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100).optional(),
}).strict().refine((value) => Number(Boolean(value.applicationId)) + Number(Boolean(value.toolSlug)) === 1);

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const result = await query(
      'SELECT f."id", f."createdAt", f."toolSlug", a."id" AS "applicationId", a."name", a."slug", a."description", a."category", a."icon", a."destination" FROM "Favorite" f LEFT JOIN "Application" a ON a."id" = f."applicationId" WHERE f."userId" = $1 ORDER BY f."createdAt" DESC LIMIT 100',
      [user.id],
    );
    return NextResponse.json({ data: result.rows });
  } catch {
    return NextResponse.json({ error: "Favorites are unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!(request.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) return NextResponse.json({ error: "Expected application/json." }, { status: 415 });
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1_024) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > 1_024) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const parsed = favoriteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Choose one published application or tool." }, { status: 400 });

  try {
    const id = randomUUID();
    let result;
    if (parsed.data.applicationId) {
      result = await query(
        'INSERT INTO "Favorite" ("id", "userId", "applicationId") SELECT $1, $2, "id" FROM "Application" WHERE "id" = $3 AND "status" = \'PUBLISHED\' AND "visibility" = \'PUBLIC\' ON CONFLICT ("userId", "applicationId") DO NOTHING RETURNING "id", "applicationId", "createdAt"',
        [id, user.id, parsed.data.applicationId],
      );
    } else {
      result = await query(
        'INSERT INTO "Favorite" ("id", "userId", "toolSlug") SELECT $1, $2, "slug" FROM "ToolCatalogItem" WHERE "slug" = $3 AND "status" = \'PUBLISHED\' ON CONFLICT ("userId", "toolSlug") DO NOTHING RETURNING "id", "toolSlug", "createdAt"',
        [id, user.id, parsed.data.toolSlug],
      );
    }
    if (!result.rows[0]) return NextResponse.json({ error: "Published resource not found or already favorited." }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Favorites are unavailable." }, { status: 503 });
  }
}
