import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { questionsTable } from "./questions";

export const answersTable = pgTable(
  "answers",
  {
    id: serial("id").primaryKey(),
    questionId: integer("question_id")
      .notNull()
      .references(() => questionsTable.id, { onDelete: "cascade" }),
    authorId: integer("author_id")
      .notNull()
      .references(() => usersTable.id),
    body: text("body").notNull(),
    language: text("language").notNull().default("en"),
    score: integer("score").notNull().default(0),
    isAccepted: boolean("is_accepted").notNull().default(false),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    isDeleted: boolean("is_deleted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("answers_question_idx").on(t.questionId)],
);

export type Answer = typeof answersTable.$inferSelect;
export type InsertAnswer = typeof answersTable.$inferInsert;
