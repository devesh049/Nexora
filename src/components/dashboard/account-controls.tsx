"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { initialName: string; initialTheme: string };

export function AccountControls({ initialName, initialTheme }: Props) {
  const [name, setName] = useState(initialName);
  const [theme, setTheme] = useState(initialTheme);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const { setTheme: applyTheme } = useTheme();

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/v1/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, theme }),
      });
      const result = await response.json() as { error?: string; data?: { name: string; theme: string } };
      if (!response.ok || !result.data) {
        setMessage(result.error ?? "Unable to save profile changes.");
      } else {
        setName(result.data.name);
        setTheme(result.data.theme);
        applyTheme(result.data.theme);
        setMessage("Profile saved.");
      }
    } catch {
      setMessage("Profile service is unavailable. Try again later.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-semibold text-foreground">Profile preferences</h2>
      <form className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end" onSubmit={save}>
        <div>
          <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
          <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={80} required className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label htmlFor="profile-theme" className="mb-1.5 block text-sm font-medium text-foreground">Theme preference</label>
          <select id="profile-theme" value={theme} onChange={(event) => setTheme(event.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
          </select>
        </div>
        <Button type="submit" variant="primary" disabled={saving} className="gap-2"><Save className="h-4 w-4" />{saving ? "Saving…" : "Save"}</Button>
      </form>
      {message && <p role="status" className="mt-3 text-sm text-foreground-secondary">{message}</p>}
      <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })} className="mt-4 gap-2 text-error"><LogOut className="h-4 w-4" />Sign out</Button>
    </div>
  );
}
