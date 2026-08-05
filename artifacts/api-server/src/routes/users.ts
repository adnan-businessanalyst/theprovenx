import { Router, type IRouter } from "express";
import { eq, desc, and, inArray, sql } from "drizzle-orm";
import {
  db,
  usersTable,
  questionsTable,
  answersTable,
  questionTagsTable,
  tagsTable,
} from "@workspace/db";
import { ListTopUsersQueryParams } from "@workspace/api-zod";
import { serializeUsers, serializeUser, serializeQuestions, type ApiUser } from "../lib/serialize";

const router: IRouter = Router();

function badges(u: ApiUser): string[] {
  const out: string[] = [];
  if (u.reputation >= 1000) out.push("expert");
  else if (u.reputation >= 250) out.push("trusted");
  else if (u.reputation >= 50) out.push("contributor");
  if (u.acceptedAnswerCount >= 10) out.push("problem-solver");
  else if (u.acceptedAnswerCount >= 1) out.push("first-accept");
  if (u.questionCount >= 10) out.push("curious");
  if (u.role === "moderator" || u.role === "admin" || u.role === "platform_owner") out.push(u.role);
  return out;
}

router.get("/users/top", async (req, res): Promise<void> => {
  const q = ListTopUsersQueryParams.safeParse(req.query);
  const limit = q.success ? (q.data.limit ?? 20) : 20;
  const rows = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.isSuspended, false))
    .orderBy(desc(usersTable.reputation))
    .limit(Math.min(limit, 100));
  const map = await serializeUsers(rows);
  res.json(rows.map((r) => map.get(r.id)));
});

router.get("/users/top-verifiers", async (_req, res): Promise<void> => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const rows = await db
    .select({
      authorId: answersTable.authorId,
      verifiedCount: sql<number>`count(*)::int`,
    })
    .from(answersTable)
    .where(
      and(
        eq(answersTable.isAccepted, true),
        eq(answersTable.isDeleted, false),
        sql`${answersTable.acceptedAt} >= ${since}`,
      ),
    )
    .groupBy(answersTable.authorId)
    .orderBy(desc(sql`count(*)`))
    .limit(5);
  if (rows.length === 0) {
    res.json([]);
    return;
  }
  const users = await db
    .select()
    .from(usersTable)
    .where(
      and(
        inArray(usersTable.id, rows.map((r) => r.authorId)),
        eq(usersTable.isSuspended, false),
      ),
    );
  const map = await serializeUsers(users);
  res.json(
    rows
      .filter((r) => map.has(r.authorId))
      .map((r) => ({ user: map.get(r.authorId), verifiedCount: r.verifiedCount })),
  );
});

router.get("/users/:username", async (req, res): Promise<void> => {
  const username = String(req.params.username);
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const apiUser = await serializeUser(user);

  const topTags = await db
    .select({
      id: tagsTable.id,
      slug: tagsTable.slug,
      name: tagsTable.name,
      description: tagsTable.description,
      questionCount: sql<number>`count(*)::int`,
    })
    .from(questionTagsTable)
    .innerJoin(tagsTable, eq(questionTagsTable.tagId, tagsTable.id))
    .innerJoin(questionsTable, eq(questionTagsTable.questionId, questionsTable.id))
    .where(
      and(
        eq(questionsTable.authorId, user.id),
        eq(questionsTable.isDeleted, false),
        eq(questionsTable.status, "published"),
      ),
    )
    .groupBy(tagsTable.id)
    .orderBy(desc(sql`count(*)`))
    .limit(5);

  const recentQuestions = await db
    .select()
    .from(questionsTable)
    .where(
      and(
        eq(questionsTable.authorId, user.id),
        eq(questionsTable.isDeleted, false),
        eq(questionsTable.status, "published"),
      ),
    )
    .orderBy(desc(questionsTable.createdAt))
    .limit(5);

  const recentAnswers = await db
    .select({
      answer: answersTable,
      qSlug: questionsTable.slug,
      qTitle: questionsTable.title,
      qId: questionsTable.id,
    })
    .from(answersTable)
    .innerJoin(questionsTable, eq(answersTable.questionId, questionsTable.id))
    .where(and(eq(answersTable.authorId, user.id), eq(answersTable.isDeleted, false)))
    .orderBy(desc(answersTable.createdAt))
    .limit(5);

  res.json({
    user: apiUser,
    badges: badges(apiUser),
    topTags,
    recentQuestions: await serializeQuestions(recentQuestions, req.localUser?.id),
    recentAnswers: recentAnswers.map((r) => ({
      type: r.answer.isAccepted ? "accepted" : "answer",
      questionId: r.qId,
      questionSlug: r.qSlug,
      questionTitle: r.qTitle,
      score: r.answer.score,
      createdAt: r.answer.createdAt.toISOString(),
    })),
  });
});

router.get("/users/:username/activity", async (req, res): Promise<void> => {
  const username = String(req.params.username);
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const questions = await db
    .select()
    .from(questionsTable)
    .where(
      and(
        eq(questionsTable.authorId, user.id),
        eq(questionsTable.isDeleted, false),
        eq(questionsTable.status, "published"),
      ),
    )
    .orderBy(desc(questionsTable.createdAt))
    .limit(20);

  const answers = await db
    .select({
      answer: answersTable,
      qSlug: questionsTable.slug,
      qTitle: questionsTable.title,
      qId: questionsTable.id,
    })
    .from(answersTable)
    .innerJoin(questionsTable, eq(answersTable.questionId, questionsTable.id))
    .where(and(eq(answersTable.authorId, user.id), eq(answersTable.isDeleted, false)))
    .orderBy(desc(answersTable.createdAt))
    .limit(20);

  const items = [
    ...questions.map((q) => ({
      type: "question" as string,
      questionId: q.id,
      questionSlug: q.slug,
      questionTitle: q.title,
      score: q.score,
      createdAt: q.createdAt.toISOString(),
    })),
    ...answers.map((r) => ({
      type: (r.answer.isAccepted ? "accepted" : "answer") as string,
      questionId: r.qId,
      questionSlug: r.qSlug,
      questionTitle: r.qTitle,
      score: r.answer.score,
      createdAt: r.answer.createdAt.toISOString(),
    })),
  ]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 20);

  res.json(items);
});

export default router;
