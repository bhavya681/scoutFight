import type { TalentProfile } from "@/types";

const FEMALE_HINT =
  /\b(women'?s?|female|ladies|woman|womens)\b/i;

function profileText(
  t: Pick<TalentProfile, "bio" | "tags" | "currentOrganization" | "promotion">
): string {
  return [t.bio, ...(t.tags ?? []), t.currentOrganization, t.promotion]
    .filter(Boolean)
    .join(" ");
}

/** Match gender filter including bio hints when profile gender is unset. */
export function talentMatchesGender(
  t: Pick<TalentProfile, "gender" | "bio" | "tags" | "currentOrganization" | "promotion">,
  gender?: "male" | "female"
): boolean {
  if (!gender) return true;
  if (t.gender === gender) return true;
  if (t.gender && t.gender !== gender) return false;

  const hay = profileText(t);
  if (gender === "female") return FEMALE_HINT.test(hay);
  return !FEMALE_HINT.test(hay);
}
