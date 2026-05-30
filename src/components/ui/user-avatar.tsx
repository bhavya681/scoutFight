"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";
import { FighterPlaceholder } from "@/components/ui/fighter-placeholder";

const SIZE = {
  xs: "h-8 w-8",
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-24 w-24",
  xl: "h-28 w-28 sm:h-36 sm:w-36",
  fill: "absolute inset-0",
} as const;

const IMAGE_SIZES = {
  xs: 32,
  sm: 44,
  md: 56,
  lg: 96,
  xl: 144,
  fill: 400,
} as const;

export type UserAvatarSize = keyof typeof SIZE;

interface UserAvatarProps {
  name: string;
  src?: string | null;
  size?: UserAvatarSize;
  /** circle (default) or rounded-lg for cards */
  shape?: "circle" | "rounded";
  /** fighter = combat sports silhouette; official = staff-style silhouette */
  placeholderVariant?: "fighter" | "official";
  className?: string;
  priority?: boolean;
}

function PhotoFallback({
  size,
  shape,
  placeholderVariant,
  className,
  name,
}: {
  size: UserAvatarSize;
  shape: "circle" | "rounded";
  placeholderVariant: "fighter" | "official";
  className?: string;
  name: string;
}) {
  const rounded = shape === "circle" ? "rounded-full" : "rounded-lg";
  return (
    <div
      role="img"
      aria-label={`${name} — no photo`}
      className={cn(
        "relative shrink-0 overflow-hidden",
        SIZE[size],
        rounded,
        size === "fill" && "h-full w-full",
        className
      )}
    >
      <FighterPlaceholder variant={placeholderVariant} />
    </div>
  );
}

export function UserAvatar({
  name,
  src,
  size = "md",
  shape = "circle",
  placeholderVariant = "fighter",
  className,
  priority = false,
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = !isUsableImageUrl(src) || failed;
  const rounded = shape === "circle" ? "rounded-full" : "rounded-lg";

  if (showFallback) {
    return (
      <PhotoFallback
        name={name}
        size={size}
        shape={shape}
        placeholderVariant={placeholderVariant}
        className={className}
      />
    );
  }

  if (size === "fill") {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", rounded, className)}>
        <Image
          src={src!.trim()}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority={priority}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden shrink-0",
        SIZE[size],
        rounded,
        className
      )}
    >
      <Image
        src={src!.trim()}
        alt={name}
        fill
        className="object-cover"
        sizes={`${IMAGE_SIZES[size]}px`}
        priority={priority}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
