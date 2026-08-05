import { Router, type IRouter } from "express";
import { and, eq, sql } from "drizzle-orm";
import { db, questionsTable, answersTable, usersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [{ questionCount, answeredCount }] = await db
    .select({
      questionCount: sql<number>`count(*)::int`,
      answeredCount: sql<number>`count(*) filter (where exists (select 1 from answers a where a.question_id = ${questionsTable.id} and a.is_deleted = false))::int`,
    })
    .from(questionsTable)
    .where(
      and(eq(questionsTable.isDeleted, false), eq(questionsTable.status, "published")),
    );
  const [{ answerCount }] = await db
    .select({ answerCount: sql<number>`count(*)::int` })
    .from(answersTable)
    .where(eq(answersTable.isDeleted, false));
  const [{ userCount }] = await db
    .select({ userCount: sql<number>`count(*)::int` })
    .from(usersTable);

  res.json({
    questionCount,
    answerCount,
    userCount,
    answeredRate: questionCount > 0 ? answeredCount / questionCount : 0,
  });
});

export default router;
