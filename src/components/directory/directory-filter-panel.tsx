import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DirectoryFilterPanel({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "relative z-20 -mt-6 sm:-mt-8 mb-8 sm:mb-10 scroll-mt-28",
        className
      )}
    >
      <div className="filter-panel rounded-2xl p-4 sm:p-5 space-y-4">{children}</div>
    </div>
  );
}
