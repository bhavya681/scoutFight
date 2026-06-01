import { DirectoryCinematicHero } from "@/components/directory/directory-cinematic-hero";

export function PromotionsHero({
  promotionCount,
  athleteCount,
  countriesCount,
}: {
  promotionCount: number;
  athleteCount: number;
  countriesCount: number;
}) {
  const promLabel = `${promotionCount}+`;
  const athleteLabel =
    athleteCount >= 1000
      ? `${(athleteCount / 1000).toFixed(1).replace(/\.0$/, "")}K`
      : athleteCount.toLocaleString();

  return (
    <DirectoryCinematicHero
      badge={
        <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
          <span className="h-1.5 w-1.5 rounded-full bg-pwr-red animate-pulse" />
          Live directory
        </span>
      }
      title={
        <>
          The Promotions Powering{" "}
          <span className="text-gradient">Combat Sports</span>
        </>
      }
      description="Discover verified MMA, boxing, and kickboxing organizations worldwide — sourced, ranked, and connected to the talent under their banner."
      ctas={[
        { label: "Explore promotions", href: "#promotions-grid" },
        { label: "List your promotion", href: "/contact", variant: "outline" },
      ]}
      stats={[
        { value: promLabel, label: "Promotions" },
        { value: athleteLabel, label: "Athletes" },
        { value: `${countriesCount}+`, label: "Countries" },
      ]}
    />
  );
}
