import { and, eq, sql } from "drizzle-orm";
import { db, votesTable, questionsTable, answersTable } from "@workspace/db";
import { addReputation, voteRep } from "./reputation";

/**
 * Apply a vote (value -1|0|1) from userId on a question or answer.
 * Returns the new score, or null when the target does not exist.
 */
export async function applyVote(params: {
  userId: number;
  targetType: "question" | "answer";
  targetId: number;
  value: number;
  authorId: number;
}): Promise<number | null> {
  const { userId, targetType, targetId, value, authorId } = params;

  const [existing] = await db
    .select()
    .from(votesTable)
    .where(
      and(
        eq(votesTable.userId, userId),
        eq(votesTable.targetType, targetType),
        eq(votesTable.targetId, targetId),
      ),
    );
  const oldValue = existing?.value ?? 0;
  if (oldValue === value) {
    // no-op; return current score
  } else {
    if (value === 0) {
      if (existing) await db.delete(votesTable).where(eq(votesTable.id, existing.id));
    } else if (existing) {
      await db.update(votesTable).set({ value }).where(eq(votesTable.id, existing.id));
    } else {
      await db.insert(votesTable).values({ userId, targetType, targetId, value });
    }
    const scoreDelta = value - oldValue;
    const table = targetType === "question" ? questionsTable : answersTable;
    await db
      .update(table)
      .set({ score: sql`${table.score} + ${scoreDelta}` })
      .where(eq(table.id, targetId));
    // Reputation: undo old vote effect, apply new (skip self-votes; those are blocked upstream)
    const repDelta = voteRep(targetType, value) - voteRep(targetType, oldValue);
    await addReputation(authorId, repDelta);
  }

  const table = targetType === "question" ? questionsTable : answersTable;
  const [row] = await db
    .select({ score: table.score })
    .from(table)
    .where(eq(table.id, targetId));
  return row?.score ?? null;
}
