export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) return `https://${vercel}`;

  return "http://localhost:21400";
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function getApiBaseUrl(): string {
  return (
    process.env.API_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:8080"
  );
}

export const SITE_NAME = "The ProvenX";
export const SITE_DESCRIPTION =
  "A niche Q&A community for hard-to-find knowledge: policies, regulations, unwritten rules, and practical advice.";
