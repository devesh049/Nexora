import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Activity, ArrowRight, Clock3, FileText, KeyRound, LayoutGrid, Star, Wrench, Zap } from "lucide-react";
import { getCurrentUser } from "@/lib/server/session";
import { query } from "@/lib/server/db";
import { AccountControls } from "@/components/dashboard/account-controls";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal Nexora workspace and account preferences.",
};

export const instant = false;

const quickActions = [
  { name: "Browse apps", href: "/apps", icon: LayoutGrid },
  { name: "Open tools", href: "/tools", icon: Wrench },
  { name: "API key status", href: "/api-keys", icon: KeyRound },
  { name: "Developer docs", href: "/docs", icon: FileText },
];

type ActivityRow = {
  id: string;
  type: string;
  toolSlug: string | null;
  createdAt: Date;
  applicationName: string | null;
  applicationSlug: string | null;
};

type FavoriteRow = {
  id: string;
  toolSlug: string | null;
  name: string | null;
  slug: string | null;
  createdAt: Date;
};

export default async function DashboardPage() {
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    const authConfigured = Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32);
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Nexora workspace</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground">Your dashboard</h1>
        <p className="mt-3 text-foreground-secondary">Sign in to view account-specific preferences, favorites, and activity.</p>
        {!authConfigured && <p className="mt-5 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-foreground-secondary">Authentication is not configured. Set AUTH_SECRET and DATABASE_URL, then apply the database migration.</p>}
        <Link href="/login" className="mt-6 inline-block"><Button variant="primary">Sign in</Button></Link>
      </div>
    );
  }

  let profile: { name: string; email: string; theme: string } | null = null;
  let activities: ActivityRow[] = [];
  let favorites: FavoriteRow[] = [];
  let dataAvailable = true;
  try {
    const [profileResult, activityResult, favoriteResult] = await Promise.all([
      query<{ name: string; email: string; theme: string }>(
        'SELECT u."name", u."email", p."theme" FROM "User" u JOIN "UserProfile" p ON p."userId" = u."id" WHERE u."id" = $1 AND u."status" = \'ACTIVE\' LIMIT 1',
        [user.id],
      ),
      query<ActivityRow>(
        'SELECT ua."id", ua."type", ua."toolSlug", ua."createdAt", a."name" AS "applicationName", a."slug" AS "applicationSlug" FROM "UserActivity" ua LEFT JOIN "Application" a ON a."id" = ua."applicationId" WHERE ua."userId" = $1 ORDER BY ua."createdAt" DESC LIMIT 8',
        [user.id],
      ),
      query<FavoriteRow>(
        'SELECT f."id", f."toolSlug", a."name", a."slug", f."createdAt" FROM "Favorite" f LEFT JOIN "Application" a ON a."id" = f."applicationId" WHERE f."userId" = $1 ORDER BY f."createdAt" DESC LIMIT 8',
        [user.id],
      ),
    ]);
    profile = profileResult.rows[0] ?? null;
    activities = activityResult.rows;
    favorites = favoriteResult.rows;
  } catch {
    dataAvailable = false;
  }

  if (!profile) {
    return <div className="mx-auto max-w-3xl px-4 py-16"><h1 className="text-3xl font-bold text-foreground">Dashboard unavailable</h1><p className="mt-3 text-foreground-secondary">Your account profile could not be loaded. Confirm the database migration has been applied.</p></div>;
  }

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!dataAvailable && <p role="alert" className="mb-6 rounded-xl border border-warning/30 bg-warning/5 p-4 text-sm text-foreground-secondary">Some workspace data is unavailable. Try again later.</p>}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Personal workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">Welcome, {profile.name}</h1>
          <p className="mt-1 text-foreground-secondary">{profile.email}</p>
        </div>

        <section aria-labelledby="quick-actions-title" className="mb-8">
          <h2 id="quick-actions-title" className="mb-4 flex items-center gap-2 font-semibold text-foreground"><Zap className="h-4 w-4 text-primary" />Quick actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickActions.map(({ name, href, icon: Icon }) => <Link key={href} href={href} className="group rounded-xl border border-border bg-surface p-4 text-center transition-colors hover:border-primary/30 hover:bg-surface-hover"><Icon className="mx-auto mb-2 h-6 w-6 text-primary transition-transform group-hover:scale-110" /><span className="text-sm font-medium text-foreground">{name}</span></Link>)}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-labelledby="activity-title" className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between"><h2 id="activity-title" className="flex items-center gap-2 font-semibold text-foreground"><Clock3 className="h-4 w-4 text-foreground-muted" />Recent activity</h2><Activity className="h-4 w-4 text-foreground-muted" /></div>
            {activities.length ? <ul className="space-y-3">{activities.map((item) => <li key={item.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0"><div><p className="text-sm font-medium text-foreground">{item.applicationName ?? item.toolSlug ?? item.type.replaceAll("_", " ").toLowerCase()}</p><p className="text-xs text-foreground-muted">{item.type.replaceAll("_", " ").toLowerCase()}</p></div><time className="text-xs text-foreground-muted">{item.createdAt.toLocaleDateString()}</time></li>)}</ul> : <p className="py-5 text-sm text-foreground-muted">No activity has been recorded yet.</p>}
          </section>

          <section aria-labelledby="favorites-title" className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between"><h2 id="favorites-title" className="flex items-center gap-2 font-semibold text-foreground"><Star className="h-4 w-4 text-foreground-muted" />Favorites</h2><Link href="/tools" className="flex items-center gap-1 text-xs text-primary hover:underline">Browse tools <ArrowRight className="h-3 w-3" /></Link></div>
            {favorites.length ? <ul className="space-y-2">{favorites.map((item) => <li key={item.id}><Link href={item.toolSlug ? `/tools/${item.toolSlug}` : item.slug ? `/apps/${item.slug}` : "/apps"} className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-hover"><Wrench className="h-4 w-4 text-accent" /><span className="text-sm text-foreground">{item.name ?? item.toolSlug}</span></Link></li>)}</ul> : <p className="py-5 text-sm text-foreground-muted">No favorites yet. Add them through the account API when a tool is published.</p>}
          </section>
        </div>

        <div className="mt-6"><AccountControls initialName={profile.name} initialTheme={profile.theme} /></div>
        <p className="mt-5 text-center text-xs text-foreground-muted">Usage analytics, subscriptions, and API services are not configured.</p>
      </div>
    </div>
  );
}
