"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(12, "Password must be at least 12 characters")
    .regex(/[a-z]/, "Include a lowercase letter")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/[0-9]/, "Include a number")
    .regex(/[^A-Za-z0-9]/, "Include a symbol"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [demoNotice, setDemoNotice] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [created, setCreated] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setFormMessage("");
    setDemoNotice(false);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) {
        setFormMessage(result.error ?? "Account creation failed. Please try again.");
        return;
      }
      setCreated(true);
      setFormMessage(result.message ?? "Account created. Sign in to continue.");
    } catch {
      setFormMessage("Could not reach Nexora. Check your connection and server configuration.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
            <p className="text-sm text-foreground-muted mt-1">Join Nexora — it&apos;s free to start</p>
          </div>

          {demoNotice && (
            <div className="mb-4 rounded-xl border border-info/30 bg-info/8 p-3 flex gap-2">
              <AlertCircle className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
              <p className="text-xs text-foreground-secondary">
                <strong>Demo Mode:</strong> Authentication backend is not yet configured. Account creation coming soon!
              </p>
            </div>
          )}

          {formMessage && <div role={created ? "status" : "alert"} className={`mb-4 rounded-xl border p-3 text-sm ${created ? "border-success/30 bg-success/5 text-foreground-secondary" : "border-error/30 bg-error/5 text-error"}`}>{formMessage}{created && <span> <Link href="/login" className="font-medium text-primary underline">Sign in</Link></span>}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="signup-name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <input id="signup-name" type="text" placeholder="Your name" {...register("name")}
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="signup-email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <input id="signup-email" type="email" placeholder="you@example.com" {...register("email")}
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <input id="signup-password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="12+ chars with mixed character types" {...register("password")}
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5" htmlFor="signup-confirm">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <input id="signup-confirm" type={showPassword ? "text" : "password"} placeholder="Repeat password" {...register("confirmPassword")}
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-error">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" variant="primary" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-4 text-xs text-foreground-muted text-center">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>

          <p className="mt-4 text-center text-sm text-foreground-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
