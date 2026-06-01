import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Standard padded content area below a marketing page hero. */
export function MarketingContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "page-container py-8 sm:py-10 md:py-12 pb-16 sm:pb-20",
        className
      )}
    >
      {children}
    </div>
  );
}
