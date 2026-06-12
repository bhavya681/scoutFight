"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComparePageHero } from "@/components/compare/compare-page-hero";
import { useCompareHydrated } from "@/lib/hooks/use-compare-hydrated";
import type { CompareItem } from "@/stores/compare-store";
import type { TalentProfile } from "@/types";
import { CompareAthleteCard } from "@/components/compare/compare-athlete-card";
import { CompareBreakdown } from "@/components/compare/compare-breakdown";
import { CompareCharts } from "@/components/compare/compare-charts";

function resolveCompareTalents(
  all: TalentProfile[],
  items: CompareItem[]
): TalentProfile[] {
  const order = new Map(items.map((i, idx) => [i.id, idx]));
  const slugOrder = new Map(items.map((i, idx) => [i.slug, idx]));

  const matched = all.filter((t) => order.has(t.id) || slugOrder.has(t.slug));
  return matched.sort((a, b) => {
    const ai = order.has(a.id)
      ? order.get(a.id)!
      : slugOrder.get(a.slug) ?? 99;
    const bi = order.has(b.id)
      ? order.get(b.id)!
      : slugOrder.get(b.slug) ?? 99;
    return ai - bi;
  });
}

export function ComparePageClient() {
  const { hydrated, items } = useCompareHydrated();
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      setTalents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/talent")
      .then((r) => r.json())
      .then((data) => {
        const all = (data.talent ?? []) as TalentProfile[];
        setTalents(resolveCompareTalents(all, items));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [items, hydrated]);

  const slotsUsed = talents.length > 0 ? talents.length : items.length;
  const canCompare = talents.length >= 2;

  return (
    <div className="page-shell pb-28">
      <ComparePageHero slotsUsed={slotsUsed} canCompare={canCompare} />
      <div className="page-container py-6 sm:py-8 md:py-10">
        {!hydrated && (
          <div className="rounded-xl border border-border bg-muted/50 p-12 text-center text-muted-foreground">
            Loading compare roster…
          </div>
        )}

        {hydrated && items.length === 0 && (
          <div className="rounded-xl border border-border bg-muted/50 p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Add athletes from Discover using the compare button on any profile card.
            </p>
            <Button asChild>
              <Link href="/discover">
                <Search className="h-4 w-4" />
                Discover athletes
              </Link>
            </Button>
          </div>
        )}

        {hydrated && items.length > 0 && loading && (
          <div className="rounded-xl border border-border bg-muted/50 p-12 text-center text-muted-foreground">
            Loading live profiles…
          </div>
        )}

        {hydrated && items.length > 0 && !loading && talents.length === 0 && (
          <div className="rounded-xl border border-border bg-muted/50 p-8 text-center text-muted-foreground text-sm space-y-4">
            <p>
              {items.length} athlete{items.length === 1 ? "" : "s"} in your compare list, but
              profiles could not be loaded. Try again or re-add from Discover.
            </p>
            <Button asChild>
              <Link href="/discover">Discover athletes</Link>
            </Button>
          </div>
        )}

        {hydrated && items.length > 0 && !loading && talents.length > 0 && (
          <>
            <div className="flex gap-4 overflow-x-auto pb-2 scroll-touch scrollbar-smooth">
              {talents.map((t) => (
                <CompareAthleteCard key={t.id} talent={t} />
              ))}
              {Array.from({ length: Math.max(0, 4 - talents.length) }).map((_, i) => (
                <div
                  key={`slot-${i}`}
                  className="flex flex-1 min-w-[200px] max-w-[280px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 aspect-[3/4]"
                >
                  <Link
                    href="/discover"
                    className="text-sm text-muted-foreground hover:text-pwr-red flex flex-col items-center gap-2 p-6 text-center"
                  >
                    <Plus className="h-8 w-8" />
                    Add athlete
                  </Link>
                </div>
              ))}
            </div>

            {canCompare ? (
              <>
                <CompareBreakdown talents={talents} />
                <CompareCharts talents={talents} />
              </>
            ) : (
              <div className="rounded-xl border border-border bg-muted/50 p-8 text-center mt-8 text-muted-foreground text-sm">
                Add at least one more athlete to see the full breakdown.
              </div>
            )}
          </>
        )}

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4">
          <div>
            <p className="text-sm font-medium text-white">
              {slotsUsed < 4 ? "Add one more athlete to compare" : "Compare roster is full"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              You can compare up to 4 athletes side by side.
            </p>
          </div>
          <Button className="gap-2 shrink-0" asChild>
            <Link href="/discover">
              <Search className="h-4 w-4" />
              Discover athletes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
