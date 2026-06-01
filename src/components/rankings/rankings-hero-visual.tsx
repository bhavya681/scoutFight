"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const PODIUM = [
  { rank: 1, name: "Marcus R.", score: 94, sport: "MMA", h: "h-[88%]" },
  { rank: 2, name: "Daniel O.", score: 91, sport: "MMA", h: "h-[72%]" },
  { rank: 3, name: "Liam C.", score: 88, sport: "Boxing", h: "h-[60%]" },
];

export function RankingsHeroVisual({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("relative w-full max-w-[440px] mx-auto lg:ml-auto", className)}
    >
      <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Live leaderboard
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-pwr-red">
            <span className="h-1.5 w-1.5 rounded-full bg-pwr-red animate-pulse" />
            Updated hourly
          </span>
        </div>

        <div className="flex items-end justify-center gap-3 h-36 px-2">
          {PODIUM.map((p) => (
            <Link
              key={p.rank}
              href="/rankings?sport=mma"
              className="flex flex-col items-center flex-1 max-w-[100px] group"
            >
              <div className="flex items-center gap-1 mb-1">
                {p.rank === 1 ? (
                  <Trophy className="h-4 w-4 text-pwr-red" />
                ) : (
                  <Medal className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "font-display font-bold text-sm",
                    p.rank === 1 ? "text-pwr-red" : "text-muted-foreground"
                  )}
                >
                  #{p.rank}
                </span>
              </div>
              <div
                className={cn(
                  "w-full rounded-t-lg bg-gradient-to-t from-pwr-red/80 to-pwr-red/30 border border-pwr-red/30 flex flex-col justify-end p-2 min-h-[60px] transition-all group-hover:from-pwr-red group-hover:to-pwr-red/50",
                  p.h
                )}
              >
                <p className="text-[10px] font-bold text-foreground truncate text-center">
                  {p.name}
                </p>
                <p className="text-[9px] text-foreground/85 text-center">{p.sport}</p>
              </div>
              <span className="font-display text-lg font-bold text-foreground mt-1.5">
                {p.score}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center border-t border-border pt-3">
          {[
            { label: "ScoutScore", val: "AI" },
            { label: "Records", val: "Live" },
            { label: "Sources", val: "3 APIs" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
              <p className="text-xs font-semibold text-foreground">{s.val}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
