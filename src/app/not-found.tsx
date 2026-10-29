import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <div className="text-6xl font-bold text-foreground-muted">404</div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        Page Not Found
      </h1>
      <p className="mt-2 text-foreground-secondary max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/">
          <Button variant="primary">Go Home</Button>
        </Link>
        <Link href="/apps">
          <Button variant="outline">Browse Apps</Button>
        </Link>
      </div>
    </div>
  );
}
