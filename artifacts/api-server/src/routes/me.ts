import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { UpdateMeBody } from "@workspace/api-zod";
import { requireAuth } from "../lib/currentUser";
import { serializeUser } from "../lib/serialize";

const router: IRouter = Router();

router.get("/me", async (req, res): Promise<void> => {
  if (!req.localUser) {
    res.status(401).json({ message: "Not signed in" });
    return;
  }
  res.json(await serializeUser(req.localUser));
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
