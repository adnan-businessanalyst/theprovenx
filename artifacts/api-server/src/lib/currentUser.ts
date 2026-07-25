import type { Request, Response, NextFunction } from "express";
import type { User } from "@workspace/db";
import {
  extractBearerToken,
  resolveUserFromSessionToken,
  SESSION_COOKIE,
} from "./session";

/** Resolve the local user from session cookie or Bearer token. */
export async function resolveLocalUser(req: Request): Promise<User | null> {
  const cookieToken =
    (req.cookies?.[SESSION_COOKIE] as string | undefined) ?? null;
  const bearerToken = extractBearerToken(req.header("authorization"));
  const rawToken = bearerToken || cookieToken;
  if (!rawToken) return null;
  return resolveUserFromSessionToken(rawToken);
}

/** Attaches req.localUser when signed in; never blocks. */
export async function attachUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await resolveLocalUser(req);
    if (user) req.localUser = user;
  } catch (err) {
    req.log?.warn({ err }, "Failed to resolve session user");
  }
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
  if (
    req.localUser.role !== "admin" &&
    req.localUser.role !== "platform_owner"
  ) {
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
  if (
    req.localUser.role !== "admin" &&
    req.localUser.role !== "moderator" &&
    req.localUser.role !== "platform_owner"
  ) {
    res.status(403).json({ message: "Moderator access required" });
    return;
  }
  next();
}
