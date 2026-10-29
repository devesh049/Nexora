import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            // Default variant
            "bg-surface hover:bg-surface-hover text-foreground border border-border shadow-sm":
              variant === "default",
            // Primary variant - main CTA
            "bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-lg":
              variant === "primary",
            // Secondary variant
            "bg-accent hover:bg-accent-hover text-white shadow-md":
              variant === "secondary",
            // Outline variant
            "border-2 border-primary text-primary hover:bg-primary hover:text-white":
              variant === "outline",
            // Ghost variant
            "hover:bg-surface-hover text-foreground": variant === "ghost",
            // Link variant
            "text-primary underline-offset-4 hover:underline": variant === "link",
          },
          {
            "h-10 px-4 py-2 text-sm": size === "default",
            "h-9 px-3 text-sm": size === "sm",
            "h-12 px-6 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
