import { and, eq, isNull, sql } from "drizzle-orm";
import {
  db,
  categoriesTable,
  answersTable,
  siteSettingsTable,
} from "@workspace/db";
import { logger } from "./logger";

const DEFAULT_CATEGORIES = [
  { slug: "immigration-visas", name: "Immigration & Visas", description: "Visas, residency permits, and immigration rule changes" },
  { slug: "business-licensing", name: "Business & Licensing", description: "Registering, licensing, and running a business" },
  { slug: "taxes-finance", name: "Taxes & Finance", description: "Tax registration, VAT, filings, and money matters" },
  { slug: "work-labor", name: "Work & Labor", description: "Employment contracts, workplace rules, and labor law" },
  { slug: "banking", name: "Banking", description: "Accounts, transfers, and bank requirements" },
  { slug: "everyday-bureaucracy", name: "Everyday Bureaucracy", description: "The unwritten rules of dealing with officials and paperwork" },
  { slug: "other", name: "Other", description: "Topics that do not fit the other categories" },
];

/**
 * Idempotently provisions the default categories so question creation
 * (which requires a categorySlug) can never dead-end on a fresh database.
 * Also ensures the "other" category exists on databases that were seeded earlier.
 */
export async function ensureDefaultCategories(): Promise<void> {
  const existing = await db.select({ id: categoriesTable.id }).from(categoriesTable).limit(1);
  if (existing.length === 0) {
    await db.insert(categoriesTable).values(DEFAULT_CATEGORIES).onConflictDoNothing();
    logger.info("Provisioned default categories");
  } else {
    const other = DEFAULT_CATEGORIES.find((c) => c.slug === "other")!;
    await db.insert(categoriesTable).values(other).onConflictDoNothing();
  }

  await ensureSiteSettings();

  // Backfill acceptedAt for answers accepted before the column existed,
  // so the top-verifiers ranking never misses older accepted answers.
  await db
    .update(answersTable)
    .set({ acceptedAt: sql`${answersTable.updatedAt}` })
    .where(and(eq(answersTable.isAccepted, true), isNull(answersTable.acceptedAt)));
}

export async function ensureSiteSettings(): Promise<void> {
  const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, 1)).limit(1);
  if (!row) {
    await db.insert(siteSettingsTable).values({ id: 1, questionsRequireReview: false }).onConflictDoNothing();
    logger.info("Provisioned site settings");
  }
}

export async function getSiteSettings() {
  await ensureSiteSettings();
  const [row] = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.id, 1)).limit(1);
  return row!;
}
