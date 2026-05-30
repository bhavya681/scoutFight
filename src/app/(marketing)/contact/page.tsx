import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PWR Scout team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide">
        Contact
      </h1>
      <p className="text-muted-foreground mt-2 mb-10 max-w-xl">
        Questions about scouting, bookings, verification, or enterprise plans — we respond within 24 hours.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "hello@pwrscout.com" },
            { icon: MapPin, label: "HQ", value: "Las Vegas, NV" },
            { icon: MessageSquare, label: "Support", value: "Mon–Fri, 9am–6pm PT" },
          ].map((item) => (
            <Card key={item.label} className="p-4 flex gap-4 items-start">
              <item.icon className="h-5 w-5 text-pwr-red shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-2">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
