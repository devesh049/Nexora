import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type ServerEnv = z.infer<typeof envSchema>;

export function isAuthSecretConfigured(): boolean {
  const secret = process.env.AUTH_SECRET?.trim();
  return Boolean(secret && secret.length >= 32 && !/replace-with|change-me|your-secret|placeholder/i.test(secret));
}

export function isDatabaseUrlConfigured(): boolean {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  return Boolean(databaseUrl && !/change-me|your-|placeholder/i.test(databaseUrl));
}

export function getServerEnv(): ServerEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error("Invalid server configuration. Check DATABASE_URL, AUTH_SECRET (at least 32 characters), and NEXT_PUBLIC_APP_URL.");
  }
  return parsed.data;
}

export function requireDatabaseUrl(): string {
  const { DATABASE_URL } = getServerEnv();
  if (!DATABASE_URL || !isDatabaseUrlConfigured()) throw new Error("DATABASE_URL is not configured with a real database connection string.");
  return DATABASE_URL;
}

export function requireAuthSecret(): string {
  const { AUTH_SECRET } = getServerEnv();
  if (!AUTH_SECRET || !isAuthSecretConfigured()) throw new Error("AUTH_SECRET is not configured with a real secret.");
  return AUTH_SECRET;
}
