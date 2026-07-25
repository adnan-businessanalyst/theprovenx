import type { CookieOptions, Response } from "express";
import { SESSION_COOKIE, SESSION_TTL_MS } from "./session";

function cookieOptions(expiresAt: Date): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    expires: expiresAt,
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
  };
}

export function setSessionCookie(
  res: Response,
  rawToken: string,
  expiresAt: Date,
): void {
  res.cookie(SESSION_COOKIE, rawToken, cookieOptions(expiresAt));
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
  });
}

export { SESSION_COOKIE, SESSION_TTL_MS };
