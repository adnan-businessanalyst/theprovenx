import type { Metadata } from "next";
import Blog from "@/views/blog";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "News, guides, and updates from The Proven X community.",
  path: "/blog",
});

export default function BlogPage() {
  return <Blog />;
}
