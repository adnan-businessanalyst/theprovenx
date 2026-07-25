import type { Metadata } from "next";
import Contributors from "@/views/contributors";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contributors",
  description: "Meet top contributors and verifiers in The Proven X community.",
  path: "/contributors",
});

export default function ContributorsPage() {
  return <Contributors />;
}
