"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { COMBATPEDIA_SPORTS, type CombatpediaSportFilter } from "@/lib/combatpedia/constants";

export function CombatpediaSportNav({ activeSport }: { activeSport?: CombatpediaSportFilter }) {
  const searchParams = useSearchParams();
  const current = activeSport ?? (searchParams.get("sport") as CombatpediaSportFilter) ?? "all";

  return (
    <nav
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      aria-label="Combat sport modes"
    >
      {COMBATPEDIA_SPORTS.map((sport) => {
        const href =
          sport.id === "all" ? "/combatpedia" : `/combatpedia?sport=${sport.id}`;
        const isActive = current === sport.id;

        return (
          <Link
            key={sport.id}
            href={href}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all border",
              isActive
                ? "bg-[#7b1113] text-white border-[#7b1113] shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-[#7b1113]/40"
            )}
          >
            {sport.label}
          </Link>
        );
      })}
    </nav>
  );
}
