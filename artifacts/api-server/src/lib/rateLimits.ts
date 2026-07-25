import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

function keyFor(req: Request): string {
  if (req.localUser) return `u:${req.localUser.id}`;
  return `ip:${ipKeyGenerator(req.ip ?? "unknown")}`;
}

const common = {
  standardHeaders: true as const,
  legacyHeaders: false,
  keyGenerator: keyFor,
  message: { message: "Too many requests, please slow down." },
  validate: { ip: false },
};

export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: (req: Request) =>
    // New users (low reputation) get tighter limits to deter spam
    req.localUser && req.localUser.reputation < 5 ? 10 : 60,
  ...common,
});

export const askLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: (req: Request) =>
    req.localUser && req.localUser.reputation < 5 ? 3 : 15,
  ...common,
});

export const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  ...common,
});

// Public (unauthenticated) endpoint — keep the limit tight to deter spam
export const sponsorInquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  ...common,
});

export const translateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 60,
  ...common,
});

/** Login / register — per IP */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  ...common,
  keyGenerator: (req) => `auth:${ipKeyGenerator(req.ip ?? "unknown")}`,
});

/** Password change / forgot / reset — tighter */
export const authStrictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  ...common,
  keyGenerator: (req) => `auth-strict:${ipKeyGenerator(req.ip ?? "unknown")}`,
});
