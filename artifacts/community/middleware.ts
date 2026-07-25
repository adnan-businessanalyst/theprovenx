import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/profile(.*)",
  "/notifications(.*)",
  "/ask(.*)",
]);

const clerkConfigured =
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default function middleware(req: NextRequest, event: unknown) {
  if (!clerkConfigured) {
    return NextResponse.next();
  }
  // clerkMiddleware returns a NextMiddleware-compatible function
  return (clerkHandler as (req: NextRequest, event: unknown) => Response | Promise<Response>)(
    req,
    event,
  );
}

export const config = {
  matcher: [
    // Exclude Next internals, static assets, and /api (proxied to Express)
    "/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
