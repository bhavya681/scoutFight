import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CombatpediaEntry } from "@/lib/combatpedia/service";

export function CombatpediaEntryCard({ entry }: { entry: CombatpediaEntry }) {
  return (
    <Link
      href={`/combatpedia/${entry.slug}`}
      className={cn(
        "group block rounded-xl border border-zinc-200 dark:border-zinc-800",
        "bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md",
        "hover:border-[#7b1113]/30 transition-all"
      )}
    >
      <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800">
        {entry.thumbnailUrl ? (
          <Image
            src={entry.thumbnailUrl}
            alt=""
            fill
            className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-display font-bold text-zinc-300 dark:text-zinc-600">
            {entry.displayName.charAt(0)}
          </div>
        )}
        <span className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
          {entry.sport.replace(/_/g, " ")}
        </span>
      </div>
      <div className="p-3">
        <p className="font-display font-bold text-sm uppercase tracking-wide line-clamp-2 group-hover:text-[#7b1113] dark:group-hover:text-[#ff6b6e]">
          {entry.displayName}
        </p>
        <p className="text-[10px] text-zinc-500 mt-1">Wikipedia article</p>
      </div>
    </Link>
  );
}
