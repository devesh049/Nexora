import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  withTransaction: vi.fn(),
  hash: vi.fn(),
}));

vi.mock("@/lib/server/rate-limit", () => ({ consumeRateLimit: mocks.consumeRateLimit }));
vi.mock("@/lib/server/db", () => ({ withTransaction: mocks.withTransaction }));
vi.mock("bcryptjs", () => ({ default: { hash: mocks.hash } }));

import { POST } from "@/app/api/auth/register/route";
import { isAuthSecretConfigured, isDatabaseUrlConfigured } from "@/lib/server/env";

const originalAuthSecret = process.env.AUTH_SECRET;
const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  vi.clearAllMocks();
  if (originalAuthSecret === undefined) delete process.env.AUTH_SECRET;
  else process.env.AUTH_SECRET = originalAuthSecret;
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;
});

describe("registration route", () => {
  it("does not treat example values as production configuration", () => {
    process.env.AUTH_SECRET = "replace-with-a-random-secret-at-least-32-characters";
    process.env.DATABASE_URL = "postgresql://nexora:change-me@localhost:5432/nexora";
    expect(isAuthSecretConfigured()).toBe(false);
    expect(isDatabaseUrlConfigured()).toBe(false);
  });

  it("rejects a placeholder secret from the environment", async () => {
    process.env.AUTH_SECRET = "replace-with-a-random-secret-at-least-32-characters";
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
    const response = await POST(new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("AUTH_SECRET");
    expect(mocks.consumeRateLimit).not.toHaveBeenCalled();
  });

  it("rejects malformed or oversized bodies before attempting database writes", async () => {
    process.env.AUTH_SECRET = "a".repeat(32);
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
    mocks.consumeRateLimit.mockResolvedValue(true);
    const response = await POST(new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "A", email: "invalid", password: "weak" }),
    }));
    expect(response.status).toBe(400);
    expect(mocks.withTransaction).not.toHaveBeenCalled();
  });

  it("returns rate limit response without attempting a write", async () => {
    process.env.AUTH_SECRET = "a".repeat(32);
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
    mocks.consumeRateLimit.mockResolvedValue(false);
    const response = await POST(new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }));
    expect(response.status).toBe(429);
    expect(mocks.withTransaction).not.toHaveBeenCalled();
  });

  it("creates a user and related records inside a single transaction", async () => {
    process.env.AUTH_SECRET = "a".repeat(32);
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
    mocks.consumeRateLimit.mockResolvedValue(true);
    mocks.hash.mockResolvedValue("bcrypt-hash");
    mocks.withTransaction.mockImplementation(async (callback: (client: unknown) => Promise<void>) => callback({
      query: vi.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
    }));
    const response = await POST(new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Test User", email: " USER@example.com ", password: "Strong!Password2030" }),
    }));
    expect(response.status).toBe(201);
    expect(mocks.withTransaction).toHaveBeenCalledTimes(1);
    expect(mocks.hash).toHaveBeenCalledWith("Strong!Password2030", 12);
  });

  it("reports a missing auth secret before touching the database", async () => {
    delete process.env.AUTH_SECRET;
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
    const response = await POST(new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("AUTH_SECRET");
    expect(mocks.withTransaction).not.toHaveBeenCalled();
  });

  it("reports a missing database URL without attempting rate limiting", async () => {
    process.env.AUTH_SECRET = "a".repeat(32);
    delete process.env.DATABASE_URL;
    const response = await POST(new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }));
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("DATABASE_URL");
    expect(mocks.consumeRateLimit).not.toHaveBeenCalled();
  });
});
