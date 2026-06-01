import Link from "next/link";
import type { Metadata } from "next";
import { Check, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketingPageHero } from "@/components/layout/marketing-page-hero";
import { MarketingContent } from "@/components/layout/marketing-content";
import { PRICING_PLANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Subscription plans for scouts, promoters, and elite organizations.",
};

export default function PricingPage() {
  return (
    <div className="page-shell">
      <MarketingPageHero
        variant="solid"
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
            <CreditCard className="h-3.5 w-3.5" />
            Plans & pricing
          </span>
        }
        title={
          <>
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </>
        }
        description="ScoutFight is free to explore — compare athletes, discover talent, and apply to opportunities. Upgrade when you need more power."
        stats={[
          { value: String(PRICING_PLANS.length), label: "Plans" },
          { value: "Free", label: "To start" },
          { value: "Annual", label: "Savings" },
        ]}
        ctas={[{ label: "Start free", href: "/discover" }]}
      />
      <MarketingContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col bg-muted/50 border-border ${
                "popular" in plan && plan.popular
                  ? "ring-2 ring-pwr-red border-pwr-red/50"
                  : ""
              }`}
            >
              {"popular" in plan && plan.popular && (
                <Badge className="w-fit mb-3 bg-pwr-red text-white">Most popular</Badge>
              )}
              <h2 className="font-display font-bold uppercase text-white">{plan.name}</h2>
              <p className="text-3xl font-bold mt-2 text-white">
                {plan.price === 0 ? "Free" : `$${plan.price}`}
                {plan.price > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-2 flex-1">{plan.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-foreground/85">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="h-4 w-4 text-pwr-red shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" variant={"popular" in plan && plan.popular ? "default" : "outline"} asChild>
                <Link href={plan.id === "enterprise" ? "/contact" : "/sign-up"}>
                  {plan.price === 0 ? "Get started" : "Subscribe"}
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </MarketingContent>
    </div>
  );
}
