import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const votesTable = pgTable(
  "votes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id),
    targetType: text("target_type").notNull(), // question | answer
    targetId: integer("target_id").notNull(),
    value: integer("value").notNull(), // 1 | -1
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("votes_unique_idx").on(t.userId, t.targetType, t.targetId),
  ],
);

export type Vote = typeof votesTable.$inferSelect;
export type InsertVote = typeof votesTable.$inferInsert;
