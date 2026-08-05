import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import {
  db,
  usersTable,
  questionsTable,
  answersTable,
  commentsTable,
  flagsTable,
  tagsTable,
  categoriesTable,
  transactionsTable,
  sponsorInquiriesTable,
  siteSettingsTable,
} from "@workspace/db";
import {
  ResolveFlagBody,
  ListUsersAdminQueryParams,
  UpdateUserAdminBody,
  UpdateQuestionAdminBody,
  UpdateTagAdminBody,
  CreateTagAdminBody,
  CreateCategoryAdminBody,
  UpdateCategoryAdminBody,
  ListSponsorInquiriesAdminQueryParams,
  UpdateSponsorInquiryAdminBody,
  ListQuestionsAdminQueryParams,
  UpdateAdminSettingsBody,
} from "@workspace/api-zod";
import { requireAdmin, requireModerator } from "../lib/currentUser";
import { serializeUsers, serializeQuestions } from "../lib/serialize";
import { ensureSiteSettings, getSiteSettings } from "../lib/ensureDefaults";

const router: IRouter = Router();

function parseId(raw: string | string[]): number {
  return parseInt(Array.isArray(raw) ? raw[0] : raw, 10);
}

router.get("/admin/overview", requireModerator, async (_req, res): Promise<void> => {
  const today = sql`date_trunc('day', now())`;
  const [q] = await db
    .select({
      questionCount: sql<number>`count(*)::int`,
      questionsToday: sql<number>`count(*) filter (where created_at >= ${today})::int`,
    })
    .from(questionsTable)
    .where(eq(questionsTable.isDeleted, false));
  const [a] = await db
    .select({
      answerCount: sql<number>`count(*)::int`,
      answersToday: sql<number>`count(*) filter (where created_at >= ${today})::int`,
    })
    .from(answersTable)
    .where(eq(answersTable.isDeleted, false));
  const [u] = await db
    .select({
      userCount: sql<number>`count(*)::int`,
      newUsersToday: sql<number>`count(*) filter (where created_at >= ${today})::int`,
    })
    .from(usersTable);
  const [f] = await db
    .select({ openFlagCount: sql<number>`count(*)::int` })
    .from(flagsTable)
    .where(eq(flagsTable.status, "open"));

  res.json({
    questionCount: q.questionCount,
    answerCount: a.answerCount,
    userCount: u.userCount,
    openFlagCount: f.openFlagCount,
    questionsToday: q.questionsToday,
    answersToday: a.answersToday,
    newUsersToday: u.newUsersToday,
  });
});

router.get("/admin/flags", requireModerator, async (_req, res): Promise<void> => {
  const flags = await db
    .select()
    .from(flagsTable)
    .where(eq(flagsTable.status, "open"))
    .orderBy(desc(flagsTable.createdAt))
    .limit(100);

  const reporterIds = [...new Set(flags.map((f) => f.reporterId))];
  const reporters = reporterIds.length
    ? await db.select().from(usersTable).where(inArray(usersTable.id, reporterIds))
    : [];
  const reporterMap = await serializeUsers(reporters);

  const items = [];
  for (const f of flags) {
    let contentPreview = "";
    let contentLink = "";
    if (f.targetType === "question") {
      const [q] = await db.select().from(questionsTable).where(eq(questionsTable.id, f.targetId));
      if (q) {
        contentPreview = q.title;
        contentLink = `/questions/${q.slug}`;
      }
    } else if (f.targetType === "answer") {
      const [ans] = await db.select().from(answersTable).where(eq(answersTable.id, f.targetId));
      if (ans) {
        const [q] = await db.select().from(questionsTable).where(eq(questionsTable.id, ans.questionId));
        contentPreview = ans.body.slice(0, 160);
        contentLink = q ? `/questions/${q.slug}` : "";
      }
    } else {
      const [c] = await db.select().from(commentsTable).where(eq(commentsTable.id, f.targetId));
      if (c) contentPreview = c.body.slice(0, 160);
    }
    items.push({
      id: f.id,
      contentType: f.targetType,
      contentId: f.targetId,
      reason: f.reason,
      status: f.status,
      reporter: reporterMap.get(f.reporterId),
      contentPreview: contentPreview || "(content removed)",
      contentLink,
      createdAt: f.createdAt.toISOString(),
    });
  }
  res.json(items);
});

