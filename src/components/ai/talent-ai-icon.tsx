import { ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared AI research / scout branding (navbar + panels) */
export function TalentAiIcon({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const icon =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/40",
        box,
        className
      )}
      aria-hidden
    >
      <ScanSearch className={cn(icon, "text-foreground/90")} strokeWidth={1.75} />
    </span>
  );
}
