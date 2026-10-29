"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

type FavoriteButtonProps = {
  toolSlug: string;
  favoriteId: string | null;
  onFavoriteChange: (toolSlug: string, favoriteId: string | null) => void;
};

export function FavoriteButton({ toolSlug, favoriteId, onFavoriteChange }: FavoriteButtonProps) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    setMessage("");
    try {
      if (favoriteId) {
        const response = await fetch(`/api/v1/user/favorites/${encodeURIComponent(favoriteId)}`, { method: "DELETE" });
        if (!response.ok) throw new Error(response.status === 401 ? "Sign in to save favorites." : "Could not remove favorite.");
        onFavoriteChange(toolSlug, null);
      } else {
        const response = await fetch("/api/v1/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolSlug }),
        });
        const result = await response.json() as { data?: { id: string }; error?: string };
        if (!response.ok || !result.data) throw new Error(response.status === 401 ? "Sign in to save favorites." : result.error ?? "Could not save favorite.");
        onFavoriteChange(toolSlug, result.data.id);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update favorite.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={toggle} aria-pressed={Boolean(favoriteId)} aria-label={favoriteId ? "Remove from favorites" : "Add to favorites"}>
        <Star className={`h-4 w-4 ${favoriteId ? "fill-warning text-warning" : "text-foreground-muted"}`} />
        {favoriteId ? "Saved" : "Favorite"}
      </Button>
      {message && <span role="status" className="text-right text-xs text-foreground-muted">{message}</span>}
    </div>
  );
}
