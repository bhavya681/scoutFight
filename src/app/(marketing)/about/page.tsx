import type { Metadata } from "next";
import Link from "next/link";
import { Target, Globe, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  APP_MISSION,
  APP_TAGLINE,
  APP_TAGLINE_LONG,
  APP_NAME,
  PLATFORM_PHILOSOPHY,
  PLATFORM_OBJECTIVES,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: APP_MISSION,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-pwr-red font-semibold text-sm uppercase tracking-widest mb-2">
        About {APP_NAME}
      </p>
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide mb-2">
        {APP_NAME}
      </h1>
      <p className="text-pwr-red font-semibold uppercase tracking-[0.2em] text-sm mb-4">
        {APP_TAGLINE}
      </p>
      <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-2xl">
        {APP_TAGLINE_LONG}
      </p>
      <p className="text-lg text-muted-foreground leading-relaxed mb-8">{APP_MISSION}</p>

      <Card className="p-6 mb-12 border-pwr-red/20">
        <h2 className="font-display font-bold uppercase mb-3">Why we exist</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {PLATFORM_PHILOSOPHY.problem}
        </p>
        <p className="text-sm text-foreground leading-relaxed">{PLATFORM_PHILOSOPHY.purpose}</p>
        <p className="text-sm font-medium text-pwr-red mt-4">{PLATFORM_PHILOSOPHY.mission}</p>
        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          {PLATFORM_OBJECTIVES.map((o) => (
            <li key={o}>• {o}</li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {[
          {
            icon: Target,
            title: "Our Vision",
            text: "Become the definitive global infrastructure for combat sports talent — where every deal, discovery, and career move starts.",
          },
          {
            icon: Globe,
            title: "Global Reach",
            text: "One platform for wrestling, MMA, boxing, kickboxing, Muay Thai, grappling, BJJ, and the professionals who power the industry.",
          },
          {
            icon: Users,
            title: "Who We Serve",
            text: "Talent, recruiters, matchmakers, promoters, scouts, managers, and event organizers — B2B and B2C.",
          },
          {
            icon: Zap,
            title: "Core Value",
            text: "Transfermarkt + LinkedIn + IMDb — built exclusively for combat sports.",
          },
        ].map((item) => (
          <Card key={item.title} className="p-6">
            <item.icon className="h-8 w-8 text-pwr-red mb-4" />
            <h2 className="font-display font-bold uppercase mb-2">{item.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
          </Card>
        ))}
      </div>

      <Card className="p-8 text-center">
        <h2 className="font-display text-2xl font-bold uppercase mb-4">
          Ready to transform how you scout?
        </h2>
        <Button size="lg" asChild>
          <Link href="/discover">Start scouting free</Link>
        </Button>
      </Card>
    </div>
  );
}
