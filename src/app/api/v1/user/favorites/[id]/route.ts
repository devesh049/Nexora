import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { getCurrentUser } from "@/lib/server/session";

export async function DELETE(_request: Request, { params }: RouteContext<"/api/v1/user/favorites/[id]">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Favorite not found." }, { status: 404 });
  }
  try {
    const result = await query('DELETE FROM "Favorite" WHERE "id" = $1 AND "userId" = $2 RETURNING "id"', [id, user.id]);
    if (!result.rowCount) return NextResponse.json({ error: "Favorite not found." }, { status: 404 });
    return NextResponse.json({ data: { id, deleted: true } });
  } catch {
    return NextResponse.json({ error: "Favorites are unavailable." }, { status: 503 });
  }
}
