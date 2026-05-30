"use client";

import { useState } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  countryCodeToFlagEmoji,
  flagImageUrl,
  nationalityToCountryCode,
} from "@/lib/utils/country";

const SIZE = {
  xs: { box: "h-3.5 w-5", img: 20, emoji: "text-sm" },
  sm: { box: "h-4 w-6", img: 24, emoji: "text-base" },
  md: { box: "h-5 w-7", img: 32, emoji: "text-lg" },
} as const;

interface CountryFlagProps {
  nationality: string;
  /** ISO code if already known */
  countryCode?: string | null;
  size?: keyof typeof SIZE;
  showLabel?: boolean;
  className?: string;
}

export function CountryFlag({
  nationality,
  countryCode: countryCodeProp,
  size = "sm",
  showLabel = false,
  className,
}: CountryFlagProps) {
  const code =
    countryCodeProp ?? nationalityToCountryCode(nationality);
  const s = SIZE[size];

  if (!code) {
    if (!showLabel) return null;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-muted-foreground",
          className
        )}
      >
        <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="truncate">{nationality}</span>
      </span>
    );
  }

  return (
    <CountryFlagImage
      code={code}
      label={showLabel ? nationality : undefined}
      size={size}
      className={className}
    />
  );
}

function CountryFlagImage({
  code,
  label,
  size,
  className,
}: {
  code: string;
  label?: string;
  size: keyof typeof SIZE;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const s = SIZE[size];
  const emoji = countryCodeToFlagEmoji(code);

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 min-w-0", className)}
      title={label ?? code}
    >
      {failed ? (
        <span className={cn(s.emoji, "leading-none shrink-0")} aria-hidden>
          {emoji}
        </span>
      ) : (
        <span
          className={cn(
            "relative shrink-0 overflow-hidden rounded-sm border border-border/60 bg-muted shadow-sm",
            s.box
          )}
        >
          <Image
            src={flagImageUrl(code, s.img)}
            alt=""
            fill
            className="object-cover"
            sizes={`${s.img}px`}
            onError={() => setFailed(true)}
          />
        </span>
      )}
      {label && (
        <span className="truncate text-inherit">{label}</span>
      )}
    </span>
  );
}
