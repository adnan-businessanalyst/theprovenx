import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Sign In",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-background px-4 py-12">
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-2xl bg-muted/40" />}>
        <AuthForm mode="sign-in" />
      </Suspense>
    </div>
  );
}
