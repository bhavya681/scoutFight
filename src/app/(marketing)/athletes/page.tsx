import { redirect } from "next/navigation";
import type { DiscoverSearchParams } from "@/lib/data/discover-query";

interface PageProps {
  searchParams: Promise<DiscoverSearchParams>;
}

/** Directory listing lives at /discover only */
export default async function AthletesDirectoryRedirect({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    qs.set(key, String(value));
  }

  const query = qs.toString();
  redirect(query ? `/discover?${query}` : "/discover");
}
