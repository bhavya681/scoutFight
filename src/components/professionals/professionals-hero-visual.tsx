"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mic2,
  Shield,
  Radio,
  Briefcase,
  Handshake,
  GraduationCap,
  BadgeCheck,
  Globe2,
  Users,
} from "lucide-react";
import { TALENT_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ROLE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  referee: Shield,
  announcer: Mic2,
  commentator: Radio,
  manager: Briefcase,
  agent: Handshake,
  coach: GraduationCap,
};

const SPOTLIGHT = [
  { name: "Marcus V.", role: "Referee", score: 92, region: "USA" },
  { name: "Elena K.", role: "Commentator", score: 88, region: "UK" },
  { name: "Diego R.", role: "Agent", score: 85, region: "BRA" },
];

interface ProfessionalsHeroVisualProps {
  className?: string;
}

export function ProfessionalsHeroVisual({ className }: ProfessionalsHeroVisualProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative w-full max-w-[480px] mx-auto lg:mx-0 lg:ml-auto", className)}
    >
      <div
        className="absolute -inset-3 rounded-[24px] bg-gradient-to-bl from-pwr-red/20 via-transparent to-pwr-accent/10 blur-2xl opacity-90 pointer-events-none"
        aria-hidden
      />

      <div className="relative rounded-2xl border border-border bg-card shadow-[0_20px_60px_-16px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="relative h-36 sm:h-40">
          <Image
            src="/promotions-hero-bg.png"
            alt=""
            fill
            className="object-cover object-center opacity-50"
            sizes="480px"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              <Users className="h-3 w-3 text-pwr-red" />
              Industry network
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-foreground/85">
              <Globe2 className="h-3 w-3 text-pwr-red" />
              Global
            </span>
          </div>
        </div>

        <div className="p-4 pt-2 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {TALENT_CATEGORIES.professionals.map((cat, i) => {
              const Icon = ROLE_ICONS[cat.id] ?? Briefcase;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <Link
                    href={`/professionals?role=${cat.id}`}
                    className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-2.5 hover:border-pwr-red/40 hover:bg-muted/80 transition-colors text-center"
                  >
                    <Icon className="h-4 w-4 text-pwr-red" />
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-foreground/85 leading-tight">
                      {cat.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-3 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-0.5">
              Top verified this week
            </p>
            {SPOTLIGHT.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.08 }}
                className="flex items-center gap-3 rounded-lg bg-background/80 border border-border px-2.5 py-2"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted font-display text-xs font-bold text-muted-foreground">
                  {p.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate flex items-center gap-1">
                    {p.name}
                    <BadgeCheck className="h-3 w-3 text-pwr-red shrink-0" />
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {p.role} · {p.region}
                  </p>
                </div>
                <span className="font-display text-sm font-bold text-pwr-red tabular-nums">
                  {p.score}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-[10px] text-muted-foreground">
            Referees to agents — one directory for your next hire
          </p>
        </div>
      </div>
    </motion.div>
  );
}
