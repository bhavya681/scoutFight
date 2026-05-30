import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_CONTRACTS } from "@/lib/data/dashboard-demo";

export const metadata: Metadata = { title: "Contracts" };

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
      <p className="text-sm text-muted-foreground">Track agreements with talent you discover on PWR Scout.</p>
      <div className="space-y-4">
        {DEMO_CONTRACTS.map((c) => (
          <Card key={c.id} className="p-6 flex justify-between gap-4">
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.talentName}</p>
            </div>
            <Badge variant="secondary">{c.status}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
