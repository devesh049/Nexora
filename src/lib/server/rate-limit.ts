import "server-only";
import { createHash, randomInt } from "node:crypto";
import { query } from "@/lib/server/db";

export async function consumeRateLimit(bucket: string, subject: string, limit: number, windowSeconds: number) {
  if (randomInt(100) === 0) {
    await query(
      'DELETE FROM "RateLimitBucket" WHERE "key" IN (SELECT "key" FROM "RateLimitBucket" WHERE "expiresAt" < NOW() ORDER BY "expiresAt" ASC LIMIT 500)',
    );
  }
  const key = createHash("sha256").update(`${bucket}:${subject}`).digest("hex");
  const result = await query<{ count: number }>(
    `INSERT INTO "RateLimitBucket" ("key", "count", "expiresAt", "updatedAt")
     VALUES ($1, 1, NOW() + ($2 * INTERVAL '1 second'), NOW())
     ON CONFLICT ("key") DO UPDATE SET
       "count" = CASE WHEN "RateLimitBucket"."expiresAt" <= NOW() THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
       "expiresAt" = CASE WHEN "RateLimitBucket"."expiresAt" <= NOW() THEN NOW() + ($2 * INTERVAL '1 second') ELSE "RateLimitBucket"."expiresAt" END,
       "updatedAt" = NOW()
     RETURNING "count"`,
    [key, windowSeconds],
  );
  return result.rows[0].count <= limit;
}
