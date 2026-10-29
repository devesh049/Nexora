import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Password recovery",
  description: "Password recovery is not available in the Nexora demo.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Mail className="h-6 w-6 text-primary" /></div>
        <h1 className="text-2xl font-bold text-foreground">Password recovery</h1>
        <p className="mt-3 text-sm text-foreground-secondary">Email-based recovery is unavailable because Nexora demo authentication has not been configured. No email address was submitted or stored.</p>
        <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
      </div>
    </div>
  );
}
