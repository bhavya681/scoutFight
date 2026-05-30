import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-muted/20 backdrop-blur-sm mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandLogo variant="compact" className="mb-4 h-10" />
            <p className="text-xs text-pwr-red font-semibold uppercase tracking-[0.2em] mb-3">
              {APP_TAGLINE}
            </p>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              The professional B2B and B2C platform for the global combat sports industry.
              Discover, compare, scout, recruit, and manage talent relationships worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-pwr-red transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-pwr-red transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/dashboard" className="hover:text-pwr-red transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <p>Combat sports · Every discipline · One marketplace</p>
        </div>
      </div>
    </footer>
  );
}
