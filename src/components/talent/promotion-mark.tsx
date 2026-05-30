import Link from "next/link";
import { OrgLogo } from "@/components/organizations/org-logo";

interface PromotionMarkProps {
  promotion: string;
  logoUrl?: string | null;
  organizationSlug?: string;
  size?: "sm" | "md";
  className?: string;
}

export function PromotionMark({
  promotion,
  logoUrl,
  organizationSlug,
  size = "sm",
  className,
}: PromotionMarkProps) {
  const content = (
    <span className={`inline-flex items-center gap-2 min-w-0 ${className ?? ""}`}>
      <OrgLogo src={logoUrl ?? undefined} alt={promotion} size={size} />
      <span className="truncate text-sm font-medium">{promotion}</span>
    </span>
  );

  if (organizationSlug) {
    return (
      <Link
        href={`/organizations/${organizationSlug}`}
        className="inline-flex hover:text-brand transition-colors"
      >
        {content}
      </Link>
    );
  }

  return content;
}
