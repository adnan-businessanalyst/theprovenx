import { pgTable, serial, boolean, timestamp } from "drizzle-orm/pg-core";

/** Singleton site-wide settings (always row id = 1). */
export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  questionsRequireReview: boolean("questions_require_review").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type SiteSettings = typeof siteSettingsTable.$inferSelect;
export type InsertSiteSettings = typeof siteSettingsTable.$inferInsert;
