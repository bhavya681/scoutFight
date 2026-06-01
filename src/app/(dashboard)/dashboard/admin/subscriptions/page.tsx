import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Subscription Management" };

const SUBS = [
  { user: "Apex Fight League", plan: "Enterprise", mrr: 199, status: "active" },
  { user: "James Ortiz", plan: "Recruiter", mrr: 79, status: "active" },
  { user: "Marcus Johnson", plan: "Scout", mrr: 29, status: "active" },
  { user: "Demo User", plan: "Free", mrr: 0, status: "active" },
];

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold uppercase">Subscriptions</h1>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4">Account</th>
              <th className="p-4">Plan</th>
              <th className="p-4">MRR</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {SUBS.map((s) => (
              <tr key={s.user} className="border-b border-border">
                <td className="p-4 font-medium">{s.user}</td>
                <td className="p-4">
                  <Badge variant="secondary">{s.plan}</Badge>
                </td>
                <td className="p-4">${s.mrr}</td>
                <td className="p-4 text-emerald-400">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
