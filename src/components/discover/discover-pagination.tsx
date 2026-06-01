"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function DiscoverPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const basePath =
    pathname === "/organizations" ||
    pathname === "/professionals" ||
    pathname === "/videos" ||
    pathname === "/rankings"
      ? pathname
      : "/discover";

  if (totalPages <= 1) return null;

  function href(p: number) {
    const next = new URLSearchParams(params.toString());
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-10"
      aria-label="Pagination"
    >
      <Link
        href={href(Math.max(1, page - 1))}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors",
          page <= 1 && "pointer-events-none opacity-40"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          className={cn(
            "flex h-9 min-w-9 px-2 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
            p === page
              ? "border-pwr-red bg-pwr-red text-white"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          )}
        >
          {p}
        </Link>
      ))}
      <Link
        href={href(Math.min(totalPages, page + 1))}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors",
          page >= totalPages && "pointer-events-none opacity-40"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
