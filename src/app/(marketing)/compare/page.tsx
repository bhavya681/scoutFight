import type { Metadata } from "next";
import { GitCompare } from "lucide-react";
import { TalentComparison } from "@/components/compare/talent-comparison";

export const metadata: Metadata = {
  title: "Compare Talent",
  description:
    "Side-by-side talent comparison across combat sports — records, market value, availability, and more.",
};

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-32">
      <div className="flex items-center gap-3 mb-2">
        <GitCompare className="h-8 w-8 text-pwr-red" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide">
          Compare Talent
        </h1>
      </div>
      <p className="text-muted-foreground mb-10 max-w-2xl">
        Transfermarkt-style side-by-side analysis. Add up to 4 athletes from any discipline
        and evaluate fit for your card, tour, or roster.
      </p>
      <TalentComparison />
    </div>
  );
}
