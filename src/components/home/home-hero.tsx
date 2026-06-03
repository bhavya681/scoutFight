"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, RefreshCw, Search, Shield, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/brand-logo";
import { OrgLogo } from "@/components/organizations/org-logo";
import { APP_TAGLINE, APP_TAGLINE_LONG, APP_FREE_NOTICE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const linkFocus =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pwr-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type HomeHeroProps = {
  stats: { label: string; value: string }[];
  orgLogos: { name: string; logoUrl: string | null }[];
  verifiedCount: number;
};

const trustPillars = [
  { icon: BadgeCheck, label: "Verified profiles" },
  { icon: Trophy, label: "Fight records" },
  { icon: RefreshCw, label: "Live source data" },
] as const;

export function HomeHero({ stats, orgLogos, verifiedCount }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      <div
        className="absolute top-1/4 -right-32 h-96 w-96 rounded-full blur-[120px] pointer-events-none
          bg-pwr-red/10 dark:bg-pwr-red/25"
        aria-hidden
      />
      <div
        className="absolute bottom-0 -left-24 h-72 w-72 rounded-full blur-[100px] pointer-events-none
          bg-pwr-red/5 dark:bg-pwr-red/10"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-pwr-red font-semibold text-sm uppercase tracking-[0.25em] mb-2">
              {APP_TAGLINE}
            </p>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-4">
              {APP_FREE_NOTICE}
            </p>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[1.08] text-foreground">
              Scout combat talent.{" "}
              <span className="text-gradient">Sign with confidence.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {APP_TAGLINE_LONG}
            </p>

            <div className="flex flex-col gap-3 mt-10">
              <Button size="lg" className="glow-red min-h-12" asChild>
                <Link href="/discover">
                  <Search className="h-4 w-4" />
                  Discover talent
                </Link>
              </Button>
              <p className="text-[11px] text-muted-foreground">
                No account required · {verifiedCount.toLocaleString()}+ verified profiles from live sources
              </p>
              <Link
                href="/dashboard?role=recruiter"
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-fit",
                  linkFocus
                )}
              >
                Recruiter dashboard
                <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>

            <ul
              className="mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6"
              aria-label="Why trust FighterOrg"
            >
              {trustPillars.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon className="h-4 w-4 text-pwr-red shrink-0" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              <div
                className="absolute inset-0 rounded-full scale-90 blur-3xl pointer-events-none
                  bg-pwr-red/[0.07] dark:bg-pwr-red/20"
                aria-hidden
              />
              <BrandLogo
                variant="full"
                href="/"
                priority
                className="relative mx-auto drop-shadow-[0_12px_40px_rgba(227,27,35,0.12)] dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-14"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Trusted data network
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="stat-pill">
                <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          {orgLogos.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Trusted by major promotions
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {orgLogos.slice(0, 6).map((org) => (
                  <OrgLogo
                    key={org.name}
                    src={org.logoUrl ?? undefined}
                    alt={`${org.name} logo`}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