router.post("/admin/flags/:id/resolve", requireModerator, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const parsed = ResolveFlagBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const [flag] = await db.select().from(flagsTable).where(eq(flagsTable.id, id));
  if (!flag) {
    res.status(404).json({ message: "Flag not found" });
    return;
  }
  if (parsed.data.action === "remove_content") {
    if (flag.targetType === "question") {
      await db.update(questionsTable).set({ isDeleted: true }).where(eq(questionsTable.id, flag.targetId));
    } else if (flag.targetType === "answer") {
      await db.update(answersTable).set({ isDeleted: true }).where(eq(answersTable.id, flag.targetId));
    } else {
      await db.delete(commentsTable).where(eq(commentsTable.id, flag.targetId));
    }
  }
  await db
    .update(flagsTable)
    .set({ status: parsed.data.action === "remove_content" ? "removed" : "dismissed" })
    .where(eq(flagsTable.id, id));
  res.json({ message: "Flag resolved" });
});

router.get("/admin/users", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListUsersAdminQueryParams.safeParse(req.query);
  const search = parsed.success ? parsed.data.q : undefined;
  const rows = await db
    .select()
    .from(usersTable)
    .where(
      search
        ? or(ilike(usersTable.username, `%${search}%`), ilike(usersTable.displayName, `%${search}%`))
        : undefined,
    )
    .orderBy(desc(usersTable.createdAt))
    .limit(200);
  const map = await serializeUsers(rows);
  res.json(rows.map((r) => map.get(r.id)));
});

router.patch("/admin/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const parsed = UpdateUserAdminBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  if (id === req.localUser!.id && (parsed.data.isSuspended || (parsed.data.role && parsed.data.role !== "admin"))) {
    res.status(400).json({ message: "You cannot demote or suspend your own account" });
    return;
  }
  // The platform owner account cannot be modified through the admin panel.
  const [target] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (target?.role === "platform_owner" && req.localUser!.role !== "platform_owner") {
    res.status(403).json({ message: "This account can only be managed by the platform owner" });
    return;
  }
  const [updated] = await db
    .update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const map = await serializeUsers([updated]);
  res.json(map.get(updated.id));
});

router.delete("/admin/questions/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const [updated] = await db
    .update(questionsTable)
    .set({ isDeleted: true })
    .where(eq(questionsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Question not found" });
    return;
  }
  res.json({ message: "Question removed" });
});

router.get("/admin/settings", requireAdmin, async (_req, res): Promise<void> => {
  const settings = await getSiteSettings();
  res.json({ questionsRequireReview: settings.questionsRequireReview });
});

router.patch("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateAdminSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  await ensureSiteSettings();
  const [updated] = await db
    .update(siteSettingsTable)
    .set({ questionsRequireReview: parsed.data.questionsRequireReview })
    .where(eq(siteSettingsTable.id, 1))
    .returning();
  res.json({ questionsRequireReview: updated.questionsRequireReview });
});

router.get("/admin/questions", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListQuestionsAdminQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  const { status, page = 1, pageSize = 20 } = parsed.data;
  const size = Math.min(pageSize, 50);
  const conditions = [eq(questionsTable.isDeleted, false)];
  if (status) conditions.push(eq(questionsTable.status, status));

  const where = and(...conditions);
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(questionsTable)
    .where(where);
  const rows = await db
    .select()
    .from(questionsTable)
    .where(where)
    .orderBy(desc(questionsTable.createdAt))
    .limit(size)
    .offset((page - 1) * size);

  res.json({
    items: await serializeQuestions(rows, req.localUser?.id),
    total,
    page,
    pageSize: size,
  });
});

router.patch("/admin/questions/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const parsed = UpdateQuestionAdminBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  if (parsed.data.isFeatured === undefined && parsed.data.status === undefined) {
    res.status(400).json({ message: "No updates provided" });
    return;
  }
  const patch: { isFeatured?: boolean; status?: string } = {};
  if (parsed.data.isFeatured !== undefined) patch.isFeatured = parsed.data.isFeatured;
  if (parsed.data.status !== undefined) patch.status = parsed.data.status;

  const [updated] = await db
    .update(questionsTable)
    .set(patch)
    .where(and(eq(questionsTable.id, id), eq(questionsTable.isDeleted, false)))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Question not found" });
    return;
  }
  const [serialized] = await serializeQuestions([updated], req.localUser?.id);
  res.json(serialized);
});

router.delete("/admin/answers/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const [updated] = await db
    .update(answersTable)
    .set({ isDeleted: true })
    .where(eq(answersTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Answer not found" });
    return;
  }
  res.json({ message: "Answer removed" });
});

function slugifyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

router.post("/admin/tags", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateTagAdminBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const slug = slugifyName(parsed.data.name);
  if (!slug) {
    res.status(400).json({ message: "Invalid tag name" });
    return;
  }
  const [created] = await db
    .insert(tagsTable)
    .values({ slug, name: parsed.data.name.trim(), description: parsed.data.description })
    .onConflictDoNothing()
    .returning();
  if (!created) {
    res.status(409).json({ message: "A tag with this name already exists" });
    return;
  }
  res.status(201).json({
    id: created.id,
    slug: created.slug,
    name: created.name,
    description: created.description,
    questionCount: 0,
  });
});

router.post("/admin/categories", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateCategoryAdminBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const slug = slugifyName(parsed.data.name);
  if (!slug) {
    res.status(400).json({ message: "Invalid category name" });
    return;
  }
  const [created] = await db
    .insert(categoriesTable)
    .values({ slug, name: parsed.data.name.trim(), description: parsed.data.description })
    .onConflictDoNothing()
    .returning();
  if (!created) {
    res.status(409).json({ message: "A category with this name already exists" });
    return;
  }
  res.status(201).json({
    id: created.id,
    slug: created.slug,
    name: created.name,
    description: created.description,
    questionCount: 0,
  });
});

router.patch("/admin/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const parsed = UpdateCategoryAdminBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const [updated] = await db
    .update(categoriesTable)
    .set(parsed.data)
    .where(eq(categoriesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Category not found" });
    return;
  }
  res.json({
    id: updated.id,
    slug: updated.slug,
    name: updated.name,
    description: updated.description,
    questionCount: 0,
  });
});

router.delete("/admin/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const [deleted] = await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .returning();
  if (!deleted) {
    res.status(404).json({ message: "Category not found" });
    return;
  }
  // questions.category_id has ON DELETE SET NULL — questions become uncategorized
  res.json({ message: "Category deleted" });
});

router.patch("/admin/tags/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const parsed = UpdateTagAdminBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const [updated] = await db
    .update(tagsTable)
    .set(parsed.data)
    .where(eq(tagsTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Tag not found" });
    return;
  }
  res.json({
    id: updated.id,
    slug: updated.slug,
    name: updated.name,
    description: updated.description,
    questionCount: 0,
  });
});

router.delete("/admin/tags/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const [deleted] = await db.delete(tagsTable).where(eq(tagsTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ message: "Tag not found" });
    return;
  }
  res.json({ message: "Tag deleted" });
});

router.get("/admin/sponsor-inquiries", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListSponsorInquiriesAdminQueryParams.safeParse(req.query);
  const status = parsed.success ? parsed.data.status : undefined;
  const rows = await db
    .select()
    .from(sponsorInquiriesTable)
    .where(status ? eq(sponsorInquiriesTable.status, status) : undefined)
    .orderBy(desc(sponsorInquiriesTable.createdAt))
    .limit(200);
  res.json(
    rows.map((r) => ({
      id: r.id,
      company: r.company,
      contactName: r.contactName,
      email: r.email,
      budgetRange: r.budgetRange,
      message: r.message,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    })),
  );
});

router.patch("/admin/sponsor-inquiries/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  const parsed = UpdateSponsorInquiryAdminBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }
  const [updated] = await db
    .update(sponsorInquiriesTable)
    .set({ status: parsed.data.status })
    .where(eq(sponsorInquiriesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ message: "Inquiry not found" });
    return;
  }
  res.json({
    id: updated.id,
    company: updated.company,
    contactName: updated.contactName,
    email: updated.email,
    budgetRange: updated.budgetRange,
    message: updated.message,
    status: updated.status,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.get("/admin/transactions", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select({ tx: transactionsTable, username: usersTable.username })
    .from(transactionsTable)
    .innerJoin(usersTable, eq(transactionsTable.userId, usersTable.id))
    .orderBy(desc(transactionsTable.createdAt))
    .limit(200);
  res.json(
    rows.map((r) => ({
      id: r.tx.id,
      userId: r.tx.userId,
      username: r.username,
      amountCents: r.tx.amountCents,
      currency: r.tx.currency,
      status: r.tx.status === "paid" ? "completed" : r.tx.status,
      description: r.tx.plan ? `${r.tx.kind} — ${r.tx.plan}` : r.tx.kind,
      createdAt: r.tx.createdAt.toISOString(),
    })),
  );
});

export default router;
