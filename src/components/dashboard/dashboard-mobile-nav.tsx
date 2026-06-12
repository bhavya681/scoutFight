"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DASHBOARD_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type DashboardRole = keyof typeof DASHBOARD_LINKS;

export function DashboardMobileNav({ role: defaultRole = "recruiter" }: { role?: DashboardRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as DashboardRole) || defaultRole;
  const links = DASHBOARD_LINKS[role] ?? DASHBOARD_LINKS.recruiter;

  return (
    <div className="lg:hidden sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="px-4 py-2.5 flex items-center gap-3">
        <Select
          value={role}
          onValueChange={(v) => router.push(`/dashboard?role=${v}`)}
        >
          <SelectTrigger className="h-9 w-[130px] text-xs shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="talent">Talent</SelectItem>
            <SelectItem value="recruiter">Recruiter</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <nav
          className="flex flex-1 gap-1.5 overflow-x-auto scroll-touch scrollbar-smooth min-w-0"
          aria-label="Dashboard sections"
        >
          {links.map((link) => {
            const href =
              link.href === "/dashboard" ? `/dashboard?role=${role}` : link.href;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={href}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-pwr-red text-white"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
