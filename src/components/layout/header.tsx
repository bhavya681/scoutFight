"use client";

import { useEffect } from "react";
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
import { useBodyScrollLock } from "@/lib/hooks/use-body-scroll-lock";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { mobileMenuOpen, setMobileMenuOpen, toggleTalentAi, openTalentAi, talentAiOpen } =
    useUIStore();
  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="page-container flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
        <BrandLogo variant="compact" priority className="h-8 sm:h-9 w-auto transition-opacity hover:opacity-90" />

        <nav className="hidden xl:flex items-center gap-0.5 min-w-0" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-2.5 xl:px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                isActive(link.href)
                  ? "bg-pwr-red/15 text-pwr-red"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hidden md:flex h-9 w-9 sm:h-10 sm:w-10",
              talentAiOpen && "bg-pwr-red/15 text-pwr-red"
            )}
            onClick={toggleTalentAi}
            title="Talent Research"
            aria-label="Talent Research"
            aria-pressed={talentAiOpen}
          >
            <TalentAiIcon variant="nav" active={talentAiOpen} />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" asChild>
            <Link href="/discover" aria-label="Search talent">
              <Search className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden sm:flex h-9 w-9 sm:h-10 sm:w-10"
            asChild
          >
            <Link href="/dashboard/messages" aria-label="Messages">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-4 h-4 px-0.5 rounded-full bg-pwr-red text-[10px] text-white flex items-center justify-center font-bold tabular-nums">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="h-4 w-4 hidden dark:block" />
          </Button>
          <Button size="sm" className="hidden md:flex ml-0.5 h-9" asChild>
            <Link href="/dashboard?role=recruiter">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden lg:inline">Dashboard</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden h-9 w-9 sm:h-10 sm:w-10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-border bg-background/98 backdrop-blur-xl max-h-[min(70vh,520px)] overflow-y-auto scroll-touch safe-bottom">
          <nav className="page-container py-4 space-y-0.5" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-3 text-sm font-medium rounded-lg min-h-[44px] flex items-center",
                  isActive(link.href)
                    ? "bg-pwr-red/15 text-pwr-red"
                    : "hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="page-container pb-4 space-y-2 border-t border-border/60 pt-4">
            <Button
              variant="outline"
              className="w-full min-h-[44px] gap-2 justify-start"
              onClick={() => {
                openTalentAi("matchmaker");
                setMobileMenuOpen(false);
              }}
            >
              <TalentAiIcon variant="nav" active={talentAiOpen} />
              Talent Research
            </Button>
            <Button className="w-full min-h-[44px]" asChild onClick={() => setMobileMenuOpen(false)}>
              <Link href="/dashboard?role=recruiter">Open dashboard</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
