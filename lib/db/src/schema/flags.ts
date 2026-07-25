import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const flagsTable = pgTable("flags", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporter_id")
    .notNull()
    .references(() => usersTable.id),
  targetType: text("target_type").notNull(), // question | answer | comment
  targetId: integer("target_id").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("open"), // open | dismissed | removed
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Flag = typeof flagsTable.$inferSelect;
export type InsertFlag = typeof flagsTable.$inferInsert;
