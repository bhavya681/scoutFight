import Image from "next/image";
import Link from "next/link";
import { APP_LOGO, APP_LOGO_LIGHT, APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** full = hero/marketing, compact = header, icon = shield only */
  variant?: "full" | "compact" | "icon";
  className?: string;
  /** Set to false when already inside a parent link */
  linked?: boolean;
  href?: string;
  priority?: boolean;
}

const sizes = {
  full: { width: 320, height: 280, className: "w-full max-w-[min(100%,320px)] h-auto" },
  compact: { width: 140, height: 48, className: "h-9 w-auto" },
  icon: { width: 40, height: 40, className: "h-10 w-10 object-contain" },
};

export function BrandLogo({
  variant = "full",
  className,
  linked = true,
  href = "/",
  priority = false,
}: BrandLogoProps) {
  const s = sizes[variant];
  const alt = `${APP_NAME} — ${APP_TAGLINE}`;

  const imageClass = cn(s.className, className);

  const img = (
    <>
      <Image
        src={APP_LOGO}
        alt={alt}
        width={s.width}
        height={s.height}
        className={cn(imageClass, "hidden dark:block")}
        priority={priority}
      />
      <Image
        src={APP_LOGO_LIGHT}
        alt=""
        aria-hidden
        width={s.width}
        height={s.height}
        className={cn(imageClass, "dark:hidden")}
        priority={priority}
      />
    </>
  );

  if (linked && href) {
    return (
      <Link
        href={href}
        className="inline-block shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-pwr-red/50 rounded-lg"
      >
        {img}
      </Link>
    );
  }
  return img;
}
