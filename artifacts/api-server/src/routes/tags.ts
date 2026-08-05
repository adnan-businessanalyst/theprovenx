import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, tagsTable, questionTagsTable, questionsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/tags", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: tagsTable.id,
      slug: tagsTable.slug,
      name: tagsTable.name,
      description: tagsTable.description,
      questionCount: sql<number>`count(${questionsTable.id}) filter (where ${questionsTable.isDeleted} = false and ${questionsTable.status} = 'published')::int`,
    })
    .from(tagsTable)
    .leftJoin(questionTagsTable, eq(questionTagsTable.tagId, tagsTable.id))
    .leftJoin(questionsTable, eq(questionTagsTable.questionId, questionsTable.id))
    .groupBy(tagsTable.id)
    .orderBy(desc(sql`count(${questionsTable.id})`));
  res.json(rows);
});

export default router;
