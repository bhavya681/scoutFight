import type { Organization } from "@/types";

export function organizationSourceLabel(org: Pick<Organization, "dataSource">): string {
  switch (org.dataSource) {
    case "the_sports_db":
      return "TheSportsDB";
    case "merged":
      return "Wikipedia + TheSportsDB";
    default:
      return "Wikipedia";
  }
}
