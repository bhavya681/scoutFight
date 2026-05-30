import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Verification" };

const REQUESTS = [
  { id: "1", name: "Ray Mitchell", type: "athlete", submitted: "2026-05-28" },
  { id: "2", name: "Metro Kickboxing", type: "promotion", submitted: "2026-05-27" },
];

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold uppercase">Verification Approval</h1>
      <div className="space-y-4">
        {REQUESTS.map((r) => (
          <Card key={r.id} className="p-6 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h3 className="font-semibold">{r.name}</h3>
              <Badge variant="secondary" className="mt-2 capitalize">
                {r.type}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">Submitted {r.submitted}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="outline">
                Reject
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
