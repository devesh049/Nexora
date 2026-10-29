import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "default";
}

export function Badge({ className, variant = "default", size = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-0.5 text-xs",
        {
          "bg-surface-hover text-foreground-secondary border border-border": variant === "default",
          "bg-primary/10 text-primary border border-primary/20": variant === "primary",
          "bg-accent/10 text-accent border border-accent/20": variant === "secondary",
          "bg-success/10 text-success border border-success/20": variant === "success",
          "bg-warning/10 text-warning border border-warning/20": variant === "warning",
          "bg-error/10 text-error border border-error/20": variant === "error",
          "border border-border text-foreground-secondary bg-transparent": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
