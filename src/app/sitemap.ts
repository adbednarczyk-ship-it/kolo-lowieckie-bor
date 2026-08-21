import type { MetadataRoute } from "next";
import { getPublishedNews } from "@/lib/cms";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getPublishedNews();
  const articles = news.map((item) => ({
    url: `${siteUrl}/aktualnosci/${item.slug}`,
    lastModified: new Date(item.published_on),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/polityka-prywatnosci`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...articles,
  ];
}
