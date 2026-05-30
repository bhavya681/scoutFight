"use client";

import { GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/stores/compare-store";
import type { TalentProfile } from "@/types";

export function CompareToggle({ talent }: { talent: TalentProfile }) {
  const { add, remove, has, items } = useCompareStore();
  const inCompare = has(talent.id);

  return (
    <Button
      variant="secondary"
      size="icon"
      disabled={!inCompare && items.length >= 4}
      onClick={() =>
        inCompare
          ? remove(talent.id)
          : add({
              id: talent.id,
              slug: talent.slug,
              displayName: talent.displayName,
              avatarUrl: talent.avatarUrl,
              type: "athlete",
              sport: talent.sport,
            })
      }
      aria-label="Add to compare"
    >
      <GitCompare className={`h-4 w-4 ${inCompare ? "text-pwr-red" : ""}`} />
    </Button>
  );
}
