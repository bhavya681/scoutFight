"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";

interface OrgLogoProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { box: "h-12 w-12", px: 48, icon: "h-6 w-6" },
  md: { box: "h-16 w-16", px: 64, icon: "h-8 w-8" },
  lg: { box: "h-24 w-24", px: 96, icon: "h-10 w-10" },
};

function OrgLogoPlaceholder({
  alt,
  size,
  className,
}: {
  alt: string;
  size: keyof typeof sizes;
  className?: string;
}) {
  const s = sizes[size];
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        s.box,
        "rounded-lg border border-border bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center shrink-0",
        className
      )}
    >
      <Building2 className={cn(s.icon, "text-muted-foreground/70")} strokeWidth={1.5} />
    </div>
  );
}

export function OrgLogo({ src, alt, size = "md", className }: OrgLogoProps) {
  const s = sizes[size];
  const [failed, setFailed] = useState(false);
  const showFallback = !isUsableImageUrl(src) || failed;

  if (showFallback) {
    return <OrgLogoPlaceholder alt={alt} size={size} className={className} />;
  }

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden border border-border bg-white shrink-0",
        s.box,
        className
      )}
    >
      <Image
        src={src!.trim()}
        alt={alt}
        fill
        className="object-contain p-1.5"
        sizes={`${s.px}px`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
