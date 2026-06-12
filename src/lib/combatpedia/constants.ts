import type { SportType } from "@/types";

export type CombatpediaSportFilter = SportType | "all";

export const COMBATPEDIA_SPORTS: {
  id: CombatpediaSportFilter;
  label: string;
  description: string;
}[] = [
  { id: "all", label: "All Combat", description: "Wrestlers, MMA, boxing & more" },
  { id: "wrestling", label: "Wrestling", description: "WWE, AEW, indie & legacy stars" },
  { id: "mma", label: "MMA", description: "UFC, Bellator & global fighters" },
  { id: "boxing", label: "Boxing", description: "Champions & hall of famers" },
  { id: "kickboxing", label: "Kickboxing", description: "Striking specialists" },
  { id: "muay_thai", label: "Muay Thai", description: "Thai boxing athletes" },
  { id: "grappling", label: "Grappling", description: "Submission wrestling" },
  { id: "bjj", label: "BJJ", description: "Brazilian jiu-jitsu" },
];

export const COMBATPEDIA_FEATURED_SLUGS = [
  { slug: "john-cena", sport: "wrestling" as const, label: "John Cena" },
  { slug: "brock-lesnar", sport: "wrestling" as const, label: "Brock Lesnar" },
  { slug: "alexandre-pantoja", sport: "mma" as const, label: "Alexandre Pantoja" },
  { slug: "conor-mcgregor", sport: "mma" as const, label: "Conor McGregor" },
  { slug: "mike-tyson", sport: "boxing" as const, label: "Mike Tyson" },
];
