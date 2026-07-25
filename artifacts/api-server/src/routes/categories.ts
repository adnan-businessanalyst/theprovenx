import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, categoriesTable, questionsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: categoriesTable.id,
      slug: categoriesTable.slug,
      name: categoriesTable.name,
      description: categoriesTable.description,
      questionCount: sql<number>`count(${questionsTable.id}) filter (where ${questionsTable.isDeleted} = false)::int`,
    })
    .from(categoriesTable)
    .leftJoin(questionsTable, eq(questionsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(desc(sql`count(${questionsTable.id})`), categoriesTable.name);
  res.json(rows);
});

export default router;
