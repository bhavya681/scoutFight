"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoutingDashboardHeroVisualProps {
  className?: string;
}

/** Hero product preview — scouting dashboard mockup */
export function ScoutingDashboardHeroVisual({
  className,
}: ScoutingDashboardHeroVisualProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative w-full max-w-[440px] mx-auto lg:mx-0 lg:ml-auto", className)}
    >
      <div
        className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-pwr-red/25 via-transparent to-pwr-gold/10 blur-2xl opacity-80 pointer-events-none"
        aria-hidden
      />

      <Link
        href="/discover"
        className="group relative block rounded-2xl border border-border bg-background/90 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.65)] overflow-hidden transition-transform duration-300 hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pwr-red/50"
      >
        <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0">
            <Activity className="h-3.5 w-3.5 text-pwr-red shrink-0" strokeWidth={2.5} />
            <span className="text-[11px] font-medium text-muted-foreground truncate">
              scoutfight.app / dashboard
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-pwr-red/15 border border-pwr-red/30 px-2 py-0.5 text-[10px] font-semibold text-pwr-red">
            <span className="h-1.5 w-1.5 rounded-full bg-pwr-red animate-pulse" />
            Live
          </span>
        </div>

        <div className="relative aspect-[4/5] sm:aspect-[5/6] w-full bg-background">
          <Image
            src="/scouting-dashboard-hero.png"
            alt="ScoutFight scouting dashboard showing athlete roster, top rated talent, and recruitment activity"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 440px"
            priority
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent"
            aria-hidden
          />
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-lg border border-border bg-card backdrop-blur-md px-3 py-2 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <p className="text-[11px] text-muted-foreground">Explore live roster & rankings</p>
          <span className="text-[11px] font-semibold text-pwr-red shrink-0">Open Discover →</span>
        </div>
      </Link>
    </motion.div>
  );
}
