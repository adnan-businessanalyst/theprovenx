import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db, questionsTable, tagsTable } from "@workspace/db";

const router: IRouter = Router();

// Served at /sitemap.xml (site root; the platform routes this path to the API server)
router.get("/sitemap.xml", async (req, res): Promise<void> => {
  const host = req.get("x-forwarded-host") ?? req.get("host") ?? "";
  const origin = `https://${host}`;

  const questions = await db
    .select({ slug: questionsTable.slug, updatedAt: questionsTable.updatedAt })
    .from(questionsTable)
    .where(
      and(eq(questionsTable.isDeleted, false), eq(questionsTable.status, "published")),
    )
    .orderBy(desc(questionsTable.updatedAt))
    .limit(5000);
  const tags = await db.select({ slug: tagsTable.slug }).from(tagsTable);

  const urls: string[] = [
    `<url><loc>${origin}/</loc><changefreq>hourly</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${origin}/tags</loc><changefreq>daily</changefreq></url>`,
    `<url><loc>${origin}/contributors</loc><changefreq>daily</changefreq></url>`,
    ...questions.map(
      (q) =>
        `<url><loc>${origin}/questions/${encodeURIComponent(q.slug)}</loc><lastmod>${q.updatedAt.toISOString()}</lastmod></url>`,
    ),
    ...tags.map((t) => `<url><loc>${origin}/?tag=${encodeURIComponent(t.slug)}</loc></url>`),
  ];

  res
    .type("application/xml")
    .send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
    );
});

export default router;
