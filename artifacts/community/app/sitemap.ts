import type { MetadataRoute } from "next";
import { fetchSitemapEntries } from "@/lib/api-server";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { questions, users } = await fetchSitemapEntries();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/products"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/tags"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: absoluteUrl("/search"), lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: absoluteUrl("/contributors"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];

  const questionRoutes: MetadataRoute.Sitemap = questions.map((q) => ({
    url: absoluteUrl(`/questions/${encodeURIComponent(q.slug)}`),
    lastModified: q.updatedAt ? new Date(q.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const userRoutes: MetadataRoute.Sitemap = users.map((u) => ({
    url: absoluteUrl(`/users/${encodeURIComponent(u.username)}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...questionRoutes, ...userRoutes];
}
