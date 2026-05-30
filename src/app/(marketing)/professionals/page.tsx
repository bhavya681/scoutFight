import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CountryFlag } from "@/components/ui/country-flag";
import { getAllProfessionals } from "@/lib/data/professional-repository";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TALENT_CATEGORIES } from "@/lib/constants";

export const revalidate = 3600;

export default async function ProfessionalsPage() {
  const professionals = await getAllProfessionals();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 pb-20">
      <p className="section-label mb-2">Industry professionals</p>
      <h1 className="section-title text-3xl sm:text-4xl mb-3">Combat sports professionals</h1>
      <p className="text-muted-foreground max-w-2xl mb-10">
        Referees, announcers, commentators, coaches, and managers — discovered from Wikipedia and Wikidata APIs.
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {TALENT_CATEGORIES.professionals.map((p) => (
          <Badge key={p.id} variant="outline">
            {p.label}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.map((pro) => (
          <Link key={pro.id} href={`/professionals/${pro.slug}`}>
            <Card className="p-5 h-full hover:border-pwr-red/40 transition-all flex gap-4">
              <UserAvatar
                name={pro.displayName}
                src={pro.avatarUrl}
                size="md"
                shape="rounded"
                placeholderVariant="official"
              />
              <div className="min-w-0">
                <h2 className="font-semibold truncate">{pro.displayName}</h2>
                <Badge variant="secondary" className="mt-1 capitalize">{pro.role}</Badge>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{pro.bio}</p>
                <CountryFlag
                  nationality={pro.nationality}
                  countryCode={pro.countryCode}
                  size="xs"
                  showLabel
                  className="text-xs text-muted-foreground mt-2"
                />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
