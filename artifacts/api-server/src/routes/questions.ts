import { Router, type IRouter } from "express";
import { and, desc, asc, eq, inArray, sql, ne } from "drizzle-orm";
import {
  db,
  questionsTable,
  answersTable,
  commentsTable,
  usersTable,
  tagsTable,
  questionTagsTable,
  categoriesTable,
} from "@workspace/db";
import {
  ListQuestionsQueryParams,
  CreateQuestionBody,
  VoteQuestionBody,
  CreateAnswerBody,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/currentUser";
import {
  serializeQuestions,
  serializeAnswers,
  serializeUsers,
} from "../lib/serialize";
import { applyVote } from "../lib/voting";
import { notifyUser } from "../lib/notify";
import { askLimiter, writeLimiter, voteLimiter } from "../lib/rateLimits";

const router: IRouter = Router();

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${base || "question"}-${Math.random().toString(36).slice(2, 8)}`;
}

async function ensureTags(names: string[]): Promise<number[]> {
  const ids: number[] = [];
  for (const raw of names) {
    const name = raw.trim().toLowerCase().slice(0, 35);
    if (!name) continue;
    const slug = name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
    if (!slug) continue;
    const [existing] = await db.select().from(tagsTable).where(eq(tagsTable.slug, slug));
    if (existing) {
      ids.push(existing.id);
    } else {
      const [created] = await db
        .insert(tagsTable)
        .values({ slug, name })
        .onConflictDoNothing()
        .returning();
      if (created) ids.push(created.id);
      else {
        const [raced] = await db.select().from(tagsTable).where(eq(tagsTable.slug, slug));
        if (raced) ids.push(raced.id);
      }
    }
  }
  return [...new Set(ids)];
}

router.get("/questions", async (req, res): Promise<void> => {
  const parsed = ListQuestionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  const { sort = "newest", tag, category, page = 1, pageSize = 20 } = parsed.data;
  const size = Math.min(pageSize, 50);

  const conditions = [eq(questionsTable.isDeleted, false)];
  if (category) {
    const [categoryRow] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.slug, category.toLowerCase()));
    if (!categoryRow) {
      res.json({ items: [], total: 0, page, pageSize: Math.min(pageSize, 50) });
      return;
    }
    conditions.push(eq(questionsTable.categoryId, categoryRow.id));
  }
  if (tag) {
    const [tagRow] = await db
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.slug, tag.toLowerCase()));
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
  if (sort === "unanswered") {
    conditions.push(
      sql`not exists (select 1 from answers a where a.question_id = ${questionsTable.id} and a.is_deleted = false)`,
    );
  }

  const where = and(...conditions);
  const orderBy =
    sort === "votes"
      ? [desc(questionsTable.score), desc(questionsTable.createdAt)]
      : sort === "active"
        ? [desc(questionsTable.updatedAt)]
        : [desc(questionsTable.createdAt)];

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(questionsTable)
    .where(where);
  const rows = await db
    .select()
    .from(questionsTable)
    .where(where)
    .orderBy(...orderBy)
    .limit(size)
    .offset((page - 1) * size);

  res.json({
    items: await serializeQuestions(rows, req.localUser?.id),
    total,
    page,
    pageSize: size,
  });
});

router.get("/questions/featured", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(questionsTable)
    .where(and(eq(questionsTable.isFeatured, true), eq(questionsTable.isDeleted, false)))
    .orderBy(desc(questionsTable.updatedAt))
    .limit(5);
  res.json(await serializeQuestions(rows, req.localUser?.id));
});

router.post("/questions", requireAuth, askLimiter, async (req, res): Promise<void> => {
  const parsed = CreateQuestionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  if (parsed.data.website) {
    res.status(400).json({ message: "Submission rejected" });
    return;
  }
  const [categoryRow] = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.slug, parsed.data.categorySlug.toLowerCase()));
  if (!categoryRow) {
    res.status(400).json({ message: "Unknown category" });
    return;
  }
  const [question] = await db
    .insert(questionsTable)
    .values({
      slug: slugify(parsed.data.title),
      title: parsed.data.title,
      body: parsed.data.body,
      language: parsed.data.language ?? "en",
      authorId: req.localUser!.id,
      categoryId: categoryRow.id,
    })
    .returning();

  const tagIds = await ensureTags(parsed.data.tags);
  if (tagIds.length > 0) {
    await db
      .insert(questionTagsTable)
      .values(tagIds.map((tagId) => ({ questionId: question.id, tagId })))
      .onConflictDoNothing();
  }

  const [serialized] = await serializeQuestions([question], req.localUser!.id);
  res.status(201).json(serialized);
});

router.get("/questions/:slug", async (req, res): Promise<void> => {
  const slug = String(req.params.slug);
  const [question] = await db
    .select()
    .from(questionsTable)
    .where(and(eq(questionsTable.slug, slug), eq(questionsTable.isDeleted, false)));
  if (!question) {
    res.status(404).json({ message: "Question not found" });
    return;
  }

  // Count the view (fire-and-forget semantics but awaited for simplicity)
  await db
    .update(questionsTable)
    .set({ viewCount: sql`${questionsTable.viewCount} + 1`, updatedAt: question.updatedAt })
    .where(eq(questionsTable.id, question.id));
  question.viewCount += 1;

  const answers = await db
    .select()
    .from(answersTable)
    .where(and(eq(answersTable.questionId, question.id), eq(answersTable.isDeleted, false)))
    .orderBy(desc(answersTable.isAccepted), desc(answersTable.score), asc(answersTable.createdAt));

  const parentIds = [question.id, ...answers.map((a) => a.id)];
  const comments = await db
    .select()
    .from(commentsTable)
    .where(inArray(commentsTable.parentId, parentIds))
    .orderBy(asc(commentsTable.createdAt));

  const commentAuthorIds = [...new Set(comments.map((c) => c.authorId))];
  const commentAuthors = commentAuthorIds.length
    ? await db.select().from(usersTable).where(inArray(usersTable.id, commentAuthorIds))
    : [];
  const authorMap = await serializeUsers(commentAuthors);
  const serializeComment = (c: (typeof comments)[number]) => ({
    id: c.id,
    parentType: c.parentType,
    parentId: c.parentId,
    body: c.body,
    author: authorMap.get(c.authorId),
    createdAt: c.createdAt.toISOString(),
  });

  const questionComments = comments
    .filter((c) => c.parentType === "question" && c.parentId === question.id)
    .map(serializeComment);
  const commentsByAnswer = new Map<number, Record<string, unknown>[]>();
  for (const c of comments.filter((c) => c.parentType === "answer")) {
    commentsByAnswer.set(c.parentId, [
      ...(commentsByAnswer.get(c.parentId) ?? []),
      serializeComment(c),
    ]);
  }

  const [serializedQuestion] = await serializeQuestions([question], req.localUser?.id);
  res.json({
    question: serializedQuestion,
    answers: await serializeAnswers(answers, commentsByAnswer, req.localUser?.id),
    comments: questionComments,
  });
});

router.post("/questions/:id/vote", requireAuth, voteLimiter, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const parsed = VoteQuestionBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid vote" });
    return;
  }
  const [question] = await db
    .select()
    .from(questionsTable)
    .where(and(eq(questionsTable.id, id), eq(questionsTable.isDeleted, false)));
  if (!question) {
    res.status(404).json({ message: "Question not found" });
    return;
  }
  if (question.authorId === req.localUser!.id) {
    res.status(400).json({ message: "You cannot vote on your own question" });
    return;
  }
  const score = await applyVote({
    userId: req.localUser!.id,
    targetType: "question",
    targetId: id,
    value: parsed.data.value,
    authorId: question.authorId,
  });
  res.json({ score: score ?? question.score, myVote: parsed.data.value });
});

router.post("/questions/:id/answers", requireAuth, writeLimiter, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const parsed = CreateAnswerBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid answer" });
    return;
  }
  if (parsed.data.website) {
    res.status(400).json({ message: "Submission rejected" });
    return;
  }
  const [question] = await db
    .select()
    .from(questionsTable)
    .where(and(eq(questionsTable.id, id), eq(questionsTable.isDeleted, false)));
  if (!question) {
    res.status(404).json({ message: "Question not found" });
    return;
  }
  const [answer] = await db
    .insert(answersTable)
    .values({
      questionId: id,
      authorId: req.localUser!.id,
      body: parsed.data.body,
      language: parsed.data.language ?? "en",
    })
    .returning();
  // bump question activity
  await db
    .update(questionsTable)
    .set({ updatedAt: new Date() })
    .where(eq(questionsTable.id, id));

  if (question.authorId !== req.localUser!.id) {
    await notifyUser({
      userId: question.authorId,
      type: "new_answer",
      message: `${req.localUser!.displayName} answered your question "${question.title}"`,
      link: `/questions/${question.slug}`,
    });
  }

  const [serialized] = await serializeAnswers([answer], new Map(), req.localUser!.id);
  res.status(201).json(serialized);
});

router.get("/questions/:id/related", async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (!Number.isFinite(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const tagIds = (
    await db
      .select({ tagId: questionTagsTable.tagId })
      .from(questionTagsTable)
      .where(eq(questionTagsTable.questionId, id))
  ).map((r) => r.tagId);
  if (tagIds.length === 0) {
    res.json([]);
    return;
  }
  const relatedIds = await db
    .select({ id: questionTagsTable.questionId, hits: sql<number>`count(*)::int` })
    .from(questionTagsTable)
    .where(and(inArray(questionTagsTable.tagId, tagIds), ne(questionTagsTable.questionId, id)))
    .groupBy(questionTagsTable.questionId)
    .orderBy(desc(sql`count(*)`))
    .limit(6);
  if (relatedIds.length === 0) {
    res.json([]);
    return;
  }
  const rows = await db
    .select()
    .from(questionsTable)
    .where(
      and(
        inArray(questionsTable.id, relatedIds.map((r) => r.id)),
        eq(questionsTable.isDeleted, false),
      ),
    )
    .orderBy(desc(questionsTable.score))
    .limit(5);
  res.json(await serializeQuestions(rows, req.localUser?.id));
});

export default router;
