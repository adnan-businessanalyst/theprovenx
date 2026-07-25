import {
  pgTable,
  text,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

export const sponsorInquiriesTable = pgTable("sponsor_inquiries", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  budgetRange: text("budget_range").notNull(), // under_1k | 1k_5k | 5k_20k | over_20k | undecided
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new | contacted | closed
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type SponsorInquiry = typeof sponsorInquiriesTable.$inferSelect;
export type InsertSponsorInquiry = typeof sponsorInquiriesTable.$inferInsert;
