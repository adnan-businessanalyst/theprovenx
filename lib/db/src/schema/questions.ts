import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersTable } from "./users";
import { categoriesTable } from "./categories";

export const questionsTable = pgTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    language: text("language").notNull().default("en"),
    authorId: integer("author_id")
      .notNull()
      .references(() => usersTable.id),
    score: integer("score").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0),
    acceptedAnswerId: integer("accepted_answer_id"),
    categoryId: integer("category_id").references(() => categoriesTable.id, {
      onDelete: "set null",
    }),
    isFeatured: boolean("is_featured").notNull().default(false),
    isDeleted: boolean("is_deleted").notNull().default(false),
    /** published | pending_review | suspended */
    status: text("status").notNull().default("published"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("questions_search_idx").using(
      "gin",
      sql`to_tsvector('simple', ${t.title} || ' ' || ${t.body})`,
    ),
    index("questions_author_idx").on(t.authorId),
    index("questions_created_idx").on(t.createdAt),
    index("questions_status_idx").on(t.status),
  ],
);

export const QUESTION_STATUSES = [
  "published",
  "pending_review",
  "suspended",
] as const;

export type QuestionStatus = (typeof QUESTION_STATUSES)[number];

export type Question = typeof questionsTable.$inferSelect;
export type InsertQuestion = typeof questionsTable.$inferInsert;
