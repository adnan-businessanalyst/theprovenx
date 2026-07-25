import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Sign Up",
  path: "/sign-up",
  noIndex: true,
});

export default function SignUpPage() {
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
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
