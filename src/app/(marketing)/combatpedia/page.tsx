import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CombatpediaShell } from "@/components/combatpedia/combatpedia-shell";
import { CombatpediaSportNav } from "@/components/combatpedia/combatpedia-sport-nav";
import { CombatpediaSearch } from "@/components/combatpedia/combatpedia-search";
import { CombatpediaEntryCard } from "@/components/combatpedia/combatpedia-entry-card";
import { listCombatpediaEntries } from "@/lib/combatpedia/service";
import {
  COMBATPEDIA_FEATURED_SLUGS,
  type CombatpediaSportFilter,
} from "@/lib/combatpedia/constants";

export const metadata: Metadata = {
  title: "Combatpedia",
  description:
    "Modern sports encyclopedia — wrestling, MMA, boxing, cricket and more, powered by Wikipedia.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ sport?: string; q?: string }>;
}

function SportNavFallback() {
  return <div className="h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />;
}

export default async function CombatpediaPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const sport = (sp.sport as CombatpediaSportFilter) || "all";
  const query = sp.q;
  const entries = await listCombatpediaEntries(sport, query);

  return (
    <CombatpediaShell>
      <div className="page-container py-6 sm:py-10">
        <header className="mb-8 max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white">
            Combatpedia Mode
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed">
            Switch between wrestling, MMA, boxing, cricket, and other disciplines. Each profile opens
            a modern wiki-style article with infobox, sections, and an image gallery — inspired by
            professional fan wikis, powered by Wikipedia.
          </p>
        </header>

        <Suspense fallback={<SportNavFallback />}>
          <CombatpediaSportNav activeSport={sport} />
        </Suspense>

        <div className="mt-6 mb-8">
          <Suspense>
            <CombatpediaSearch />
          </Suspense>
        </div>

        <section className="mb-10" aria-labelledby="featured-combatpedia">
          <h2
            id="featured-combatpedia"
            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3"
          >
            Featured articles
          </h2>
          <div className="flex flex-wrap gap-2">
            {COMBATPEDIA_FEATURED_SLUGS.map((f) => (
              <Link
                key={f.slug}
                href={`/combatpedia/${f.slug}`}
                className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium hover:border-[#7b1113]/40 transition-colors"
              >
                {f.label}
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="combatpedia-grid">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2
              id="combatpedia-grid"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
            >
              {entries.length} articles
              {sport !== "all" ? ` · ${sport.replace(/_/g, " ")}` : ""}
            </h2>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-12 text-center text-sm text-zinc-500">
              No articles match your search. Try another sport mode or search term.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {entries.map((entry) => (
                <CombatpediaEntryCard key={entry.slug} entry={entry} />
              ))}
            </div>
          )}
        </section>
      </div>
    </CombatpediaShell>
  );
}
