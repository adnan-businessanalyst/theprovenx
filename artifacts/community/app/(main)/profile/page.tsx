import type { Metadata } from "next";
import Settings from "@/views/settings";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Profile Settings",
  path: "/profile",
  noIndex: true,
});

export default function ProfilePage() {
  return <Settings />;
}
