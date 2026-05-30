"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/stores/favorites-store";

export function FavoriteButton({ athleteId }: { athleteId: string }) {
  const { toggleAthlete, isAthleteFavorite } = useFavoritesStore();
  const favorited = isAthleteFavorite(athleteId);

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={() => toggleAthlete(athleteId)}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`h-4 w-4 ${favorited ? "fill-pwr-red text-pwr-red" : ""}`} />
    </Button>
  );
}
