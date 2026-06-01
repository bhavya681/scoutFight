import { ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";

const PANEL_SIZES = {
  sm: { box: "h-9 w-9", icon: "h-[18px] w-[18px]", radius: "rounded-lg" },
  md: { box: "h-10 w-10", icon: "h-5 w-5", radius: "rounded-lg" },
  lg: { box: "h-11 w-11", icon: "h-5 w-5", radius: "rounded-xl" },
} as const;

type TalentAiIconProps = {
  className?: string;
  /** Header nav: same weight as Search / Bell icons */
  variant?: "nav" | "panel";
  size?: keyof typeof PANEL_SIZES;
  active?: boolean;
  /** @deprecated Use variant="panel" — chip removed for cleaner UI */
  showAiBadge?: boolean;
};

/** Talent Research mark — minimal in navbar, branded tile in panels */
export function TalentAiIcon({
  className,
  variant = "panel",
  size = "md",
  active = false,
}: TalentAiIconProps) {
  if (variant === "nav") {
    return (
      <ScanSearch
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          active ? "text-pwr-red" : "text-foreground",
          className
        )}
        strokeWidth={2}
        aria-hidden
      />
    );
  }

  const s = PANEL_SIZES[size];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        s.box,
        s.radius,
        "border border-pwr-red/25 bg-pwr-red/10 text-pwr-red",
        active && "border-pwr-red/40 bg-pwr-red/15 shadow-sm shadow-pwr-red/10",
        className
      )}
      aria-hidden
    >
      <ScanSearch className={cn(s.icon)} strokeWidth={2} />
    </span>
  );
}
