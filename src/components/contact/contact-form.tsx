"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <Card className="p-8 text-center">
        <p className="font-semibold text-lg">Message sent!</p>
        <p className="text-muted-foreground mt-2">We&apos;ll get back to you soon.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" required />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={5} required />
        </div>
        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </Card>
  );
}
