import { Router, type IRouter } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import { db, usersTable, questionsTable } from "@workspace/db";
import { UpdateMeBody } from "@workspace/api-zod";
import { requireAuth } from "../lib/currentUser";
import { serializeUser, serializeQuestions } from "../lib/serialize";

const router: IRouter = Router();

router.get("/me", async (req, res): Promise<void> => {
  if (!req.localUser) {
    res.status(401).json({ message: "Not signed in" });
    return;
  }
  res.json(await serializeUser(req.localUser));
});

router.get("/me/questions", requireAuth, async (req, res): Promise<void> => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize) || 20));
  const authorId = req.localUser!.id;

  const where = and(
    eq(questionsTable.authorId, authorId),
    eq(questionsTable.isDeleted, false),
  );

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(questionsTable)
    .where(where);

  const rows = await db
    .select()
    .from(questionsTable)
    .where(where)
    .orderBy(desc(questionsTable.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  res.json({
    items: await serializeQuestions(rows, authorId),
    total,
    page,
    pageSize,
  });
});

router.patch("/me", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  const [updated] = await db
    .update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, req.localUser!.id))
    .returning();
  res.json(await serializeUser(updated));
});

export default router;
