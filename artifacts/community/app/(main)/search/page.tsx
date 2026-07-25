import type { Metadata } from "next";
import { Suspense } from "react";
import Search from "@/views/search";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Search",
  description: "Search questions, answers, and topics on The Proven X.",
  path: "/search",
});

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <Search />
    </Suspense>
  );
}
