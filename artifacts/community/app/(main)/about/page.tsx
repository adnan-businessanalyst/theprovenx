import type { Metadata } from "next";
import About from "@/views/about";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Learn about The Proven X — a community for niche, hard-to-find knowledge and proven answers.",
  path: "/about",
});

export default function AboutPage() {
  return <About />;
}
