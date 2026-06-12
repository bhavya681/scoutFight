"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CombatpediaInfobox } from "./combatpedia-infobox";
import { CombatpediaImageGallery } from "./combatpedia-image-gallery";
import type { CombatpediaEntryDetail } from "@/lib/combatpedia/service";

const TABS = [
  { id: "article", label: "Article" },
  { id: "gallery", label: "Image gallery" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function CombatpediaArticleTabs({ detail }: { detail: CombatpediaEntryDetail }) {
  const [tab, setTab] = useState<TabId>("article");
  const { entry, article } = detail;

  return (
    <div>
      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
              tab === t.id
                ? "border-[#7b1113] text-[#7b1113] dark:text-[#ff6b6e] dark:border-[#ff6b6e]"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "article" ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          <article className="min-w-0">
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
              {article.title}
            </h1>

            <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300 mb-8 first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-[#7b1113]">
              {article.extract}
            </p>

            {article.sections.map((section) => (
              <section key={section.id} className="mb-8">
                <h2
                  className={cn(
                    "font-display font-bold uppercase tracking-wide text-[#7b1113] dark:text-[#ff6b6e] mb-3 border-b border-zinc-100 dark:border-zinc-800 pb-2",
                    section.level <= 2 ? "text-xl" : "text-lg"
                  )}
                >
                  {section.title}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                  {section.text}
                </p>
              </section>
            ))}

            <p className="text-[11px] text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-8">
              Content from Wikipedia under Creative Commons. ScoutFight Combatpedia is an unofficial
              reader — not affiliated with Wikipedia or Fandom.
            </p>
          </article>

          <div className="lg:sticky lg:top-20 h-fit">
            <CombatpediaInfobox entry={entry} article={article} />
          </div>
        </div>
      ) : (
        <CombatpediaImageGallery images={article.images} title={article.title} />
      )}
    </div>
  );
}
