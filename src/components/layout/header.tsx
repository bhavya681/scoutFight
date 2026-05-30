"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard, Menu, Moon, Search, Sun, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { TalentAiIcon } from "@/components/ai/talent-ai-icon";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useNotificationsStore } from "@/stores/notifications-store";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { mobileMenuOpen, setMobileMenuOpen, toggleTalentAi, openTalentAi, talentAiOpen } =
    useUIStore();
  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo variant="compact" priority className="transition-opacity hover:opacity-90" />

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-all",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-pwr-red/15 text-pwr-red"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={toggleTalentAi}
            title="Talent Research — matchmaker & scout"
            aria-label="Talent Research"
            aria-pressed={talentAiOpen}
          >
            <TalentAiIcon size="sm" active={talentAiOpen} />
          </Button>
          <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
            <Link href="/discover"><Search className="h-4 w-4" /></Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative hidden sm:flex">
            <Link href="/dashboard">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-pwr-red text-[10px] text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </Button>
          <Button size="sm" className="hidden sm:flex ml-1" asChild>
            <Link href="/dashboard?role=recruiter">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border px-4 py-4 space-y-1 bg-background/95 backdrop-blur-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-3 py-2.5 text-sm font-medium rounded-md",
                pathname === link.href ? "bg-pwr-red/15 text-pwr-red" : "hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="outline"
            className="w-full mt-3 gap-2 justify-start"
            onClick={() => openTalentAi("matchmaker")}
          >
            <TalentAiIcon size="sm" showAiBadge />
            Talent Research
          </Button>
          <Button className="w-full mt-2" asChild onClick={() => setMobileMenuOpen(false)}>
            <Link href="/dashboard?role=recruiter">Open dashboard</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
