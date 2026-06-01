import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MarketingPageHero } from "@/components/layout/marketing-page-hero";
import { MarketingContent } from "@/components/layout/marketing-content";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PWR Scout team.",
};

export default function ContactPage() {
  return (
    <div className="page-shell">
      <MarketingPageHero
        variant="solid"
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
            <MessageSquare className="h-3.5 w-3.5" />
            Get in touch
          </span>
        }
        title={
          <>
            Contact <span className="text-gradient">PWR Scout</span>
          </>
        }
        description="Questions about scouting, bookings, verification, or enterprise plans — we respond within 24 hours."
        stats={[
          { value: "24h", label: "Response" },
          { value: "Mon–Fri", label: "Support hours" },
          { value: "Global", label: "Talent network" },
        ]}
      />
      <MarketingContent>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-4 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "hello@pwrscout.com" },
              { icon: MapPin, label: "HQ", value: "Las Vegas, NV" },
              { icon: MessageSquare, label: "Support", value: "Mon–Fri, 9am–6pm PT" },
            ].map((item) => (
              <Card
                key={item.label}
                className="p-4 sm:p-5 flex gap-4 items-start bg-muted/50 border-border"
              >
                <item.icon className="h-5 w-5 text-pwr-red shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-white">{item.value}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </MarketingContent>
    </div>
  );
}
