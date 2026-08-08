import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "./site";
const DEFAULT_OG_IMAGE = absoluteUrl("/og-default.png");

type BuildMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  ogType?: "website" | "article" | "profile";
  image?: string;
};

export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  noIndex = false,
  ogType = "website",
  image = DEFAULT_OG_IMAGE,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: ogType === "profile" ? "profile" : ogType,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
