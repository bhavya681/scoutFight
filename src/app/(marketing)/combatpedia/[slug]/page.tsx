import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { CombatpediaShell } from "@/components/combatpedia/combatpedia-shell";
import { CombatpediaArticleTabs } from "@/components/combatpedia/combatpedia-article-tabs";
import { getCombatpediaEntry } from "@/lib/combatpedia/service";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getCombatpediaEntry(slug);
  return {
    title: detail ? `${detail.article.title} — Combatpedia` : `Combatpedia — ${slug}`,
    description: detail?.article.extract?.slice(0, 160),
  };
}

export default async function CombatpediaArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const detail = await getCombatpediaEntry(slug);

  if (!detail) notFound();

  return (
    <CombatpediaShell>
      <div className="page-container py-6 sm:py-10">
        <Link
          href="/combatpedia"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-[#7b1113] dark:hover:text-[#ff6b6e] mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Combatpedia home
        </Link>

        <CombatpediaArticleTabs detail={detail} />
      </div>
    </CombatpediaShell>
  );
}
