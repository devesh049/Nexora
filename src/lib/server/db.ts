import "server-only";
import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { requireDatabaseUrl } from "@/lib/server/env";
import { getPrismaClient } from "@/lib/server/prisma";

const globalForDb = globalThis as typeof globalThis & { nexoraPool?: Pool };

export function getPool(): Pool {
  // Initialize the generated Prisma client with the PostgreSQL driver adapter.
  getPrismaClient();
  if (!globalForDb.nexoraPool) {
    globalForDb.nexoraPool = new Pool({
      connectionString: requireDatabaseUrl(),
      max: process.env.NODE_ENV === "production" ? 10 : 3,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      allowExitOnIdle: process.env.NODE_ENV !== "production",
    });
  }
  return globalForDb.nexoraPool;
}

export async function query<Row extends QueryResultRow = QueryResultRow>(
  text: string,
  values: readonly unknown[] = [],
) {
  return getPool().query<Row>(text, [...values]);
}

export async function withTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}
