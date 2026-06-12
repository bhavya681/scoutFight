"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CombatModeToggleProps = {
  variant?: "header" | "pill" | "full";
  className?: string;
};

export function CombatModeToggle({ variant = "header", className }: CombatModeToggleProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const combatActive = mounted && pathname.startsWith("/combatpedia");
  const href = combatActive ? "/discover" : "/combatpedia";
  const label = combatActive ? "Scout mode" : "Combatpedia";

  if (variant === "pill") {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all",
          combatActive
            ? "bg-[#7b1113] text-white border-[#7b1113] shadow-sm"
            : "bg-background text-muted-foreground border-border hover:border-[#7b1113]/40 hover:text-[#7b1113]",
          className
        )}
        aria-pressed={combatActive}
      >
        <BookOpen className="h-3.5 w-3.5" aria-hidden />
        {combatActive ? "Combatpedia ON" : "Combatpedia mode"}
      </Link>
    );
  }

  if (variant === "full") {
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between gap-3 rounded-xl border p-4 transition-all",
          combatActive
            ? "border-[#7b1113]/40 bg-[#7b1113]/10"
            : "border-border bg-card hover:border-[#7b1113]/30",
          className
        )}
        aria-pressed={combatActive}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              combatActive ? "bg-[#7b1113] text-white" : "bg-muted text-muted-foreground"
            )}
          >
            <BookOpen className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              {combatActive ? "Combatpedia mode active" : "Switch to Combatpedia"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {combatActive
                ? "Wiki articles, galleries & sport modes"
                : "Wikipedia-powered wrestling, MMA, boxing & cricket encyclopedia"}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
            combatActive ? "bg-[#7b1113] text-white" : "bg-muted text-muted-foreground"
          )}
        >
          {combatActive ? "ON" : "GO"}
        </span>
      </Link>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "hidden md:flex h-9 gap-1.5 px-2.5 text-xs font-semibold uppercase tracking-wide",
        combatActive && "bg-[#7b1113]/15 text-[#7b1113] dark:text-[#ff6b6e]",
        className
      )}
      asChild
    >
      <Link href={href} aria-pressed={combatActive} title={label}>
        <BookOpen className="h-4 w-4" aria-hidden />
        <span className="hidden lg:inline">{combatActive ? "Combat ON" : "Combatpedia"}</span>
      </Link>
    </Button>
  );
}
