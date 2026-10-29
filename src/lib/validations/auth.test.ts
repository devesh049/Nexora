import { describe, expect, it } from "vitest";
import { loginSchema, profileSchema, signupSchema } from "@/lib/validations/auth";

describe("signupSchema", () => {
  it("normalizes the email and trims the display name", () => {
    const result = signupSchema.parse({
      name: "  Nexora User  ",
      email: " USER@Example.COM ",
      password: "Nexora-safe!2030",
    });
    expect(result.name).toBe("Nexora User");
    expect(result.email).toBe("user@example.com");
  });

  it("rejects weak passwords and malformed emails", () => {
    expect(signupSchema.safeParse({ name: "User", email: "bad", password: "password" }).success).toBe(false);
    expect(signupSchema.safeParse({ name: "User", email: "user@example.com", password: "password" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("normalizes email without applying signup-only password rules", () => {
    expect(loginSchema.parse({ email: " USER@EXAMPLE.COM ", password: "Existing-secret" }).email).toBe("user@example.com");
  });
});

describe("profileSchema", () => {
  it("accepts preference edits and rejects privilege fields", () => {
    expect(profileSchema.safeParse({ name: "Nexora", theme: "dark" }).success).toBe(true);
    expect(profileSchema.safeParse({ role: "ADMIN" }).success).toBe(false);
    expect(profileSchema.safeParse({}).success).toBe(false);
  });
});
