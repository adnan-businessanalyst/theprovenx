import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

// Payment-gateway readiness scaffolding. No live gateway is wired yet; rows
// are created by future gateway webhooks or admin actions.
export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  kind: text("kind").notNull().default("subscription"), // subscription | one_time
  plan: text("plan"),
  amountCents: integer("amount_cents").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending"), // pending | paid | failed | refunded
  gateway: text("gateway"), // future: stripe | etc
  externalId: text("external_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Transaction = typeof transactionsTable.$inferSelect;
