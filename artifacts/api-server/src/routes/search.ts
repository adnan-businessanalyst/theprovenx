import { Router, type IRouter } from "express";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db, questionsTable, tagsTable, questionTagsTable } from "@workspace/db";
import { SearchQuestionsQueryParams } from "@workspace/api-zod";
import { serializeQuestions } from "../lib/serialize";

const router: IRouter = Router();

router.get("/search", async (req, res): Promise<void> => {
  const parsed = SearchQuestionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  const { q, tag, unanswered, page = 1, pageSize = 20 } = parsed.data;
  const size = Math.min(pageSize, 50);

  const conditions = [
    eq(questionsTable.isDeleted, false),
    eq(questionsTable.status, "published"),
  ];
  if (q && q.trim()) {
    conditions.push(
      sql`to_tsvector('simple', ${questionsTable.title} || ' ' || ${questionsTable.body}) @@ websearch_to_tsquery('simple', ${q.trim()})`,
    );
  }
  if (tag) {
    const [tagRow] = await db
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.slug, String(tag).toLowerCase()));
    if (!tagRow) {
      res.json({ items: [], total: 0, page, pageSize: size });
      return;
    }
    const qids = await db
      .select({ id: questionTagsTable.questionId })
      .from(questionTagsTable)
      .where(eq(questionTagsTable.tagId, tagRow.id));
    if (qids.length === 0) {
      res.json({ items: [], total: 0, page, pageSize: size });
      return;
    }
    conditions.push(inArray(questionsTable.id, qids.map((r) => r.id)));
  }
  if (unanswered) {
    conditions.push(
      sql`not exists (select 1 from answers a where a.question_id = ${questionsTable.id} and a.is_deleted = false)`,
    );
  }

  const where = and(...conditions);
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(questionsTable)
    .where(where);

  const rows = await db
    .select()
    .from(questionsTable)
    .where(where)
    .orderBy(
      ...(q && q.trim()
        ? [
            desc(
              sql`ts_rank(to_tsvector('simple', ${questionsTable.title} || ' ' || ${questionsTable.body}), websearch_to_tsquery('simple', ${q.trim()}))`,
            ),
          ]
        : [desc(questionsTable.score)]),
      desc(questionsTable.createdAt),
    )
    .limit(size)
    .offset((page - 1) * size);

  res.json({
    items: await serializeQuestions(rows, req.localUser?.id),
    total,
    page,
    pageSize: size,
  });
});

export default router;
