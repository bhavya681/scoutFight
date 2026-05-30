import { cn } from "@/lib/utils";

/** Tapology-style neutral fighter silhouette when no photo is available */
export function FighterPlaceholder({
  className,
  variant = "fighter",
}: {
  className?: string;
  variant?: "fighter" | "official";
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950",
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_50%_30%,#e31b23_0%,transparent_55%)]" />
      <svg
        viewBox="0 0 120 120"
        className="relative h-[58%] w-[58%] text-zinc-500/90"
        fill="currentColor"
      >
        {variant === "fighter" ? (
          <>
            <ellipse cx="60" cy="38" rx="22" ry="24" />
            <path d="M28 108c4-28 20-42 32-42s28 14 32 42H28z" />
          </>
        ) : (
          <>
            <circle cx="60" cy="40" r="20" />
            <path d="M32 108c6-24 18-36 28-36s22 12 28 36H32z" />
            <rect x="48" y="72" width="24" height="8" rx="2" opacity="0.5" />
          </>
        )}
      </svg>
      <div
        className="pointer-events-none absolute inset-3 rounded-lg border border-white/5"
        style={{
          background:
            "repeating-linear-gradient(135deg, transparent, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 9px)",
        }}
      />
    </div>
  );
}
