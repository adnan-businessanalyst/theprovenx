import { Router, type IRouter } from "express";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db, notificationsTable } from "@workspace/db";
import { ListNotificationsQueryParams, MarkNotificationsReadBody } from "@workspace/api-zod";
import { requireAuth } from "../lib/currentUser";
import { addSseClient, removeSseClient } from "../lib/notify";

const router: IRouter = Router();

router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  const parsed = ListNotificationsQueryParams.safeParse(req.query);
  const limit = Math.min(parsed.success ? (parsed.data.limit ?? 30) : 30, 100);
  const userId = req.localUser!.id;

  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, userId))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(limit);
  const [{ unreadCount }] = await db
    .select({ unreadCount: sql<number>`count(*)::int` })
    .from(notificationsTable)
    .where(and(eq(notificationsTable.userId, userId), eq(notificationsTable.isRead, false)));

  res.json({
    items: rows.map((n) => ({
      id: n.id,
      type: n.type,
      message: n.title,
      link: n.link ?? "",
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
    })),
    unreadCount,
  });
});

router.post("/notifications/read", requireAuth, async (req, res): Promise<void> => {
  const parsed = MarkNotificationsReadBody.safeParse(req.body ?? {});
  const ids = parsed.success ? parsed.data.ids : undefined;
  const userId = req.localUser!.id;
  if (ids && ids.length > 0) {
    await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(and(eq(notificationsTable.userId, userId), inArray(notificationsTable.id, ids)));
  } else {
    await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(eq(notificationsTable.userId, userId));
  }
  res.json({ message: "ok" });
});

// Server-sent events stream for live notification updates (not in OpenAPI spec)
router.get("/notifications/stream", requireAuth, async (req, res): Promise<void> => {
  const userId = req.localUser!.id;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  res.write(": connected\n\n");

  addSseClient(userId, res);
  const heartbeat = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      clearInterval(heartbeat);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeSseClient(userId, res);
  });
});

export default router;
