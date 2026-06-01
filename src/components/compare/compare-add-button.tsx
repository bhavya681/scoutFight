"use client";

import { GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareStore, type CompareItem } from "@/stores/compare-store";
import { cn } from "@/lib/utils";

type CompareAddButtonProps = {
  item: CompareItem;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "icon";
  className?: string;
  showLabel?: boolean;
};

export function CompareAddButton({
  item,
  variant = "outline",
  size = "icon",
  className,
  showLabel = false,
}: CompareAddButtonProps) {
  const { add, remove, has, items } = useCompareStore();
  const inCompare = has(item.id);
  const full = items.length >= 4 && !inCompare;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={full}
      className={cn(
        size === "icon" && "h-9 w-9 shrink-0",
        inCompare && "border-pwr-red/50 text-pwr-red bg-pwr-red/10",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCompare) remove(item.id);
        else add(item);
      }}
      aria-label={inCompare ? "Remove from compare" : "Add to compare"}
      aria-pressed={inCompare}
    >
      <GitCompare className={cn("h-4 w-4", inCompare && "text-pwr-red")} />
      {showLabel && (
        <span className="ml-1.5 text-xs font-semibold uppercase tracking-wide">
          {inCompare ? "In compare" : "Compare"}
        </span>
      )}
    </Button>
  );
}

export function compareItemFromTalent(talent: {
  id: string;
  slug: string;
  displayName: string;
  avatarUrl: string;
  sport: string;
}): CompareItem {
  return {
    id: talent.id,
    slug: talent.slug,
    displayName: talent.displayName,
    avatarUrl: talent.avatarUrl,
    type: "athlete",
    sport: talent.sport,
  };
}
