import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Offers" };

const OFFERS = [
  {
    id: "1",
    athlete: "Marcus Steel Johnson",
    title: "Main Card — Apex FL 47",
    amount: 25000,
    status: "negotiating",
  },
  {
    id: "2",
    athlete: "Alexander Knight",
    title: "Summer Slam Chicago",
    amount: 8000,
    status: "sent",
  },
];

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold uppercase">Offers</h1>
      <div className="space-y-4">
        {OFFERS.map((o) => (
          <Card key={o.id} className="p-6 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h3 className="font-semibold">{o.title}</h3>
              <p className="text-sm text-muted-foreground">{o.athlete}</p>
              <p className="text-pwr-red font-semibold mt-2">${o.amount.toLocaleString()}</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-white/10">
                {o.status}
              </span>
              <Button size="sm" variant="secondary">
                View
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
