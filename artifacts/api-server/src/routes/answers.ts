import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, answersTable, questionsTable } from "@workspace/db";
import { VoteAnswerBody } from "@workspace/api-zod";
import { requireAuth } from "../lib/currentUser";
import { applyVote } from "../lib/voting";
import { addReputation, REP } from "../lib/reputation";
import { notifyUser } from "../lib/notify";
import { serializeAnswers } from "../lib/serialize";
import { voteLimiter } from "../lib/rateLimits";

const router: IRouter = Router();

router.post("/answers/:id/vote", requireAuth, voteLimiter, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const parsed = VoteAnswerBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid vote" });
    return;
  }
  const [answer] = await db
    .select()
    .from(answersTable)
    .where(and(eq(answersTable.id, id), eq(answersTable.isDeleted, false)));
  if (!answer) {
    res.status(404).json({ message: "Answer not found" });
    return;
  }
  if (answer.authorId === req.localUser!.id) {
    res.status(400).json({ message: "You cannot vote on your own answer" });
    return;
  }
  const score = await applyVote({
    userId: req.localUser!.id,
    targetType: "answer",
    targetId: id,
    value: parsed.data.value,
    authorId: answer.authorId,
  });
  res.json({ score: score ?? answer.score, myVote: parsed.data.value });
});

router.post("/answers/:id/accept", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (!Number.isFinite(id)) {
    res.status(400).json({ message: "Invalid id" });
    return;
  }
  const [answer] = await db
    .select()
    .from(answersTable)
    .where(and(eq(answersTable.id, id), eq(answersTable.isDeleted, false)));
  if (!answer) {
    res.status(404).json({ message: "Answer not found" });
    return;
  }
  const [question] = await db
    .select()
    .from(questionsTable)
    .where(eq(questionsTable.id, answer.questionId));
  if (!question || question.authorId !== req.localUser!.id) {
    res.status(403).json({ message: "Only the question author can accept an answer" });
    return;
  }

  const previousAcceptedId = question.acceptedAnswerId;
  if (previousAcceptedId === id) {
    // Un-accept
    await db.update(answersTable).set({ isAccepted: false }).where(eq(answersTable.id, id));
    await db
      .update(questionsTable)
      .set({ acceptedAnswerId: null })
      .where(eq(questionsTable.id, question.id));
    await addReputation(answer.authorId, -REP.accepted);
  } else {
    if (previousAcceptedId) {
      const [prev] = await db
        .select()
        .from(answersTable)
        .where(eq(answersTable.id, previousAcceptedId));
      await db
        .update(answersTable)
        .set({ isAccepted: false })
        .where(eq(answersTable.id, previousAcceptedId));
      if (prev) await addReputation(prev.authorId, -REP.accepted);
    }
    await db
    .update(answersTable)
    .set({ isAccepted: true, acceptedAt: new Date() })
    .where(eq(answersTable.id, id));
    await db
      .update(questionsTable)
      .set({ acceptedAnswerId: id })
      .where(eq(questionsTable.id, question.id));
    if (answer.authorId !== req.localUser!.id) {
      await addReputation(answer.authorId, REP.accepted);
      await notifyUser({
        userId: answer.authorId,
        type: "answer_accepted",
        message: `Your answer on "${question.title}" was accepted`,
        link: `/questions/${question.slug}`,
      });
    }
  }

  const [fresh] = await db.select().from(answersTable).where(eq(answersTable.id, id));
  const [serialized] = await serializeAnswers([fresh], new Map(), req.localUser!.id);
  res.json(serialized);
});

export default router;
