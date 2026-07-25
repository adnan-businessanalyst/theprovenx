import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const translationsTable = pgTable(
  "translations",
  {
    id: serial("id").primaryKey(),
    contentType: text("content_type").notNull(), // question | answer
    contentId: integer("content_id").notNull(),
    target: text("target").notNull(), // en | ar
    title: text("title"),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("translations_unique_idx").on(
      t.contentType,
      t.contentId,
      t.target,
    ),
  ],
);

export type Translation = typeof translationsTable.$inferSelect;
