import type { Metadata } from "next";
import { ComparePageClient } from "@/components/compare/compare-page-client";

export const metadata: Metadata = {
  title: "Compare Talent",
  description:
    "Side-by-side athlete analysis — ScoutScore, records, finish rates, and market value for up to 4 fighters.",
};

export default function ComparePage() {
  return <ComparePageClient />;
}
