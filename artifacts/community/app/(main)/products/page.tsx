import type { Metadata } from "next";
import Products from "@/views/products";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Products",
  description:
    "Website development and e-store packages from TheProvenX — Launch, Growth, and Scale tiers with clear limits for informative sites and online stores.",
  path: "/products",
});

export default function ProductsPage() {
  return <Products />;
}
