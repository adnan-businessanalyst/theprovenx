import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { eq, sql } from "drizzle-orm";
import { db, usersTable, type User } from "@workspace/db";

function slugifyUsername(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return base || "member";
}

/** Find or JIT-provision the local user row bridged from Clerk identity. */
export async function resolveLocalUser(req: Request): Promise<User | null> {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) return null;

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkId, clerkId));
  if (existing) return existing;

  // JIT provision from Clerk profile
  let displayName = "Member";
  let email: string | null = null;
  let avatarUrl: string | null = null;
  let usernameSeed = "member";
  try {
    const cu = await clerkClient.users.getUser(clerkId);
    email = cu.primaryEmailAddress?.emailAddress ?? null;
    avatarUrl = cu.imageUrl ?? null;
    displayName =
      [cu.firstName, cu.lastName].filter(Boolean).join(" ") ||
      cu.username ||
      email?.split("@")[0] ||
      "Member";
    usernameSeed = cu.username || email?.split("@")[0] || displayName;
  } catch (err) {
    req.log.warn({ err }, "Failed to fetch Clerk profile, using defaults");
    usernameSeed = `member-${clerkId.slice(-8)}`;
  }

  // First user to join the community becomes the admin
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable);
  const role = count === 0 ? "admin" : "member";

  let username = slugifyUsername(usernameSeed);
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate =
      attempt === 0
        ? username
        : `${username}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      const [created] = await db
        .insert(usersTable)
        .values({ clerkId, username: candidate, displayName, email, avatarUrl, role })
        .returning();
      return created;
    } catch {
      // Unique violation (username or concurrent clerkId insert) — re-check
      const [raced] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.clerkId, clerkId));
      if (raced) return raced;
    }
  }
  return null;
}

/** Attaches req.localUser when signed in; never blocks. */
export async function attachUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await resolveLocalUser(req);
  if (user) req.localUser = user;
  next();
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.localUser) {
    res.status(401).json({ message: "Sign in required" });
    return;
  }
  if (req.localUser.isSuspended) {
    res.status(403).json({ message: "Account suspended" });
    return;
  }
  next();
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.localUser) {
    res.status(401).json({ message: "Sign in required" });
    return;
  }
  if (req.localUser.role !== "admin" && req.localUser.role !== "platform_owner") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
}

export function requireModerator(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.localUser) {
    res.status(401).json({ message: "Sign in required" });
    return;
  }
  if (req.localUser.role !== "admin" && req.localUser.role !== "moderator" && req.localUser.role !== "platform_owner") {
    res.status(403).json({ message: "Moderator access required" });
    return;
  }
  next();
}
