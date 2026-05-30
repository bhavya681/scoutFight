import { unstable_cache } from "next/cache";
import type { Professional, ProfessionalRole, SportType } from "@/types";
import { MVP_CACHE_REVALIDATE } from "@/lib/mvp/config";
import {
  getProfessionalDiscoveryIndex,
  findProfessionalDiscoveryEntry,
  buildProfessionalFromEntry,
} from "./professional-discovery";
import { fetchWikipediaSearchTitle } from "@/lib/integrations/wikipedia-discovery";
import { slugify } from "@/lib/utils";

const getCachedAllProfessionals = unstable_cache(
  async () => {
    const entries = await getProfessionalDiscoveryIndex();
    return Promise.all(entries.map((e, i) => buildProfessionalFromEntry(e, i)));
  },
  ["scoutfight-all-professionals-v1"],
  { revalidate: MVP_CACHE_REVALIDATE, tags: ["professionals"] }
);

export async function getAllProfessionals(): Promise<Professional[]> {
  return getCachedAllProfessionals();
}

export async function getProfessionalBySlug(slug: string): Promise<Professional | null> {
  const cached = await findProfessionalDiscoveryEntry(slug);
  if (cached) {
    const entries = await getProfessionalDiscoveryIndex();
    const index = entries.findIndex((e) => e.slug === slug);
    return buildProfessionalFromEntry(cached, index >= 0 ? index : 0);
  }

  const name = slug.replace(/-/g, " ");
  const wikiTitle = await fetchWikipediaSearchTitle(name);
  if (!wikiTitle) return null;

  return buildProfessionalFromEntry(
    {
      slug,
      displayName: name,
      role: "commentator",
      sports: ["mma"],
      wikipediaTitle: wikiTitle,
      source: "wikipedia",
    },
    0
  );
}

export async function searchProfessionals(filters: {
  query?: string;
  role?: ProfessionalRole;
  sport?: SportType;
}): Promise<Professional[]> {
  let list = await getAllProfessionals();
  if (filters.role) list = list.filter((p) => p.role === filters.role);
  if (filters.sport) list = list.filter((p) => p.sports.includes(filters.sport!));
  if (filters.query) {
    const q = filters.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    );
  }
  return list;
}

export async function getAllProfessionalSlugs(): Promise<{ slug: string }[]> {
  const entries = await getProfessionalDiscoveryIndex();
  return entries.map((e) => ({ slug: e.slug }));
}
