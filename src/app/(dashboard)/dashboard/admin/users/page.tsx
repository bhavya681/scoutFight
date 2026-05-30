import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "User Management" };

const USERS = [
  { id: "1", name: "Marcus Johnson", email: "marcus@example.com", role: "athlete", tier: "scout" },
  { id: "2", name: "Apex Fight League", email: "bookings@apex.com", role: "promoter", tier: "promoter" },
  { id: "3", name: "Admin User", email: "admin@pwrscout.com", role: "admin", tier: "elite" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold uppercase">User Management</h1>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-muted-foreground">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.id} className="border-b border-white/10">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4">
                    <Badge variant="secondary">{u.role}</Badge>
                  </td>
                  <td className="p-4">{u.tier}</td>
                  <td className="p-4">
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
