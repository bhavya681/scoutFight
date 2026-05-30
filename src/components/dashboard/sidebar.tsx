"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ScanSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_LINKS } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type DashboardRole = keyof typeof DASHBOARD_LINKS;

export function DashboardSidebar({ role: defaultRole = "recruiter" }: { role?: DashboardRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as DashboardRole) || defaultRole;
  const links = DASHBOARD_LINKS[role] ?? DASHBOARD_LINKS.recruiter;

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-card/50 p-4 shrink-0">
      <Link href="/dashboard" className="flex items-center gap-2 mb-4 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pwr-red">
          <ScanSearch className="h-4 w-4 text-white" strokeWidth={1.75} />
        </div>
        <span className="font-display font-bold uppercase text-sm tracking-wider">Dashboard</span>
      </Link>

      <Select
        value={role}
        onValueChange={(v) => router.push(`/dashboard?role=${v}`)}
      >
        <SelectTrigger className="mb-6 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="talent">Talent View</SelectItem>
          <SelectItem value="recruiter">Recruiter View</SelectItem>
          <SelectItem value="admin">Admin View</SelectItem>
        </SelectContent>
      </Select>

      <nav className="space-y-1 flex-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={`${link.href}${link.href === "/dashboard" ? `?role=${role}` : ""}`}
            className={cn(
              "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-pwr-red text-white"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link href="/" className="px-3 py-2 text-sm text-muted-foreground hover:text-pwr-red">
        ← Marketplace
      </Link>
    </aside>
  );
}
