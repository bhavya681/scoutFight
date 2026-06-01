"use client";

import Link from "next/link";
import { GitCompare, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingPageHero } from "@/components/layout/marketing-page-hero";

export function ComparePageHero({
  slotsUsed,
  canCompare,
}: {
  slotsUsed: number;
  canCompare: boolean;
}) {
  return (
    <MarketingPageHero
      variant="solid"
      badge={
        <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
          <GitCompare className="h-3.5 w-3.5" />
          Side by side analysis
        </span>
      }
      title={
        <>
          Compare <span className="text-gradient">Talent</span>
        </>
      }
      description="Transfermarkt-style breakdowns. Evaluate up to 4 athletes across discipline, record, and ScoutScore to find the right fit for your roster."
      stats={[
        { value: String(slotsUsed), label: "In compare" },
        { value: "4", label: "Max slots" },
        { value: canCompare ? "Ready" : "Add more", label: "Status" },
      ]}
      actions={
        <div className="flex flex-col gap-2">
          <Button
            className="w-full h-11 font-semibold gap-2"
            disabled={!canCompare}
            onClick={() => canCompare && window.print()}
          >
            <FileText className="h-4 w-4" />
            Export report
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 border-border bg-background/80 text-white hover:bg-muted"
            asChild
          >
            <Link href="/discover">
              <Plus className="h-4 w-4" />
              Add athlete
            </Link>
          </Button>
        </div>
      }
    />
  );
}
