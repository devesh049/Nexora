import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { withTransaction } from "@/lib/server/db";
import { signupSchema } from "@/lib/validations/auth";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { isAuthSecretConfigured, isDatabaseUrlConfigured } from "@/lib/server/env";


export async function POST(request: Request) {
  if (!isAuthSecretConfigured()) {
    return NextResponse.json({ error: "Sign-up is missing AUTH_SECRET. Add a random secret of at least 32 characters to .env.local, then restart the Next.js server." }, { status: 503 });
  }
  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Sign-up is missing DATABASE_URL. Configure a reachable PostgreSQL database in .env.local, apply migrations, then restart the Next.js server." }, { status: 503 });
  }
  try {
    const clientAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!(await consumeRateLimit("register", clientAddress, 5, 3600))) {
      return NextResponse.json({ error: "Too many registration attempts. Try again later." }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: "PostgreSQL is unavailable or its migrations are missing. Check DATABASE_URL, run npm run db:migrate:dev, and restart Nexora." }, { status: 503 });
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ error: "Expected application/json." }, { status: 415 });
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 8_192) return NextResponse.json({ error: "Request body is too large." }, { status: 413 });

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Could not read request body." }, { status: 400 });
  }
  if (new TextEncoder().encode(rawBody).byteLength > 8_192) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }
  let body: unknown;
  try { body = JSON.parse(rawBody); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please correct the registration details.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const userId = randomUUID();
    const profileId = randomUUID();
    const subscriptionId = randomUUID();
    await withTransaction(async (client) => {
      await client.query(
        'INSERT INTO "User" ("id", "name", "email", "passwordHash", "updatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
        [userId, parsed.data.name, parsed.data.email, passwordHash],
      );
      await client.query('INSERT INTO "UserProfile" ("id", "userId", "updatedAt") VALUES ($1, $2, CURRENT_TIMESTAMP)', [profileId, userId]);
      await client.query(
        'INSERT INTO "Subscription" ("id", "userId", "plan", "status", "updatedAt") VALUES ($1, $2, \'FREE\', \'INACTIVE\', CURRENT_TIMESTAMP)',
        [subscriptionId, userId],
      );
      await client.query(
        'INSERT INTO "AuditLog" ("id", "actorUserId", "action", "resourceType", "resourceId") VALUES ($1, $2, \'user.registered\', \'User\', $2)',
        [randomUUID(), userId],
      );
    });
    return NextResponse.json({ data: { id: userId, name: parsed.data.name, email: parsed.data.email }, message: "Account created. Sign in to continue." }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    if (error instanceof Error && (error.message.includes("DATABASE_URL") || error.message.includes("configuration"))) {
      return NextResponse.json({ error: "PostgreSQL is not configured. Set DATABASE_URL and run database migrations." }, { status: 503 });
    }
    return NextResponse.json({ error: "Account creation is temporarily unavailable." }, { status: 503 });
  }
}
