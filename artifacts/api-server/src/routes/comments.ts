import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, commentsTable, questionsTable, answersTable } from "@workspace/db";
import { CreateCommentBody } from "@workspace/api-zod";
import { requireAuth } from "../lib/currentUser";
import { serializeUser } from "../lib/serialize";
import { notifyUser } from "../lib/notify";
import { writeLimiter } from "../lib/rateLimits";

const router: IRouter = Router();

router.post("/comments", requireAuth, writeLimiter, async (req, res): Promise<void> => {
  const parsed = CreateCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  if (parsed.data.website) {
    res.status(400).json({ message: "Submission rejected" });
    return;
  }
  const { parentType, parentId, body } = parsed.data;

  let notifyTarget: { userId: number; slug: string; title: string } | null = null;
  if (parentType === "question") {
    const [q] = await db
      .select()
      .from(questionsTable)
      .where(and(eq(questionsTable.id, parentId), eq(questionsTable.isDeleted, false)));
    if (!q) {
      res.status(404).json({ message: "Question not found" });
      return;
    }
    notifyTarget = { userId: q.authorId, slug: q.slug, title: q.title };
  } else {
    const [a] = await db
      .select()
      .from(answersTable)
      .where(and(eq(answersTable.id, parentId), eq(answersTable.isDeleted, false)));
    if (!a) {
      res.status(404).json({ message: "Answer not found" });
      return;
    }
    const [q] = await db
      .select()
      .from(questionsTable)
      .where(eq(questionsTable.id, a.questionId));
    if (q) notifyTarget = { userId: a.authorId, slug: q.slug, title: q.title };
  }

  const [comment] = await db
    .insert(commentsTable)
    .values({ parentType, parentId, body, authorId: req.localUser!.id })
    .returning();

  if (notifyTarget && notifyTarget.userId !== req.localUser!.id) {
    await notifyUser({
      userId: notifyTarget.userId,
      type: "new_comment",
      message: `${req.localUser!.displayName} commented on "${notifyTarget.title}"`,
      link: `/questions/${notifyTarget.slug}`,
    });
  }

  res.status(201).json({
    id: comment.id,
    parentType: comment.parentType,
    parentId: comment.parentId,
    body: comment.body,
    author: await serializeUser(req.localUser!),
    createdAt: comment.createdAt.toISOString(),
  });
});

export default router;
