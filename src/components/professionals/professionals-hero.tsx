import { Plus, Users } from "lucide-react";
import { TALENT_CATEGORIES } from "@/lib/constants";
import { DirectoryCinematicHero } from "@/components/directory/directory-cinematic-hero";

export function ProfessionalsHero({
  totalPros,
  countriesCount,
}: {
  totalPros: number;
  countriesCount: number;
}) {
  const countLabel =
    totalPros >= 1000
      ? `${(totalPros / 1000).toFixed(1).replace(/\.0$/, "")}K+`
      : `${totalPros.toLocaleString()}+`;

  return (
    <DirectoryCinematicHero
      badge={
        <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
          <span className="h-1.5 w-1.5 rounded-full bg-pwr-red animate-pulse" />
          <Users className="h-3.5 w-3.5" />
          Industry network
        </span>
      }
      title={
        <>
          The People Powering{" "}
          <span className="text-gradient">Combat Sports</span>
        </>
      }
      description="Connect with referees, announcers, coaches, managers, and agents — verified profiles sourced from global public data."
      ctas={[
        { label: "Explore professionals", href: "#professionals-grid" },
        {
          label: "Get listed",
          href: "/onboarding",
          variant: "outline",
          icon: <Plus className="h-4 w-4" />,
        },
      ]}
      stats={[
        { value: countLabel, label: "Professionals" },
        { value: String(TALENT_CATEGORIES.professionals.length), label: "Roles" },
        { value: `${countriesCount}+`, label: "Countries" },
      ]}
    />
  );
}
