import { redirect } from "next/navigation";
import { getNewsArticles } from "@/lib/data/talent-repository";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const articles = await getNewsArticles();
  const article = articles.find((a) => a.slug === slug);
  if (article?.externalUrl) {
    redirect(article.externalUrl);
  }
  redirect("/news");
}
