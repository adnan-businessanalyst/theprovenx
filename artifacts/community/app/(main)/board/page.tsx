import type { Metadata } from "next";
import Board from "@/views/board";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "My Board",
  path: "/board",
  noIndex: true,
});

export default function BoardPage() {
  return <Board />;
}
