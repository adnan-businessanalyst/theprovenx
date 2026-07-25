import { Router, type IRouter, type Request, type Response } from "express";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import {
  db,
  usersTable,
  passwordResetTokensTable,
  type User,
} from "@workspace/db";
import {
  RegisterBody,
  LoginBody,
  ChangePasswordBody,
  ForgotPasswordBody,
  ResetPasswordBody,
} from "@workspace/api-zod";
import { hashPassword, validatePasswordStrength, verifyPassword } from "../lib/password";
import {
  createSession,
  generateSessionToken,
  hashToken,
  revokeSessionByToken,
  SESSION_COOKIE,
} from "../lib/session";
import { clearSessionCookie, setSessionCookie } from "../lib/cookies";
import { requireAuth } from "../lib/currentUser";
import { serializeUser } from "../lib/serialize";
import { sendMail } from "../lib/mailer";
import { authLimiter, authStrictLimiter } from "../lib/rateLimits";

const router: IRouter = Router();

const GENERIC_AUTH_ERROR = "Invalid email or password.";
const GENERIC_FORGOT_SUCCESS =
  "If an account exists for that email, password reset instructions have been sent.";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 320;
}

function slugifyUsername(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return base || "member";
}

function clientMeta(req: Request) {
  return {
    userAgent: req.get("user-agent") ?? null,
    ipAddress: req.ip ?? null,
  };
}

async function issueSession(
  req: Request,
  res: Response,
  user: User,
): Promise<void> {
  const { rawToken, expiresAt } = await createSession(user.id, clientMeta(req));
  setSessionCookie(res, rawToken, expiresAt);
  res.json({
    user: await serializeUser(user),
    token: rawToken,
  });
}

router.post("/auth/register", authLimiter, async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const { email, password, username, displayName } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidEmail(normalizedEmail)) {
    res.status(400).json({ message: "Invalid email address." });
    return;
  }
  const pwError = validatePasswordStrength(password);
  if (pwError) {
    res.status(400).json({ message: pwError });
    return;
  }

  const desiredUsername = slugifyUsername(username);
  const name = displayName.trim();

  const [existingEmail] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail))
    .limit(1);
  if (existingEmail) {
    res.status(409).json({ message: "An account with this email already exists." });
    return;
  }

  const passwordHash = await hashPassword(password);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable);
  const role = count === 0 ? "admin" : "member";

  let created: typeof usersTable.$inferSelect | undefined;
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate =
      attempt === 0
        ? desiredUsername
        : `${desiredUsername}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      const [row] = await db
        .insert(usersTable)
        .values({
          email: normalizedEmail,
          passwordHash,
          username: candidate,
          displayName: name,
          role,
        })
        .returning();
      created = row;
      break;
    } catch {
      const [raced] = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, normalizedEmail))
        .limit(1);
      if (raced) {
        res.status(409).json({ message: "An account with this email already exists." });
        return;
      }
    }
  }

  if (!created) {
    res.status(500).json({ message: "Could not create account." });
    return;
  }

  await issueSession(req, res, created);
});

router.post("/auth/login", authLimiter, async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();
  if (!isValidEmail(normalizedEmail)) {
    res.status(401).json({ message: GENERIC_AUTH_ERROR });
    return;
  }
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail))
    .limit(1);

  // Constant-time-ish: always hash-compare when possible
  const hash = user?.passwordHash ?? "$2a$12$invalidhashinvalidhashinvalidhashinvalidha";
  const ok = await verifyPassword(parsed.data.password, hash);

  if (!user || !user.passwordHash || !ok) {
    res.status(401).json({ message: GENERIC_AUTH_ERROR });
    return;
  }
  if (user.isSuspended) {
    res.status(403).json({ message: "Account suspended" });
    return;
  }

  await issueSession(req, res, user);
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const cookieToken = req.cookies?.[SESSION_COOKIE] as string | undefined;
  const auth = req.header("authorization");
  const bearer =
    auth && /^Bearer\s+(.+)$/i.test(auth)
      ? auth.replace(/^Bearer\s+/i, "").trim()
      : null;
  const rawToken = bearer || cookieToken;
  if (rawToken) {
    await revokeSessionByToken(rawToken);
  }
  clearSessionCookie(res);
  res.json({ message: "Signed out" });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  if (!req.localUser) {
    res.status(401).json({ message: "Not signed in" });
    return;
  }
  res.json(await serializeUser(req.localUser));
});

router.post(
  "/auth/change-password",
  requireAuth,
  authStrictLimiter,
  async (req, res): Promise<void> => {
    const parsed = ChangePasswordBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }

    const user = req.localUser!;
    if (!user.passwordHash) {
      res.status(400).json({ message: "Password login is not enabled for this account." });
      return;
    }

    const ok = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!ok) {
      res.status(401).json({ message: "Current password is incorrect." });
      return;
    }

    const pwError = validatePasswordStrength(parsed.data.newPassword);
    if (pwError) {
      res.status(400).json({ message: pwError });
      return;
    }

    const passwordHash = await hashPassword(parsed.data.newPassword);
    await db
      .update(usersTable)
      .set({ passwordHash })
      .where(eq(usersTable.id, user.id));

    res.json({ message: "Password updated" });
  },
);

router.post(
  "/auth/forgot-password",
  authStrictLimiter,
  async (req, res): Promise<void> => {
    const parsed = ForgotPasswordBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }

    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    if (isValidEmail(normalizedEmail)) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail))
      .limit(1);

    if (user?.passwordHash) {
      const rawToken = generateSessionToken();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
      await db.insert(passwordResetTokensTable).values({
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt,
      });

      const siteUrl =
        process.env.PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "http://localhost:21400";
      const resetUrl = `${siteUrl.replace(/\/+$/, "")}/reset-password?token=${encodeURIComponent(rawToken)}`;

      await sendMail({
        to: user.email,
        subject: "Reset your The Proven X password",
        text: `Reset your password using this link (expires in 1 hour):\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Reset your password using this link (expires in 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can ignore this email.</p>`,
      });
    }
    }

    res.json({ message: GENERIC_FORGOT_SUCCESS });
  },
);

router.post(
  "/auth/reset-password",
  authStrictLimiter,
  async (req, res): Promise<void> => {
    const parsed = ResetPasswordBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
      return;
    }

    const pwError = validatePasswordStrength(parsed.data.password);
    if (pwError) {
      res.status(400).json({ message: pwError });
      return;
    }

    const tokenHash = hashToken(parsed.data.token);
    const [row] = await db
      .select()
      .from(passwordResetTokensTable)
      .where(
        and(
          eq(passwordResetTokensTable.tokenHash, tokenHash),
          isNull(passwordResetTokensTable.usedAt),
          gt(passwordResetTokensTable.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!row) {
      res.status(400).json({ message: "Invalid or expired reset token." });
      return;
    }

    const passwordHash = await hashPassword(parsed.data.password);
    await db
      .update(usersTable)
      .set({ passwordHash })
      .where(eq(usersTable.id, row.userId));
    await db
      .update(passwordResetTokensTable)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokensTable.id, row.id));

    res.json({ message: "Password has been reset. You can sign in now." });
  },
);

export default router;
