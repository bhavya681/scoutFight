"use client";

import type { TalentProfile } from "@/types";
import { CompareAddButton, compareItemFromTalent } from "@/components/compare/compare-add-button";

export function CompareToggle({ talent }: { talent: TalentProfile }) {
  return (
    <CompareAddButton
      item={compareItemFromTalent(talent)}
      variant="secondary"
      size="icon"
    />
  );
}
