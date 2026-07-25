import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, flagsTable, questionsTable, answersTable, commentsTable } from "@workspace/db";
import { CreateFlagBody } from "@workspace/api-zod";
import { requireAuth } from "../lib/currentUser";
import { writeLimiter } from "../lib/rateLimits";

const router: IRouter = Router();

router.post("/flags", requireAuth, writeLimiter, async (req, res): Promise<void> => {
  const parsed = CreateFlagBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  const { contentType, contentId, reason } = parsed.data;

  // Verify target exists
  let exists = false;
  if (contentType === "question") {
    const [q] = await db.select().from(questionsTable).where(eq(questionsTable.id, contentId));
    exists = !!q && !q.isDeleted;
  } else if (contentType === "answer") {
    const [a] = await db.select().from(answersTable).where(eq(answersTable.id, contentId));
    exists = !!a && !a.isDeleted;
  } else {
    const [c] = await db.select().from(commentsTable).where(eq(commentsTable.id, contentId));
    exists = !!c;
  }
  if (!exists) {
    res.status(404).json({ message: "Content not found" });
    return;
  }

  await db.insert(flagsTable).values({
    reporterId: req.localUser!.id,
    targetType: contentType,
    targetId: contentId,
    reason,
  });
  res.status(201).json({ message: "Report received. Thank you for helping keep the community safe." });
});

export default router;
