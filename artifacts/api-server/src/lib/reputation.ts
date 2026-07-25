import { sql, eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

export const REP = {
  questionUp: 5,
  answerUp: 10,
  down: -2,
  accepted: 15,
  acceptGiven: 2,
};

export async function addReputation(userId: number, delta: number): Promise<void> {
  if (delta === 0) return;
  await db
    .update(usersTable)
    .set({ reputation: sql`greatest(1, ${usersTable.reputation} + ${delta})` })
    .where(eq(usersTable.id, userId));
}

/** Reputation delta for the content author for a single vote value. */
export function voteRep(targetType: "question" | "answer", value: number): number {
  if (value === 1) return targetType === "question" ? REP.questionUp : REP.answerUp;
  if (value === -1) return REP.down;
  return 0;
}
