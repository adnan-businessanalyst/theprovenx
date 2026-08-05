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

let schemaReady: Promise<void> | null = null;

/**
 * Idempotent DDL for moderation columns/tables so production DBs that
 * never ran drizzle push still work after deploy.
 */
export async function ensureQuestionModerationSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db.execute(sql`
        ALTER TABLE questions
        ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published'
      `);
      await db.execute(sql`
        CREATE INDEX IF NOT EXISTS questions_status_idx ON questions (status)
      `);
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS site_settings (
          id serial PRIMARY KEY,
          questions_require_review boolean NOT NULL DEFAULT false,
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      logger.info("Ensured question moderation schema");
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
}

/**
 * Idempotently provisions the default categories so question creation
 * (which requires a categorySlug) can never dead-end on a fresh database.
 * Also ensures the "other" category exists on databases that were seeded earlier.
 */
export async function ensureDefaultCategories(): Promise<void> {
  await ensureQuestionModerationSchema();

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
  await ensureQuestionModerationSchema();
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
