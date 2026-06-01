import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type DirectoryHeroStat = {
  value: string;
  label: string;
};

export type DirectoryHeroCta = {
  label: string;
  href: string;
  variant?: "primary" | "outline";
  icon?: ReactNode;
};

export type DirectoryCinematicHeroProps = {
  badge: ReactNode;
  title: ReactNode;
  description: string;
  stats: DirectoryHeroStat[];
  ctas?: DirectoryHeroCta[];
  imageSrc?: string;
  minHeight?: string;
};

const DEFAULT_BG = "/promotions-hero-bg.png";

export function DirectoryCinematicHero({
  badge,
  title,
  description,
  stats,
  ctas = [],
  imageSrc = DEFAULT_BG,
  minHeight = "min-h-[340px] sm:min-h-[380px] lg:min-h-[400px]",
}: DirectoryCinematicHeroProps) {
  return (
    <section
      className={`relative border-b border-border overflow-hidden flex items-end ${minHeight}`}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        className="object-cover object-center scale-105"
        priority
        aria-hidden
      />
      <div className="absolute inset-0 hero-cinematic-scrim-l" />
      <div className="absolute inset-0 hero-cinematic-scrim-b" />
      <div className="absolute inset-0 hero-cinematic-grid pointer-events-none" />

      <div className="relative page-container w-full py-10 sm:py-12 lg:py-14">
        <div className="max-w-3xl">
          <div className="mb-4">{badge}</div>
          <h1 className="font-display text-[1.75rem] sm:text-4xl lg:text-[2.65rem] font-bold uppercase tracking-tight leading-[1.06] text-foreground">
            {title}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
            {description}
          </p>

          {ctas.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-7">
              {ctas.map((cta) =>
                cta.variant === "outline" ? (
                  <Button
                    key={cta.href}
                    size="lg"
                    variant="outline"
                    className="h-11 px-5 border-border bg-background/60 text-foreground hover:bg-muted backdrop-blur-sm"
                    asChild
                  >
                    <Link href={cta.href}>
                      {cta.icon}
                      {cta.label}
                    </Link>
                  </Button>
                ) : (
                  <Button key={cta.href} size="lg" className="h-11 px-6 font-semibold" asChild>
                    <Link href={cta.href}>
                      {cta.icon}
                      {cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )
              )}
            </div>
          )}
        </div>

        <div className="mt-8 sm:mt-10 flex flex-wrap gap-8 sm:gap-12 lg:gap-16">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl sm:text-[1.75rem] font-bold text-foreground tabular-nums leading-none">
                {s.value}
              </p>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
