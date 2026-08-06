"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { updateMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

type Mode = "sign-in" | "sign-up";
type SignUpStep = "account" | "bio";

function formatAuthError(err: unknown, fallback: string): string {
  const message =
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string"
      ? (err as { message: string }).message
      : fallback;
  return message.replace(/^HTTP \d+ [^:]+:\s*/, "");
}

/** Lowercase handle with no spaces — letters, numbers, underscore, hyphen only. */
export function sanitizeUsername(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 30);
}

function suggestUsernameFrom(email: string, alias: string): string {
  const local = email.includes("@") ? email.split("@")[0] ?? "" : email;
  const source = local.trim() || alias.trim();
  return sanitizeUsername(source);
}

const BIO_MAX = 1000;

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { signIn, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [step, setStep] = useState<SignUpStep>("account");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function syncUsernameSuggestion(nextEmail: string, nextAlias: string) {
    if (usernameTouched) return;
    setUsername(suggestUsernameFrom(nextEmail, nextAlias));
  }

  function finishOnboarding() {
    router.replace(redirect.startsWith("/") ? redirect : "/");
    router.refresh();
  }

  async function onSubmitAccount(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "sign-in") {
        await signIn(email, password);
        finishOnboarding();
        return;
      }

      const handle = sanitizeUsername(username);
      if (handle.length < 3) {
        setError("Username must be at least 3 characters (letters, numbers, _ or -).");
        return;
      }
      const alias = aliasName.trim();
      if (!alias) {
        setError("Alias name is required.");
        return;
      }
      await signUp({
        email,
        password,
        username: handle,
        displayName: alias,
      });
      setStep("bio");
      router.refresh();
    } catch (err: unknown) {
      setError(formatAuthError(err, "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function onSaveBio(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = bio.trim();
    if (trimmed.length > BIO_MAX) {
      setError(`Bio must be at most ${BIO_MAX} characters.`);
      return;
    }
    setLoading(true);
    try {
      if (trimmed) {
        await updateMe({ bio: trimmed });
      }
      finishOnboarding();
    } catch (err: unknown) {
      setError(formatAuthError(err, "Could not save bio. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  if (mode === "sign-up" && step === "bio") {
    return (
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-xl">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="The Proven X" className="h-10 w-10" />
          </Link>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Step 2 of 2
          </p>
          <h1 className="font-serif text-2xl tracking-tight text-foreground">
            Add a short bio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional — tell the community a bit about yourself. You can skip and add this later in
            settings.
          </p>
        </div>

        <form onSubmit={onSaveBio} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Lived in Riyadh for 8 years — happy to help with residency and housing questions."
              className="min-h-[140px] resize-y rounded-xl text-base"
              maxLength={BIO_MAX}
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.trim().length}/{BIO_MAX}
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : bio.trim() ? "Save and continue" : "Continue"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            disabled={loading}
            onClick={finishOnboarding}
          >
            Skip for now
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-xl">
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="The Proven X" className="h-10 w-10" />
        </Link>
        {mode === "sign-up" ? (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Step 1 of 2
          </p>
        ) : null}
        <h1 className="font-serif text-2xl tracking-tight text-foreground">
          {mode === "sign-in" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "sign-in"
            ? "Sign in to ask, answer, and vote"
            : "Join the community — you can add a bio in the next step"}
        </p>
      </div>

      <form onSubmit={onSubmitAccount} className="space-y-4">
        {mode === "sign-up" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  const next = e.target.value;
                  setEmail(next);
                  syncUsernameSuggestion(next, aliasName);
                }}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aliasName">Alias name</Label>
              <Input
                id="aliasName"
                value={aliasName}
                onChange={(e) => {
                  const next = e.target.value;
                  setAliasName(next);
                  syncUsernameSuggestion(email, next);
                }}
                autoComplete="nickname"
                required
              />
              <p className="text-xs text-muted-foreground">
                How your name appears in the community. It does not have to be unique and may
                include spaces.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                >
                  @
                </span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsernameTouched(true);
                    setUsername(sanitizeUsername(e.target.value));
                  }}
                  autoComplete="username"
                  minLength={3}
                  maxLength={30}
                  className="pl-7"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Your unique handle for your profile link and mentions. No spaces — only letters,
                numbers, underscores, and hyphens. Suggested from your email (or alias); you can
                edit it.
              </p>
            </div>
          </>
        )}

        {mode === "sign-in" && (
          <div className="space-y-2">
            <Label htmlFor="email">Email (adnan.akhonbay@gmail.com)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="adnan.akhonbay@gmail.com"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              {mode === "sign-in" ? "Password (theprovenx@1234)" : "Password"}
            </Label>
            {mode === "sign-in" && (
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            placeholder={mode === "sign-in" ? "theprovenx@1234" : undefined}
            minLength={8}
            required
          />
        </div>
        {mode === "sign-in" ? (
          <p className="text-xs text-muted-foreground">
            Username: <span className="font-medium text-foreground">aakhonbay</span>
            {" · "}
            Role: platform_owner
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? "Please wait…"
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "sign-in" ? (
          <>
            New here?{" "}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
