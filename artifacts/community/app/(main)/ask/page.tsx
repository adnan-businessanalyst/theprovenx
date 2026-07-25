import type { Metadata } from "next";
import AskQuestion from "@/views/ask";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Ask a Question",
  description: "Ask the community a niche question and get proven answers.",
  path: "/ask",
  noIndex: true,
});

export default function AskPage() {
  return <AskQuestion />;
}
