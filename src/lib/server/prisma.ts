import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { requireDatabaseUrl } from "@/lib/server/env";

const globalForPrisma = globalThis as typeof globalThis & { nexoraPrisma?: PrismaClient };

export function getPrismaClient() {
  if (!globalForPrisma.nexoraPrisma) {
    const adapter = new PrismaPg({ connectionString: requireDatabaseUrl() });
    globalForPrisma.nexoraPrisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.nexoraPrisma;
}
