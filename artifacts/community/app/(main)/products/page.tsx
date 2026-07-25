import type { Metadata } from "next";
import Products from "@/views/products";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Products",
  description: "Explore The Proven X products and community offerings.",
  path: "/products",
});

export default function ProductsPage() {
  return <Products />;
}
