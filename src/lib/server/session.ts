import "server-only";
import { auth } from "../../../auth";
import { isAuthSecretConfigured } from "@/lib/server/env";

export async function getCurrentUser() {
  if (!isAuthSecretConfigured()) return null;
  const session = await auth();
  return session?.user ?? null;
}
