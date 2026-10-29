import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      {/* Geometric N-inspired logo mark */}
      <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-accent to-highlight p-1">
        <div className="h-full w-full rounded-md bg-background flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 20V4L18 20V4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />
          </svg>
        </div>
      </div>
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-highlight bg-clip-text text-transparent">
          Nexora
        </span>
      )}
    </Link>
  );
}
