import type { Response } from "express";
import { db, notificationsTable } from "@workspace/db";
import { logger } from "./logger";

// In-memory SSE registry: local user id -> open connections
const clients = new Map<number, Set<Response>>();

export function addSseClient(userId: number, res: Response): void {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId)!.add(res);
}

export function removeSseClient(userId: number, res: Response): void {
  const set = clients.get(userId);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) clients.delete(userId);
}

export async function notifyUser(params: {
  userId: number;
  type: string;
  message: string;
  link: string;
}): Promise<void> {
  try {
    const [row] = await db
      .insert(notificationsTable)
      .values({
        userId: params.userId,
        type: params.type,
        title: params.message,
        link: params.link,
      })
      .returning();

    const set = clients.get(params.userId);
    if (set) {
      const payload = `data: ${JSON.stringify({
        id: row.id,
        type: params.type,
        message: params.message,
        link: params.link,
      })}\n\n`;
      for (const res of set) {
        try {
          res.write(payload);
        } catch {
          set.delete(res);
        }
      }
    }
  } catch (err) {
    logger.error({ err }, "Failed to create notification");
  }
}
