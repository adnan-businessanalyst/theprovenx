/**
 * One-off: create/ensure a platform_owner account in the local users table.
 *
 * Usage:
 *   OWNER_EMAIL=you@example.com OWNER_PASSWORD='...' OWNER_USERNAME=owner \
 *     pnpm --filter @workspace/api-server exec tsx scripts/create-platform-owner.ts
 */
import { eq, sql } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { hashPassword, validatePasswordStrength } from "../src/lib/password";

const EMAIL = process.env.OWNER_EMAIL?.trim().toLowerCase();
const PASSWORD = process.env.OWNER_PASSWORD;
const USERNAME = (process.env.OWNER_USERNAME || "platform-owner")
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 30);
const DISPLAY_NAME = process.env.OWNER_DISPLAY_NAME || "Platform Owner";

async function main() {
  if (!EMAIL || !PASSWORD) {
    throw new Error("OWNER_EMAIL and OWNER_PASSWORD required");
  }
  const pwError = validatePasswordStrength(PASSWORD);
  if (pwError) throw new Error(pwError);

  const passwordHash = await hashPassword(PASSWORD);
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, EMAIL))
    .limit(1);

  if (existing) {
    const [updated] = await db
      .update(usersTable)
      .set({
        passwordHash,
        role: "platform_owner",
        displayName: DISPLAY_NAME,
        isSuspended: false,
      })
      .where(eq(usersTable.id, existing.id))
      .returning();
    console.log("UPDATED", { id: updated.id, email: updated.email, role: updated.role });
    return;
  }

  // Ensure username uniqueness
  let username = USERNAME || "platform-owner";
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate =
      attempt === 0
        ? username
        : `${username}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      const [created] = await db
        .insert(usersTable)
        .values({
          email: EMAIL,
          passwordHash,
          username: candidate,
          displayName: DISPLAY_NAME,
          role: "platform_owner",
        })
        .returning();
      console.log("CREATED", {
        id: created.id,
        email: created.email,
        username: created.username,
        role: created.role,
      });
      return;
    } catch (err) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(usersTable)
        .where(eq(usersTable.email, EMAIL));
      if (count > 0) throw err;
    }
  }
  throw new Error("Could not create platform owner");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
