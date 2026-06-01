"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Video, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const CLIPS = [
  { title: "UFC 312 Main Event Highlights", views: "1.2M", dur: "12:04", sport: "MMA" },
  { title: "Boxing KO Round 3", views: "840K", dur: "8:22", sport: "Boxing" },
  { title: "Muay Thai Clinic Breakdown", views: "320K", dur: "15:10", sport: "Muay Thai" },
];

export function VideosHeroVisual({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("relative w-full max-w-[440px] mx-auto lg:ml-auto", className)}
    >
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[0_20px_50px_-16px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2.5">
          <Video className="h-4 w-4 text-pwr-red" />
          <span className="text-[11px] font-medium text-muted-foreground flex-1">Footage library</span>
          <span className="text-[10px] font-semibold text-pwr-red">YouTube</span>
        </div>

        <div className="p-3 space-y-2">
          {CLIPS.map((clip, i) => (
            <Link
              key={clip.title}
              href="/videos"
              className="flex gap-3 rounded-lg border border-border bg-card p-2.5 hover:border-pwr-red/40 transition-colors group"
            >
              <div className="relative w-20 h-14 shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-pwr-red/20 to-card" />
                <Play className="h-6 w-6 text-white/90 relative z-10 group-hover:text-pwr-red transition-colors" />
                <span className="absolute bottom-1 right-1 text-[8px] font-mono bg-black/70 px-1 rounded text-foreground/85">
                  {clip.dur}
                </span>
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
                  {clip.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5">
                    <Eye className="h-3 w-3" />
                    {clip.views}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground uppercase">
                    {clip.sport}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Tagged for scouts
          </span>
          <span className="text-pwr-red font-semibold">Browse all →</span>
        </div>
      </div>
    </motion.div>
  );
}
