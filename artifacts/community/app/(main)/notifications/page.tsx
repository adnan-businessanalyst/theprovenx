import type { Metadata } from "next";
import Notifications from "@/views/notifications";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Notifications",
  path: "/notifications",
  noIndex: true,
});

export default function NotificationsPage() {
  return <Notifications />;
}
