import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/server/db";


const paramsSchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().max(60).optional(),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = paramsSchema.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    page: url.searchParams.get("page") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query parameters." }, { status: 400 });
  const { q, category, page, limit } = parsed.data;
  const params: unknown[] = [];
  const conditions = ['"status" = \'PUBLISHED\'', '"visibility" = \'PUBLIC\''];
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`("name" ILIKE $${params.length} OR "description" ILIKE $${params.length})`);
  }
  if (category) {
    params.push(category);
    conditions.push(`"category" = $${params.length}`);
  }
  const where = conditions.join(" AND ");
  try {
    const countResult = await query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM "Application" WHERE ${where}`, params);
    params.push(limit, (page - 1) * limit);
    const result = await query(
      `SELECT "id", "name", "slug", "description", "category", "icon", "image", "destination", "requiredPlan", "createdAt" FROM "Application" WHERE ${where} ORDER BY "name" ASC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    return NextResponse.json({ data: result.rows, pagination: { page, limit, total: Number(countResult.rows[0]?.count ?? 0) } });
  } catch {
    return NextResponse.json({ error: "Application catalog is unavailable. Configure and migrate PostgreSQL." }, { status: 503 });
  }
}
