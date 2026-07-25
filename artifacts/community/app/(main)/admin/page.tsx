import type { Metadata } from "next";
import { Suspense } from "react";
import Admin from "@/views/admin";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  );
}
