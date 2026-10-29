import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";
import { query } from "@/lib/server/db";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { isAuthSecretConfigured } from "@/lib/server/env";

declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN";
  }
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: isAuthSecretConfigured() ? process.env.AUTH_SECRET : "development-only-please-configure-a-real-auth-secret",
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const ip = (await import("next/headers")).headers;
          const requestHeaders = await ip();
          const address = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
          if (!(await consumeRateLimit("login", `${parsed.data.email}:${address}`, 10, 900))) return null;
          const result = await query<{
            id: string;
            name: string;
            email: string;
            passwordHash: string;
            role: "USER" | "ADMIN";
            status: "ACTIVE" | "SUSPENDED" | "DELETED";
          }>(
            'SELECT "id", "name", "email", "passwordHash", "role", "status" FROM "User" WHERE "email" = $1 LIMIT 1',
            [parsed.data.email],
          );
          const user = result.rows[0];
          if (!user || user.status !== "ACTIVE") return null;
          if (!(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token as typeof token & { role?: "USER" | "ADMIN" }).role ?? "USER";
      }
      return session;
    },
  },
});
