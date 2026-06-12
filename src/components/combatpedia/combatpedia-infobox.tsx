import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { CombatpediaEntry } from "@/lib/combatpedia/service";
import type { CombatpediaArticle } from "@/lib/combatpedia/wikipedia-article";

export function CombatpediaInfobox({
  entry,
  article,
}: {
  entry: CombatpediaEntry;
  article: CombatpediaArticle;
}) {
  return (
    <aside className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
      {article.thumbnailUrl && (
        <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            className="object-cover object-top"
            sizes="320px"
            priority
            unoptimized
          />
        </div>
      )}
      <div className="bg-[#7b1113] px-3 py-2">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide text-white text-center">
          {article.title}
        </h2>
      </div>
      <dl className="text-xs divide-y divide-zinc-100 dark:divide-zinc-800">
        <div className="grid grid-cols-[110px_1fr] gap-2 px-3 py-2">
          <dt className="font-semibold text-zinc-500">Sport</dt>
          <dd className="capitalize">{entry.sport.replace(/_/g, " ")}</dd>
        </div>
        {article.description && (
          <div className="grid grid-cols-[110px_1fr] gap-2 px-3 py-2">
            <dt className="font-semibold text-zinc-500">Role</dt>
            <dd>{article.description}</dd>
          </div>
        )}
        <div className="grid grid-cols-[110px_1fr] gap-2 px-3 py-2">
          <dt className="font-semibold text-zinc-500">Images</dt>
          <dd>{article.images.length}</dd>
        </div>
        <div className="px-3 py-2">
          <dt className="font-semibold text-zinc-500 mb-1">Categories</dt>
          <dd className="flex flex-wrap gap-1">
            {article.categories.slice(0, 5).map((cat) => (
              <span
                key={cat}
                className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-300"
              >
                {cat}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <a
        href={article.pageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 border-t border-zinc-100 dark:border-zinc-800 px-3 py-2.5 text-xs font-medium text-[#7b1113] dark:text-[#ff6b6e] hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        Read on Wikipedia
        <ExternalLink className="h-3 w-3" />
      </a>
    </aside>
  );
}
