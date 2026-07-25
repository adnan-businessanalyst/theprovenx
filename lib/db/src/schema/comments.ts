import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const commentsTable = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    parentType: text("parent_type").notNull(), // question | answer
    parentId: integer("parent_id").notNull(),
    authorId: integer("author_id")
      .notNull()
      .references(() => usersTable.id),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("comments_parent_idx").on(t.parentType, t.parentId)],
);

export type Comment = typeof commentsTable.$inferSelect;
export type InsertComment = typeof commentsTable.$inferInsert;
