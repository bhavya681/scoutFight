import Link from "next/link";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRICING_PLANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Subscription plans for scouts, promoters, and elite organizations.",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide">
          Pricing
        </h1>
        <p className="text-muted-foreground mt-4">
          ScoutFight is free to use — no account required. Explore talent, compare athletes, and apply to opportunities.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {PRICING_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`p-6 flex flex-col ${
              "popular" in plan && plan.popular
                ? "ring-2 ring-pwr-red border-pwr-red/50"
                : ""
            }`}
          >
            {"popular" in plan && plan.popular && (
              <Badge className="w-fit mb-4">Most Popular</Badge>
            )}
            <h2 className="font-display text-xl font-bold uppercase">{plan.name}</h2>
            <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
            <div className="mt-6 mb-6">
              <span className="font-display text-4xl font-bold">
                ${plan.price}
              </span>
              <span className="text-muted-foreground">/{plan.interval}</span>
            </div>
            <ul className="space-y-3 flex-1 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="h-4 w-4 text-pwr-red shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button className="w-full" variant={plan.price === 0 ? "default" : "secondary"} asChild>
                <Link href="/discover">Use free</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
