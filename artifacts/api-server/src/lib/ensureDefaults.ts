import { and, eq, isNull, sql } from "drizzle-orm";
import { db, categoriesTable, answersTable } from "@workspace/db";
import { logger } from "./logger";

const DEFAULT_CATEGORIES = [
  { slug: "immigration-visas", name: "Immigration & Visas", description: "Visas, residency permits, and immigration rule changes" },
  { slug: "business-licensing", name: "Business & Licensing", description: "Registering, licensing, and running a business" },
  { slug: "taxes-finance", name: "Taxes & Finance", description: "Tax registration, VAT, filings, and money matters" },
  { slug: "work-labor", name: "Work & Labor", description: "Employment contracts, workplace rules, and labor law" },
  { slug: "banking", name: "Banking", description: "Accounts, transfers, and bank requirements" },
  { slug: "everyday-bureaucracy", name: "Everyday Bureaucracy", description: "The unwritten rules of dealing with officials and paperwork" },
];

/**
 * Idempotently provisions the default categories so question creation
 * (which requires a categorySlug) can never dead-end on a fresh database.
 */
export async function ensureDefaultCategories(): Promise<void> {
  const existing = await db.select({ id: categoriesTable.id }).from(categoriesTable).limit(1);
  if (existing.length === 0) {
    await db.insert(categoriesTable).values(DEFAULT_CATEGORIES).onConflictDoNothing();
    logger.info("Provisioned default categories");
  }

  // Backfill acceptedAt for answers accepted before the column existed,
  // so the top-verifiers ranking never misses older accepted answers.
  await db
    .update(answersTable)
    .set({ acceptedAt: sql`${answersTable.updatedAt}` })
    .where(and(eq(answersTable.isAccepted, true), isNull(answersTable.acceptedAt)));
}
