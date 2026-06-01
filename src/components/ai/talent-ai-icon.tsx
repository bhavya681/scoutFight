import { BrainCircuit, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: {
    box: "h-9 w-9",
    icon: "h-[17px] w-[17px]",
    sparkle: "h-2.5 w-2.5 -top-px -right-px",
    chip: "text-[7px] px-1 py-px -bottom-0.5 -right-0.5",
    radius: "rounded-lg",
  },
  md: {
    box: "h-10 w-10",
    icon: "h-5 w-5",
    sparkle: "h-3 w-3 top-0 right-0",
    chip: "text-[8px] px-1 py-0.5 -bottom-0.5 -right-0.5",
    radius: "rounded-xl",
  },
  lg: {
    box: "h-12 w-12",
    icon: "h-6 w-6",
    sparkle: "h-3.5 w-3.5 top-0.5 right-0.5",
    chip: "text-[9px] px-1.5 py-0.5 -bottom-1 -right-1",
    radius: "rounded-xl",
  },
} as const;

/** Professional AI mark — navbar, Talent Research panel, matchmaker */
export function TalentAiIcon({
  className,
  size = "md",
  active = false,
  showAiBadge = false,
}: {
  className?: string;
  size?: keyof typeof SIZES;
  /** Navbar / panel open state */
  active?: boolean;
  /** Small "AI" chip (panel header) */
  showAiBadge?: boolean;
}) {
  const s = SIZES[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        s.box,
        s.radius,
        "bg-gradient-to-br from-card via-zinc-800 to-background",
        "border border-border shadow-sm",
        "ring-1 ring-inset ring-white/5",
        active && "ring-2 ring-pwr-red/50 border-pwr-red/30 shadow-md shadow-pwr-red/10",
        className
      )}
      aria-hidden
    >
      <span
        className={cn(
          "pointer-events-none absolute inset-0 opacity-90",
          s.radius,
          "bg-gradient-to-br from-pwr-red/30 via-transparent to-pwr-gold/15"
        )}
      />
      <BrainCircuit
        className={cn(s.icon, "relative z-[1] text-white")}
        strokeWidth={1.65}
      />
      <Sparkles
        className={cn(
          "absolute z-[2] text-pwr-gold",
          s.sparkle
        )}
        strokeWidth={2}
        fill="currentColor"
        fillOpacity={0.35}
      />
      {showAiBadge && (
        <span
          className={cn(
            "absolute z-[2] font-display font-bold uppercase leading-none tracking-wider",
            "rounded-sm bg-pwr-red text-white shadow-sm",
            s.chip
          )}
        >
          AI
        </span>
      )}
    </span>
  );
}
