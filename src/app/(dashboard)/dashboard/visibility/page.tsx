"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAREER_STATUS } from "@/lib/constants";

export default function VisibilityPage() {
  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="font-display text-2xl font-bold uppercase">Availability settings</h1>
      <p className="text-sm text-muted-foreground -mt-4">
        Transparent status helps recruiters respect contracts and find free agents faster.
      </p>

      <Card className="p-6 space-y-4">
        <div>
          <Label>Career status</Label>
          <Select defaultValue="free_agent">
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAREER_STATUS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            {CAREER_STATUS.find((s) => s.id === "free_agent")?.description}
          </p>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        {[
          { id: "profile", label: "Public profile", desc: "Visible in search and discover" },
          { id: "booking", label: "Accept booking requests", desc: "Open to bookings" },
          { id: "analytics", label: "Share visibility analytics", desc: "Stats for verified recruiters" },
          { id: "market", label: "Show market value", desc: "Estimated value on profile" },
        ].map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor={item.id}>{item.label}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            <Switch id={item.id} defaultChecked />
          </div>
        ))}
        <Button className="w-full">Save settings</Button>
      </Card>
    </div>
  );
}
