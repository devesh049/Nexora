import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export async function GET(_request: Request, { params }: RouteContext<"/api/v1/apps/[slug]">) {
  const { slug } = await params;
  if (slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
  try {
    const result = await query(
      'SELECT "id", "name", "slug", "description", "category", "icon", "image", "destination", "requiredPlan", "createdAt" FROM "Application" WHERE "slug" = $1 AND "status" = \'PUBLISHED\' AND "visibility" = \'PUBLIC\' LIMIT 1',
      [slug],
    );
    if (!result.rows[0]) return NextResponse.json({ error: "Application not found." }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch {
    return NextResponse.json({ error: "Application catalog is unavailable." }, { status: 503 });
  }
}
