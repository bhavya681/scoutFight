import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PageHeroStat = {
  value: string;
  label: string;
};

export type PageHeroCta = {
  label: string;
  href: string;
  variant?: "primary" | "outline";
  icon?: ReactNode;
};

export type MarketingPageHeroProps = {
  badge: ReactNode;
  title: ReactNode;
  description: string;
  stats: PageHeroStat[];
  ctas?: PageHeroCta[];
  /** Extra controls in the right panel (e.g. client buttons). */
  actions?: ReactNode;
  variant?: "cinematic" | "solid";
  imageSrc?: string;
  className?: string;
};

const DEFAULT_BG = "/promotions-hero-bg.png";

function HeroStatsPanel({
  stats,
  actions,
  ctas,
}: {
  stats: PageHeroStat[];
  actions?: ReactNode;
  ctas?: PageHeroCta[];
}) {
  const outlineCtas = ctas?.filter((c) => c.variant === "outline") ?? [];
  const primaryCtas = ctas?.filter((c) => c.variant !== "outline") ?? [];

  return (
    <div className="stat-panel rounded-2xl p-5 sm:p-6">
      <div
        className={cn(
          "grid gap-4 sm:gap-5",
          stats.length >= 3 ? "grid-cols-3" : "grid-cols-2"
        )}
      >
        {stats.map((s) => (
          <div key={s.label} className="min-w-0">
            <p className="font-display text-xl sm:text-2xl font-bold text-foreground tabular-nums leading-none truncate">
              {s.value}
            </p>
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1.5 leading-tight">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {(actions || outlineCtas.length > 0 || primaryCtas.length > 0) && (
        <div className="mt-5 pt-5 border-t border-border flex flex-col gap-2">
          {actions}
          {primaryCtas.map((cta) => (
            <Button key={cta.href} className="w-full h-11 font-semibold" asChild>
              <Link href={cta.href}>
                {cta.icon}
                {cta.label}
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
          ))}
          {outlineCtas.map((cta) => (
            <Button
              key={cta.href}
              variant="outline"
              className="w-full h-11 border-border bg-background/80 text-foreground hover:bg-muted"
              asChild
            >
              <Link href={cta.href}>
                {cta.icon}
                {cta.label}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MarketingPageHero({
  badge,
  title,
  description,
  stats,
  ctas = [],
  actions,
  variant = "solid",
  imageSrc = DEFAULT_BG,
  className,
}: MarketingPageHeroProps) {
  const primaryCtas = ctas.filter((c) => c.variant !== "outline");
  const isCinematic = variant === "cinematic";

  return (
    <section
      className={cn(
        "relative border-b border-border overflow-hidden",
        isCinematic
          ? "min-h-[320px] sm:min-h-[360px] lg:min-h-[380px] flex items-end"
          : "bg-gradient-to-br from-muted via-background to-background hero-solid-accent",
        className
      )}
    >
      {isCinematic && (
        <>
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover object-center scale-105"
            priority
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/[0.97] to-background/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(227,27,35,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(227,27,35,0.15) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
            aria-hidden
          />
        </>
      )}

      {!isCinematic && (
        <>
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(227,27,35,0.18), transparent 55%)",
            }}
            aria-hidden
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pwr-red/50 to-transparent" />
        </>
      )}

      <div className="relative page-container w-full py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-end">
          <div className="md:col-span-7 lg:col-span-7 xl:col-span-8 min-w-0">
            <div className="mb-3 sm:mb-4">{badge}</div>
            <h1 className="font-display text-[1.65rem] sm:text-4xl lg:text-[2.5rem] xl:text-[2.65rem] font-bold uppercase tracking-tight leading-[1.06] text-foreground">
              {title}
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              {description}
            </p>

          </div>

          <div className="md:col-span-5 lg:col-span-5 xl:col-span-4 w-full min-w-0">
            <HeroStatsPanel stats={stats} actions={actions} ctas={ctas} />
          </div>
        </div>
      </div>
    </section>
  );
}
