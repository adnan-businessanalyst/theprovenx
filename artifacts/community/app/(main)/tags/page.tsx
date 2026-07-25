import type { Metadata } from "next";
import Tags from "@/views/tags";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Tags",
  description: "Browse topics and tags across The Proven X community.",
  path: "/tags",
});

export default function TagsPage() {
  return <Tags />;
}
