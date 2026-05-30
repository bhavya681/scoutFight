"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/brand-logo";
import { APP_TAGLINE, APP_TAGLINE_LONG, APP_FREE_NOTICE } from "@/lib/constants";

const stats = [
  { label: "Disciplines", value: "12+" },
  { label: "Live profiles", value: "Wiki" },
  { label: "Video intel", value: "YouTube" },
  { label: "Compare", value: "4 max" },
];

export function HomeHero() {
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

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Button size="lg" className="glow-red" asChild>
                <Link href="/discover">
                  <Search className="h-4 w-4" />
                  Discover talent
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard?role=recruiter">
                  <Users className="h-4 w-4" />
                  Recruiter dashboard
                </Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-pwr-red shrink-0" />
              Live Wikipedia, YouTube & promotion data
              <ArrowRight className="h-3 w-3 opacity-60" />
            </p>
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
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl"
        >
          {stats.map((s) => (
            <div key={s.label} className="stat-pill">
              <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
