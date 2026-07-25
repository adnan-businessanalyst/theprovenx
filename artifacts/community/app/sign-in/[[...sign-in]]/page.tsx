import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Sign In",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <p className="text-muted-foreground">
          Clerk is not configured. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] w-full max-w-[100vw] items-center justify-center overflow-hidden bg-background px-4 py-12">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}
