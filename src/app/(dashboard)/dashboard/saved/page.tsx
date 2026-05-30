"use client";

import { useEffect, useState } from "react";
import { TalentCard } from "@/components/talent/talent-card";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { TalentProfile } from "@/types";

export default function SavedTalentPage() {
  const athleteIds = useFavoritesStore((s) => s.athleteIds);
  const [talent, setTalent] = useState<TalentProfile[]>([]);

  useEffect(() => {
    fetch("/api/talent")
      .then((r) => r.json())
      .then((d) => {
        const all = (d.talent ?? []) as TalentProfile[];
        setTalent(all.filter((t) => athleteIds.includes(t.id)));
      });
  }, [athleteIds]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Saved athletes</h1>
      {talent.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Save athletes from Discover using the heart icon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {talent.map((t, i) => (
            <TalentCard key={t.id} talent={t} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
