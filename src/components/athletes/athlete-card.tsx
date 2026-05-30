import { TalentCard } from "@/components/talent/talent-card";
import type { TalentProfile } from "@/types";

/** @deprecated Use TalentCard — maps athlete prop to talent */
export function AthleteCard({
  athlete,
  ...props
}: {
  athlete: TalentProfile;
  index?: number;
}) {
  return <TalentCard talent={athlete} {...props} />;
}
