"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORTS, CAREER_STATUS } from "@/lib/constants";

export function ProfileEditor() {
  return (
    <Card className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Display Name</Label>
          <Input defaultValue="Marcus Steel Johnson" />
        </div>
        <div>
          <Label>Ring Name</Label>
          <Input defaultValue="Marcus Steel" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Nickname</Label>
          <Input defaultValue="The Anvil" />
        </div>
        <div>
          <Label>Booking Email</Label>
          <Input type="email" defaultValue="marcus.steel@pwrscout.demo" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Sport</Label>
          <Select defaultValue="wrestling">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPORTS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Weight Class</Label>
          <Input defaultValue="Heavyweight" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <Label>Height (cm)</Label>
          <Input type="number" defaultValue={188} />
        </div>
        <div>
          <Label>Weight (kg)</Label>
          <Input type="number" defaultValue={118} />
        </div>
        <div>
          <Label>Reach (cm)</Label>
          <Input type="number" defaultValue={198} />
        </div>
        <div>
          <Label>Experience (yrs)</Label>
          <Input type="number" defaultValue={12} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>City</Label>
          <Input defaultValue="Chicago" />
        </div>
        <div>
          <Label>Country</Label>
          <Input defaultValue="USA" />
        </div>
      </div>
      <div>
        <Label>Availability</Label>
        <Select defaultValue="free_agent">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CAREER_STATUS.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Bio</Label>
        <Textarea
          rows={5}
          defaultValue="Powerhouse brawler with 12 years on the independent scene..."
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Wins</Label>
          <Input type="number" defaultValue={142} />
        </div>
        <div>
          <Label>Losses</Label>
          <Input type="number" defaultValue={38} />
        </div>
        <div>
          <Label>Draws</Label>
          <Input type="number" defaultValue={5} />
        </div>
      </div>
      <div>
        <Label>Instagram</Label>
        <Input defaultValue="marcussteel" />
      </div>
      <Button>Save Profile</Button>
      <p className="text-xs text-muted-foreground">
        User-generated profiles sync to Supabase when configured. Catalog data loads from live APIs.
      </p>
    </Card>
  );
}
