"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [demoError, setDemoError] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setDemoError(false);
    setFormMessage("");
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setFormMessage("Sign-in failed. Check your credentials and confirm the database and AUTH_SECRET are configured.");
      }
    } catch {
      setFormMessage("Sign-in is unavailable. Confirm database migrations and AUTH_SECRET configuration.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-foreground-muted mt-1">Sign in to your Nexora account</p>
          </div>

          {/* Demo notice */}
          {demoError && (
            <div className="mb-4 rounded-xl border border-info/30 bg-info/8 p-3 flex gap-2">
              <AlertCircle className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground-secondary">
                <strong>Demo Mode:</strong> Authentication is not configured. Sign up to be notified when it&apos;s live.
              </p>
            </div>
          )}

          {formMessage && <p role="alert" className="mb-4 rounded-xl border border-error/30 bg-error/5 p-3 text-xs text-error">{formMessage}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-foreground" htmlFor="login-password">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
