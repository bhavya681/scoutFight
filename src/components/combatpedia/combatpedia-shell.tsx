import Link from "next/link";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { CombatModeToggle } from "./combat-mode-toggle";

export function CombatpediaShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-[calc(100vh-4rem)] bg-[#f8f9fb] text-zinc-900 dark:bg-[#0f1117] dark:text-zinc-100",
        className
      )}
    >
      <div className="border-b border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm">
        <div className="page-container py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7b1113] text-white shadow-sm">
              <BookOpen className="h-4 w-4" aria-hidden />
            </div>
            <div>
              <Link
                href="/combatpedia"
                className="font-display text-lg font-bold tracking-tight text-[#7b1113] dark:text-[#ff6b6e] hover:underline"
              >
                Combatpedia
              </Link>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Modern combat sports encyclopedia · Wikipedia powered
              </p>
            </div>
          </div>
          <CombatModeToggle variant="pill" />
        </div>
      </div>
      {children}
    </div>
  );
}
